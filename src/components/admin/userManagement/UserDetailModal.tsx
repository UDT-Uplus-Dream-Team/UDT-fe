'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { BarChart3, X } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { UserDetailModalProps } from '@type/admin/user';
import { useUserDetail } from '@hooks/admin/useUserDetail';
import { formatDateHour } from '@utils/admin/formatDate';
import SummaryStats from './SummaryStats';
import GenreChartWrapper from './GenreChartWrapper';

//모달 상세 정보

export default function UserDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const { data: userDetail, isLoading } = useUserDetail(userId, isOpen);

  if (!userDetail && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className=" p-0 gap-0 max-w-none overflow-y-auto"
        style={{ maxWidth: '65vw', maxHeight: '85vh' }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg z-10">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                회원 상세 정보
              </DialogTitle>
              <DialogClose
                aria-label="닫기"
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            {userDetail && (
              <DialogDescription className="text-gray-600">
                {userDetail.name}님의 장르별 선호도 분석
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : userDetail ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={
                          userDetail.profileImageUrl ||
                          '/images/default-profile.png'
                        }
                        alt={userDetail.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                        {userDetail.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {userDetail.name}
                        </h3>
                        <Badge variant="outline" className="bg-white">
                          총
                          {userDetail.totalLikeCount +
                            userDetail.totalDislikeCount +
                            userDetail.totalUninterestedCount}
                          개 피드백
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        회원 ID: {userDetail.id}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        이메일
                      </p>
                      <p className="text-lg break-all">{userDetail.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        최근 접속일
                      </p>
                      <p className="text-lg">
                        {formatDateHour(userDetail.lastLoginAt)}
                      </p>
                    </div>
                  </div>
                  <SummaryStats userDetail={userDetail} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 m-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>장르별 선호도 분석</span>
                    <span className="text-xs text-gray-400 ">
                      (장르별 수치는 하나의 작품이 여러 장르에 속할 경우
                      중복으로 계산됩니다)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDetail.genres && (
                    <GenreChartWrapper genres={userDetail.genres} />
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
