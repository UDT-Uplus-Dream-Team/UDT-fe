import { ElementType } from 'react';
import {
  SkipForward,
  CirclePlus,
  Pencil,
  Trash,
  FolderCheck,
  Check,
  OctagonX,
  Layers,
} from 'lucide-react';
import { Category, PlatformInfo } from '@type/admin/Content';

// '배치 대기열' 및 '배치 결과' 페이지에서 사용할 타입을 정의하는 곳
export type BatchRequestQueueKeys =
  | 'totalRegister'
  | 'totalUpdate'
  | 'totalDelete'
  | 'total';
export type BatchResultKeys =
  | 'totalRead'
  | 'totalCompleted'
  | 'totalInvalid'
  | 'totalFailed';
export type BatchJobType = 'REGISTER' | 'UPDATE' | 'DELETE';
export type BatchResultStatus = 'COMPLETED' | 'PARTIAL_COMPLETED' | 'FAILED';
export type BatchJobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'INVALID';

// 배치 결과 목록을 조회할 때 사용하는 type
export interface BatchResult {
  resultId: number;
  type: BatchJobType;
  status: BatchResultStatus;
  totalRead: number;
  totalCompleted: number;
  totalInvalid: number;
  totalFailed: number;
  startTime?: string; // ISO8601 형식(예: 2024-08-04T08:00:00.000Z)
  endTime?: string;
}

// 전체 배치 집계 결과 조회 시 사용하는 type
export interface BatchResultStatistics {
  totalRead: number;
  totalCompleted: number;
  totalInvalid: number;
  totalFailed: number;
}

// 전체 배치 대기열 현황 조회 시 사용하는 type
export interface BatchRequestQueueStatistics {
  total: number;
  totalRegister: number;
  totalUpdate: number;
  totalDelete: number;
}

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 볼 수 있는 카드 레이아웃의 props 타입
export interface BatchTopCardDataItem {
  data: BatchResultStatistics | BatchRequestQueueStatistics;
  color: string;
  icon: ElementType;
}

// 레코드를 이용해서 통계 데이터를 차트로 표현하기 위한 config 값 설정
export const batchTopCardDataConfigMap: Record<
  BatchRequestQueueKeys | BatchResultKeys,
  {
    label: string;
    color: string;
    icon: ElementType;
  }
> = {
  totalRead: { label: '전체', color: '#217aff', icon: FolderCheck }, // 연두
  totalFailed: { label: '실패', color: '#f87171', icon: OctagonX }, // 진한 레드
  totalCompleted: { label: '성공', color: '#00d115', icon: Check }, // 주황
  totalInvalid: { label: '무효화됨', color: '#a3a3a3', icon: SkipForward }, // 회색
  totalRegister: {
    label: '콘텐츠 등록(REGISTER)',
    color: '#60a5fa',
    icon: CirclePlus,
  }, // 파랑
  totalUpdate: { label: '콘텐츠 수정(UPDATE)', color: '#a78bfa', icon: Pencil }, // 보라
  totalDelete: { label: '콘텐츠 삭제(DELETE)', color: '#fca5a5', icon: Trash }, // 연한 빨강
  total: { label: '전체 대기열', color: '#217aff', icon: Layers }, // 하늘
};

// 배치 결과 페이지에서 사용하는 타입
export const batchResultKeys: BatchResultKeys[] = [
  'totalRead',
  'totalCompleted',
  'totalInvalid',
  'totalFailed',
];

// 배치 대기열 페이지에서 사용하는 타입
export const batchRequestQueueKeys: BatchRequestQueueKeys[] = [
  'totalRegister',
  'totalUpdate',
  'totalDelete',
  'total',
];

export interface GetBatchJobListParams {
  cursor: string | null; // optional for 첫 페이지
  size: number;
  type: 'PENDING' | 'FAILED' | 'INVALID'; // 예약, 실패, 무효화된 배치 목록 조회
}

export interface GetBatchJobListResponse {
  item: {
    id: number;
    status: BatchJobStatus;
    memberId: number;
    createdAt: string;
    updateAt: string;
    finishedAt?: string;
    jobType: BatchJobType;
    scheduledAt: string;
  }[];
  nextCursor?: string;
  hasNext: boolean;
}

// 배치 job 목록에서 사용하는 타입
export const requestTypeConfigInBatchJobList = {
  FAILED: { label: '실패', color: 'bg-red-100 text-red-800' },
  INVALID: { label: '무효', color: 'bg-yellow-100 text-yellow-800' },
  COMPLETED: { label: '성공', color: 'bg-green-100 text-green-800' },
  PENDING: { label: '대기중', color: 'bg-orange-100 text-orange-800' },
  PROCESSING: { label: '처리중', color: 'bg-blue-100 text-blue-800' },
};

export type BatchResultBase = {
  batchJobMetricId: number;
  status: string;
  errorCode: string;
  errorMessage: string;
  retryCount: number;
  skipCount: number;
};

// '콘텐츠 등록' 관련 배치 결과 타입
export type RegisterBatchResult = BatchResultBase & {
  jobType: 'REGISTER';
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  openDate: string;
  runningTime: number;
  episode: number;
  rating: string;
  categories: Category[];
  countries: string[];
  directors: number[];
  casts: number[];
  platforms: PlatformInfo[];
};

// '콘텐츠 수정' 관련 배치 결과 타입
export type UpdateBatchResult = RegisterBatchResult & {
  jobType: 'UPDATE';
  contendId: number;
};

// '콘텐츠 삭제' 관련 배치 결과 타입
export type DeleteBatchResult = BatchResultBase & {
  jobType: 'DELETE';
  contentId: number;
};

// 배치 결과 상세보기 할 때 사용할 타입임
export type BatchJobDetailType =
  | RegisterBatchResult
  | UpdateBatchResult
  | DeleteBatchResult;
