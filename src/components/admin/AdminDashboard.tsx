'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { filterContents } from '@utils/getContentUtils';
import { useAdminContentList } from '@hooks/admin/useGetContentList';
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
  // API 연동: 목록 조회
  const { data, isLoading, isError } = useAdminContentList({
    cursor: 0,
    size: 20,
    categoryType: '영화',
  });
  const postContent = usePostContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  // 상태 관리
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editContent, setEditContent] = useState<ContentWithoutId | null>(null);

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

  useEffect(() => {
    if (editData && isEditDialogOpen) {
      setEditContent(editData);
    }
  }, [editData, isEditDialogOpen]);

  // 상세/수정 모달 오픈 핸들러
  const openDetailDialog = useCallback((contentId: number) => {
    setSelectedContentId(contentId);
    setIsDetailDialogOpen(true);
  }, []);
  const openEditDialog = useCallback((content?: ContentWithoutId) => {
    if (content) {
      setEditContent(content);
      setIsEditDialogOpen(true);
    }
  }, []);
  const closeDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(false);
    setSelectedContentId(null);
  }, []);
  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditContent(null);
  }, []);

  // 필터링된 콘텐츠 목록 (필터링 api 연동으로 바뀔 예정)
  const contents = data?.item || [];
  const filteredContents = useMemo(
    () => filterContents(contents, searchTerm, filterType),
    [contents, searchTerm, filterType],
  );

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
            <ContentChart contents={contents} />
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
                  전체 {filteredContents.length}개의 콘텐츠
                </CardDescription>
              </div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-5 flex items-center font-semibold text-md min-w-[160px] cursor-pointer"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                콘텐츠 추가
              </Button>
            </div>

            {/* 검색 및 필터 */}
            <div className="mt-4">
              <SearchFilter
                searchTerm={searchTerm}
                filterType={filterType}
                onSearchChange={setSearchTerm}
                onFilterChange={setFilterType}
              />
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3 mb-3">
                {filteredContents.map((content) => (
                  <ContentCard
                    key={content.contentId}
                    content={content}
                    onView={openDetailDialog}
                    onEdit={(contentId) => openDetailDialog(contentId)} // 수정도 상세 fetch 후 모달에서 처리
                    onDelete={handleDeleteContent}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 다이얼로그들 */}
        {isAddDialogOpen && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 콘텐츠 추가</DialogTitle>
                <DialogDescription>
                  새로운 콘텐츠 정보를 입력해주세요.
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
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>콘텐츠 수정</DialogTitle>
                <DialogDescription>
                  콘텐츠 정보를 수정해주세요.
                </DialogDescription>
              </DialogHeader>
              {isEditLoading ? (
                <div>불러오는 중...</div>
              ) : isEditError || !editContent ? (
                <div>수정 정보를 불러오지 못했습니다.</div>
              ) : (
                <ContentForm
                  content={editContent}
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
                    openEditDialog(detailData);
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
