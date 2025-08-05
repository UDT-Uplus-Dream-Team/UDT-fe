import { ElementType } from 'react';
import {
  BookOpen,
  PenLine,
  SkipForward,
  CirclePlus,
  Pencil,
  Trash,
  FolderCheck,
} from 'lucide-react';

// '배치 대기열' 및 '배치 결과' 페이지에서 사용할 타입을 정의하는 곳
export type BatchRequestQueueKeys =
  | 'totalRegister'
  | 'totalUpdate'
  | 'totalDelete'
  | 'total';
export type BatchResultKeys = 'totalRead' | 'totalWrite' | 'totalSkip';
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
  totalWrite: number;
  totalSkip: number;
  startTime?: string; // ISO8601 형식(예: 2024-08-04T08:00:00.000Z)
  endTime?: string;
}

// 전체 배치 집계 결과 조회 시 사용하는 type
export interface BatchResultStatistics {
  totalRead: number;
  totalWrite: number;
  totalSkip: number;
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
  totalRead: { label: '전체', color: '#86efac', icon: BookOpen },
  totalWrite: { label: '성공', color: '#fdba74', icon: PenLine },
  totalSkip: { label: '실패', color: '#fca5a5', icon: SkipForward },
  totalRegister: { label: '콘텐츠 등록', color: '#60a5fa', icon: CirclePlus },
  totalUpdate: { label: '콘텐츠 수정', color: '#a78bfa', icon: Pencil },
  totalDelete: { label: '콘텐츠 삭제', color: '#fca5a5', icon: Trash },
  total: { label: '전체', color: '#22d3ee', icon: FolderCheck },
};

// 배치 결과 페이지에서 사용하는 타입
export const batchResultKeys: BatchResultKeys[] = [
  'totalRead',
  'totalWrite',
  'totalSkip',
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
  type: 'RESERVATION' | 'FAILED' | 'INVALID'; // 예약, 실패, 무효화된 배치 목록 조회
}

export interface GetBatchJobListResponse {
  item: {
    id: number;
    status: BatchJobStatus;
    memberId: number;
    createdAt: string;
    updateAt: string;
    finishedAt: string;
    jobType: BatchJobType;
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
