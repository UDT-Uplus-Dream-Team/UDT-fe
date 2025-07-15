'use client';

import { useCallback, useState } from 'react';
import type { Content } from '@type/admin/Content';

export const useContentManagement = (initialContents: Content[]) => {
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  // 추후 수정 예정
  const addContent = useCallback((contentData: Omit<Content, 'contentId'>) => {
    setContents((prev) => {
      const maxId = Math.max(...prev.map((c) => c.contentId), 0);
      const newContent: Content = {
        ...contentData,
        contentId: maxId + 1,
      };
      return [...prev, newContent];
    });
  }, []);

  const updateContent = useCallback((contentData: Content) => {
    setContents((prev) =>
      prev.map((content) =>
        content.contentId === contentData.contentId ? contentData : content,
      ),
    );
  }, []);

  const deleteContent = useCallback((id: number) => {
    setContents((prev) => prev.filter((content) => content.contentId !== id));
  }, []);

  const selectContent = useCallback((content: Content | null) => {
    setSelectedContent(content);
  }, []);

  const setEditContent = useCallback((content: Content | null) => {
    setEditingContent(content);
  }, []);

  return {
    contents,
    selectedContent,
    editingContent,
    addContent,
    updateContent,
    deleteContent,
    selectContent,
    setEditContent,
  };
};
