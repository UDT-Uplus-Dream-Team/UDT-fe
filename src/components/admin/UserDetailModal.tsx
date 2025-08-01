'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import {
  ThumbsUp,
  ThumbsDown,
  EyeOff,
  Trash2,
  UserX,
  Mail,
} from 'lucide-react';
import { UserDetailProps } from '@type/admin/user';

export default function UserDetailModal({
  user,
  isOpen,
  onClose,
  onDelete,
  onDeleteFeedback,
}: UserDetailProps) {
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<{
    like: boolean;
    dislike: boolean;
    uninterested: boolean;
  }>({
    like: false,
    dislike: false,
    uninterested: false,
  });

  const handleToggleFeedback = (type: 'like' | 'dislike' | 'uninterested') => {
    setSelectedFeedbacks((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDeleteSelected = () => {
    const typesToDelete: string[] = [];
    if (selectedFeedbacks.like) typesToDelete.push('like');
    if (selectedFeedbacks.dislike) typesToDelete.push('dislike');
    if (selectedFeedbacks.uninterested) typesToDelete.push('uninterested');

    if (typesToDelete.length > 0) {
      onDeleteFeedback(user.memberId, typesToDelete);
      setSelectedFeedbacks({
        like: false,
        dislike: false,
        uninterested: false,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const hasSelectedFeedbacks =
    selectedFeedbacks.like ||
    selectedFeedbacks.dislike ||
    selectedFeedbacks.uninterested;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0"
        style={{
          width: '85vw',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              회원 상세 정보
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {user.name}님의 상세 정보 및 관리
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 본문 - 스크롤 가능 */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* 프로필 헤더 */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={'/images/default-profile.png'}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-gray-600">회원 ID: {user.memberId}</p>
                  <Badge
                    className={`${
                      user.surveyCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {user.surveyCompleted ? '정회원' : '임시회원'}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => onDelete(user.memberId)}
                variant="destructive"
                size="sm"
                className="w-full lg:w-auto flex items-center justify-center space-x-2"
              >
                <UserX className="h-4 w-4" />
                <span>계정 삭제</span>
              </Button>
            </div>

            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>기본 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">이메일</p>
                    <p className="text-lg break-all">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">가입일</p>
                    <p className="text-lg">{formatDate(user.joinDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 피드백 관리 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trash2 className="h-5 w-5" />
                  <span>피드백 삭제 관리</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-sm">
                  삭제할 피드백 유형을 선택하세요.
                </p>

                {/* 피드백 카드들 - 강제 가로 배치 */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* 좋아요 */}
                  <div
                    className={`flex-1 p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedFeedbacks.like
                        ? 'border-green-300 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50'
                    }`}
                    onClick={() => handleToggleFeedback('like')}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <ThumbsUp className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 mb-2">좋아요</p>
                      <p className="text-3xl font-bold text-green-600 mb-3">
                        {user.likeCount}
                      </p>
                      {selectedFeedbacks.like && (
                        <div className="text-sm text-green-700 font-medium bg-green-100 p-2 rounded">
                          ✓ 삭제 대상으로 선택됨
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 싫어요 */}
                  <div
                    className={`flex-1 p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedFeedbacks.dislike
                        ? 'border-red-300 bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/50'
                    }`}
                    onClick={() => handleToggleFeedback('dislike')}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <ThumbsDown className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 mb-2">싫어요</p>
                      <p className="text-3xl font-bold text-red-600 mb-3">
                        {user.dislikeCount}
                      </p>
                      {selectedFeedbacks.dislike && (
                        <div className="text-sm text-red-700 font-medium bg-red-100 p-2 rounded">
                          ✓ 삭제 대상으로 선택됨
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 관심없음 */}
                  <div
                    className={`flex-1 p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedFeedbacks.uninterested
                        ? 'border-orange-300 bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                    onClick={() => handleToggleFeedback('uninterested')}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <EyeOff className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 mb-2">
                        관심없음
                      </p>
                      <p className="text-3xl font-bold text-orange-600 mb-3">
                        {user.uninterestedCount}
                      </p>
                      {selectedFeedbacks.uninterested && (
                        <div className="text-sm text-orange-700 font-medium bg-orange-100 p-2 rounded">
                          ✓ 삭제 대상으로 선택됨
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 피드백 삭제 버튼 */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={handleDeleteSelected}
                    disabled={!hasSelectedFeedbacks}
                    size="lg"
                    className={`px-8 py-3 ${
                      hasSelectedFeedbacks
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    선택된 피드백 삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
