'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Card, CardContent } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';

import { Search, Plus, Users, Upload, Check, Loader2 } from 'lucide-react';
import { useInfiniteCastsSearch } from '@hooks/admin/useGetCastsSearch';
import { usePostUploadImages } from '@hooks/admin/usePostUploadImages';
import { usePostAdminCasts } from '@hooks/admin/usePostCasts';
import Image from 'next/image';
import { Cast } from '@type/admin/Content';
import { showSimpleToast } from '@components/common/Toast';

interface CastSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCasts: (casts: Cast[]) => void;
  existingCasts: Cast[];
}

export default function CastSearchDialog({
  open,
  onOpenChange,
  onSelectCasts,
  existingCasts,
}: CastSearchDialogProps) {
  const [searchInput, setSearchInput] = useState(''); // 입력값
  const [searchTerm, setSearchTerm] = useState(''); // 실제 검색어
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCasts, setSelectedCasts] = useState<Cast[]>([]);
  const [newCast, setNewCast] = useState({
    castName: '',
    castImageFile: null as File | null,
    castImageUrl: '',
  });

  // blob URL cleanup
  useEffect(() => {
    return () => {
      if (newCast.castImageUrl && newCast.castImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(newCast.castImageUrl);
      }
    };
  }, [newCast.castImageUrl]);

  // 무한 스크롤용 ref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const castImageRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드 및 배우 등록 훅
  const uploadImagesMutation = usePostUploadImages();
  const postCastsMutation = usePostAdminCasts();

  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteCastsSearch({
    name: searchTerm,
    size: 20,
  });

  // Intersection Observer로 하단 감지하여 무한 스크롤 구현
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    const element = loadMoreRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 검색 버튼 클릭 시 검색 실행
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // API 검색 결과를 페이지별로 합쳐서 하나의 배열로 만듦
  const searchResults = data?.pages.flatMap((page) => page.item) || [];

  // 이미 추가된 출연진을 제외한 사용 가능한 배우 목록
  const availableCasts = searchResults.filter(
    (cast) =>
      !existingCasts.some((existing) => existing.castName === cast.castName),
  );

  // 개별 배우 선택/해제 토글 처리
  const handleCastToggle = (cast: Cast, checked: boolean) => {
    if (checked) {
      setSelectedCasts([...selectedCasts, cast]);
    } else {
      setSelectedCasts(
        selectedCasts.filter((selected) => selected.castId !== cast.castId),
      );
    }
  };

  // 현재 화면에 보이는 모든 배우 선택
  const handleSelectAllVisible = () => {
    const newSelections = availableCasts.filter(
      (cast) =>
        !selectedCasts.some((selected) => selected.castId === cast.castId),
    );
    setSelectedCasts([...selectedCasts, ...newSelections]);
  };

  // 선택된 모든 배우 해제
  const handleDeselectAll = () => {
    setSelectedCasts([]);
  };

  // 선택 완료 시 부모 컴포넌트에 선택된 배우 목록 전달
  const handleConfirmSelection = () => {
    onSelectCasts(selectedCasts);
    onOpenChange(false);
    setSelectedCasts([]);
    setSearchInput('');
    setSearchTerm('');
    setShowAddForm(false);
  };

  // 새 배우 등록 처리 (이미지 업로드 + 배우 등록)
  const handleAddNewCast = async () => {
    if (!newCast.castName.trim()) return;

    let imageUrl = newCast.castImageUrl;

    // 이미지가 업로드된 경우 서버에 업로드
    if (newCast.castImageFile) {
      try {
        const fileArray = [newCast.castImageFile];
        const uploadResponse =
          await uploadImagesMutation.mutateAsync(fileArray);

        if (uploadResponse.data.uploadedFileUrls.length > 0) {
          imageUrl = uploadResponse.data.uploadedFileUrls[0];
        }
      } catch {
        showSimpleToast.error({ message: '이미지 업로드에 실패했습니다.' });
        return;
      }
    } else if (
      newCast.castImageUrl &&
      newCast.castImageUrl.startsWith('blob:')
    ) {
      // blob URL인 경우 빈 문자열로 설정
      imageUrl = '';
    }

    // 배우 등록
    const castData = {
      casts: [
        {
          castName: newCast.castName,
          castImageUrl: imageUrl || '',
        },
      ],
    };

    try {
      const response = await postCastsMutation.mutateAsync(castData);

      if (response.castIds.length > 0) {
        // 등록된 배우를 선택된 배우 목록에 추가
        const newCastItem: Cast = {
          castId: response.castIds[0],
          castName: newCast.castName,
          castImageUrl: imageUrl || '',
        };

        setSelectedCasts([...selectedCasts, newCastItem]);

        // 폼 초기화
        setNewCast({
          castName: '',
          castImageFile: null,
          castImageUrl: '',
        });
        setShowAddForm(false);
        showSimpleToast.success({ message: '배우 등록이 완료되었습니다.' });
      }
    } catch {
      showSimpleToast.error({
        message: '배우 등록에 실패했습니다.',
      });
    }
  };

  // 이미지 파일 선택 시 미리보기 URL 생성
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 기존 blob URL 정리
      if (newCast.castImageUrl && newCast.castImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(newCast.castImageUrl);
      }

      // 새로운 blob URL 생성 및 상태 업데이트
      const imageUrl = URL.createObjectURL(file);
      setNewCast({
        ...newCast,
        castImageFile: file,
        castImageUrl: imageUrl,
      });
    }
  };

  // 폼 상태 초기화
  const resetForm = () => {
    setSearchInput('');
    setSearchTerm('');
    setShowAddForm(false);
    setSelectedCasts([]);
    setNewCast({
      castName: '',
      castImageFile: null,
      castImageUrl: '',
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>출연진 검색 및 추가</DialogTitle>
          <DialogDescription>
            배우 이름을 입력하고 엔터키를 눌러 검색하세요. 여러 명을 선택할 수
            있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm ? (
            <>
              {/* 검색 입력 */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="배우 이름을 입력하고 엔터키를 누르세요..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={!searchInput.trim()}>
                  검색
                </Button>
              </div>

              {/* 선택된 배우 표시 */}
              {selectedCasts.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-800">
                      선택된 배우 ({selectedCasts.length}명)
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      전체 해제
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCasts.map((cast) => (
                      <Badge
                        key={cast.castId}
                        className="bg-blue-100 text-blue-800"
                      >
                        {cast.castName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 검색 결과 */}
              {searchTerm && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      "{searchTerm}" 검색 결과 ({availableCasts.length}개)
                    </h4>
                    <div className="flex gap-2">
                      {availableCasts.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSelectAllVisible}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          전체 선택
                        </Button>
                      )}
                      {availableCasts.length === 0 && !isLoading && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowAddForm(true);
                            setNewCast({ ...newCast, castName: searchTerm });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />새 배우 등록
                        </Button>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                          <p>검색 중...</p>
                        </div>
                      ) : isError ? (
                        <div className="text-center py-8 text-red-500">
                          <p>검색 중 오류가 발생했습니다.</p>
                        </div>
                      ) : availableCasts.length > 0 ? (
                        <>
                          {availableCasts.map((cast: Cast) => (
                            <Card
                              key={cast.castId}
                              className="hover:bg-gray-50"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCasts.some(
                                      (selected) =>
                                        selected.castId === cast.castId,
                                    )}
                                    onChange={(e) =>
                                      handleCastToggle(cast, e.target.checked)
                                    }
                                    className="w-4 h-4"
                                  />
                                  {cast.castImageUrl ? (
                                    <Image
                                      src={
                                        cast.castImageUrl || '/placeholder.svg'
                                      }
                                      alt={cast.castName}
                                      width={48}
                                      height={48}
                                      unoptimized
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                      <Users className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {cast.castName}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {/* 무한 스크롤 로딩 인디케이터 */}
                          {isFetchingNextPage && (
                            <div className="text-center py-4">
                              <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                            </div>
                          )}

                          {/* 무한 스크롤 트리거 */}
                          {hasNextPage && (
                            <div ref={loadMoreRef} className="h-4" />
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
                          <p className="text-sm">
                            새 배우 등록 버튼을 클릭하여 추가하세요.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {!searchTerm && !searchInput && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>배우 이름을 입력하고 엔터키를 눌러 검색하세요.</p>
                  <p className="text-sm">여러 명을 선택할 수 있습니다.</p>
                </div>
              )}
            </>
          ) : (
            /* 새 배우 등록 폼 */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">새 배우 등록</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  검색으로 돌아가기
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    배우 이름 *
                  </label>
                  <Input
                    value={newCast.castName}
                    onChange={(e) =>
                      setNewCast({ ...newCast, castName: e.target.value })
                    }
                    placeholder="배우 이름"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    프로필 이미지
                  </label>
                  {/* 버튼 + 미리보기 영역 */}
                  <div className="flex gap-2 items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={castImageRef}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById('cast-image-upload')?.click()
                      }
                      className="flex-1 max-w-[160px]"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>

                    {/* 미리보기 이미지 */}
                    {newCast.castImageUrl && (
                      <Image
                        src={newCast.castImageUrl || '/placeholder.svg'}
                        alt="미리보기"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleAddNewCast}
                  disabled={
                    !newCast.castName.trim() ||
                    uploadImagesMutation.isPending ||
                    postCastsMutation.isPending
                  }
                >
                  {uploadImagesMutation.isPending ||
                  postCastsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    '배우 등록 및 선택에 추가'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 하단 액션 버튼 */}
          {!showAddForm && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedCasts.length === 0}
                className="min-w-[120px]"
              >
                {selectedCasts.length > 0
                  ? `${selectedCasts.length}명 추가`
                  : '출연진 추가'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
