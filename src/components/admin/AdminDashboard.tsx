'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { ScrollArea } from '@components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Plus } from 'lucide-react';

import type { ContentWithoutId } from '@type/admin/Content';
import { useInfiniteAdminContentList } from '@hooks/admin/useGetContentList';
import { usePostContent } from '@hooks/admin/usePostContent';
import { useUpdateContent } from '@hooks/admin/usePatchContent';
import { useDeleteContent } from '@hooks/admin/useDeleteContent';
import { useGetContentDetail } from '@hooks/admin/useGetContentDetail';
import ContentForm from './contentForm';
import ContentDetail from './contentDetail';
import ContentCard from './contentCard';
import SearchFilter from './searchFilter';
import ContentChart from './contentChart';

export default function AdminDashboard() {
  // 무한 스크롤용 필터 상태
  const size = 20;
  const [categoryType, setCategoryType] = useState<string>('');
  // 무한 스크롤 쿼리
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminContentList({ size, categoryType });

  // Intersection Observer로 하단 감지
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const postContent = usePostContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  // 상태 관리 (상세/수정/추가 등)
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 상세/수정 데이터 fetch (상세 모달에서만 사용)
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetContentDetail(
    isDetailDialogOpen ? (selectedContentId ?? undefined) : undefined,
  );

  const {
    data: editData,
    isLoading: isEditLoading,
    isError: isEditError,
  } = useGetContentDetail(
    isEditDialogOpen ? (selectedContentId ?? undefined) : undefined,
  );

  // 상세/수정 모달 오픈 핸들러
  const openDetailDialog = useCallback((contentId: number) => {
    setSelectedContentId(contentId);
    setIsDetailDialogOpen(true);
  }, []);
  const openEditDialog = useCallback((contentId: number) => {
    setSelectedContentId(contentId);
    setIsEditDialogOpen(true);
  }, []);
  const closeDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(false);
    setSelectedContentId(null);
  }, []);
  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  // 필터 변경 시 refetch
  const handleFilterChange = (type: string) => {
    setCategoryType(type);
  };

  // 필터링된 콘텐츠 목록 (필터링 api 연동으로 바뀔 예정)

  const handleAddContent = useCallback(
    (contentData: ContentWithoutId) => {
      postContent.mutate(contentData, {
        onSuccess: () => setIsAddDialogOpen(false),
      });
    },
    [postContent],
  );

  // 수정
  const handleEditContent = useCallback(
    (contentData: ContentWithoutId) => {
      if (selectedContentId) {
        updateContent.mutate(
          { contentId: selectedContentId, data: contentData },
          {
            onSuccess: () => {
              setIsEditDialogOpen(false);
              setSelectedContentId(null);
            },
          },
        );
      }
    },
    [updateContent, selectedContentId],
  );

  // 삭제
  const handleDeleteContent = useCallback(
    (contentId: number) => {
      deleteContent.mutate(contentId, {
        onSuccess: () => {
          setIsDetailDialogOpen(false);
          setSelectedContentId(null);
        },
      });
    },
    [deleteContent],
  );

  // 로딩/에러 처리
  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  // 모든 페이지의 콘텐츠 합치기
  const allContents = data?.pages.flatMap((page) => page.item) || [];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            백오피스 관리자 페이지
          </h1>
          <p className="text-gray-600">콘텐츠 현황 및 관리</p>
        </div>

        {/* 콘텐츠 분포 차트 */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl">
            <ContentChart contents={allContents} />
          </div>
        </div>

        {/* 콘텐츠 목록 */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black text-2xl font-bold mt-2 mb-2">
                  등록된 콘텐츠 목록
                </CardTitle>
                <CardDescription>
                  전체 {allContents.length}개의 콘텐츠
                </CardDescription>
              </div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-5 flex items-center font-semibold text-md min-w-[160px] cursor-pointer"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />새 항목 추가
              </Button>
            </div>

            {/* 검색 및 필터 */}
            <div className="mt-4">
              <SearchFilter
                filterType={categoryType}
                onFilterChange={handleFilterChange}
              />
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3 mb-3">
                {allContents.map((content) => (
                  <ContentCard
                    key={content.contentId}
                    content={content}
                    onView={openDetailDialog}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteContent}
                  />
                ))}
                <div ref={loadMoreRef} style={{ height: 1 }} />
              </div>
            </ScrollArea>
            {isFetchingNextPage && (
              <div className="text-center py-2">불러오는 중...</div>
            )}
            {!hasNextPage && (
              <div className="text-center py-2">더 이상 데이터가 없습니다.</div>
            )}
          </CardContent>
        </Card>

        {/* 다이얼로그들 */}
        {isAddDialogOpen && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[75vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 정보 추가</DialogTitle>
                <DialogDescription>
                  콘텐츠/인물 정보를 등록해주세요.
                </DialogDescription>
              </DialogHeader>
              <ContentForm
                onSave={handleAddContent}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[75vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>정보 수정</DialogTitle>
                <DialogDescription>
                  콘텐츠 정보를 수정해주세요.
                </DialogDescription>
              </DialogHeader>
              {isEditLoading ? (
                <div>불러오는 중...</div>
              ) : isEditError || !editData ? (
                <div>수정 정보를 불러오지 못했습니다.</div>
              ) : (
                <ContentForm
                  content={editData}
                  onSave={handleEditContent}
                  onCancel={closeEditDialog}
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        {isDetailDialogOpen && selectedContentId && (
          <Dialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          >
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>콘텐츠 상세 정보</DialogTitle>
              </DialogHeader>
              {isDetailLoading ? (
                <div>상세 정보를 불러오는 중...</div>
              ) : isDetailError || !detailData ? (
                <div>상세 정보를 불러오지 못했습니다.</div>
              ) : (
                <ContentDetail
                  content={{ ...detailData, contentId: selectedContentId }}
                  onEdit={() => {
                    closeDetailDialog();
                    openEditDialog(selectedContentId);
                  }}
                  onClose={closeDetailDialog}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
