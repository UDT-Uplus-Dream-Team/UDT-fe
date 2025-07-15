'use client';

import { useCallback, useMemo, useState } from 'react';
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

import type { Content } from '@type/admin/Content';
import { mockContentList } from '@/data/mock-data';
import { filterContents } from '@utils/content-utils';
import { useContentManagement } from '@hooks/useContentManagement';
import ContentForm from './contentForm';
import ContentDetail from './contentDetail';
import ContentCard from './contentCard';
import SearchFilter from './searchFilter';
import ContentChart from './contentChart';

export default function AdminDashboard() {
  const initialContents = useMemo(() => mockContentList, []);
  const {
    contents,
    selectedContent,
    editingContent,
    addContent,
    updateContent,
    deleteContent,
    selectContent,
    setEditContent,
  } = useContentManagement(initialContents);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // 필터링된 콘텐츠 목록
  const filteredContents = useMemo(
    () => filterContents(contents, searchTerm, filterType),
    [contents, searchTerm, filterType],
  );

  const handleAddContent = useCallback(
    (contentData: Omit<Content, 'contentId'>) => {
      addContent(contentData);
      setIsAddDialogOpen(false);
    },
    [addContent],
  );

  const handleEditContent = useCallback(
    (contentData: Content | Omit<Content, 'contentId'>) => {
      // contentId가 있는 경우에만 수정 수행
      if ('contentId' in contentData) {
        updateContent(contentData);
        setIsEditDialogOpen(false);
        setEditContent(null);
      }
    },
    [updateContent],
  );

  const openEditDialog = useCallback((content: Content) => {
    setEditContent(content);
    setIsEditDialogOpen(true);
  }, []);

  const openDetailDialog = useCallback((content: Content) => {
    selectContent(content);
    setIsDetailDialogOpen(true);
  }, []);
  const closeDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(false);
    selectContent(null);
  }, []);

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
                    onEdit={openEditDialog}
                    onDelete={deleteContent}
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

        {isEditDialogOpen && editingContent && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>콘텐츠 수정</DialogTitle>
                <DialogDescription>
                  콘텐츠 정보를 수정해주세요.
                </DialogDescription>
              </DialogHeader>
              {editingContent && (
                <ContentForm
                  content={editingContent}
                  onSave={handleEditContent}
                  onCancel={() => {
                    setIsEditDialogOpen(false);
                    setEditContent(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        {isDetailDialogOpen && selectedContent && (
          <Dialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          >
            <DialogContent className="w-full max-w-none sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>콘텐츠 상세 정보</DialogTitle>
              </DialogHeader>
              {selectedContent && (
                <ContentDetail
                  content={selectedContent}
                  onEdit={() => {
                    closeDetailDialog();
                    openEditDialog(selectedContent);
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
