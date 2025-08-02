import { ElementType } from 'react';

// '배치 대기열' 및 '배치 결과' 페이지에서 사용할 타입을 정의하는 파일입니다

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 볼 수 있는 카드 레이아웃의 props 타입
export interface BatchTopCardDataItem {
  name: string;
  value: number;
  color: string;
  icon: ElementType;
}

// '배치 대기열' 페이지에서 해당 요청의 종류를 표현하기 위한 색상 설정
export const requestTypeConfigInBatchRequestQueue = {
  CANCEL: { label: '취소됨', color: 'bg-red-100 text-red-800' },
  PENDING: { label: '대기중', color: 'bg-orange-100 text-orange-800' },
};

// '배치 결과' 페이지에서 해당 요청의 종류를 표현하기 위한 색상 설정
export const requestTypeConfigInBatchResult = {
  FAIL: { label: '실패', color: 'bg-red-100 text-red-800' },
  PARTIAL_SUCCESS: {
    label: '부분성공',
    color: 'bg-orange-100 text-orange-800',
  },
  SUCCESS: { label: '성공', color: 'bg-green-100 text-green-800' },
};

// 배치 요청 목록 모의 데이터
// TODO: 나중에 api 연동 후엔 삭제 예정
export const mockRequestsInBatchRequestQueue = [
  {
    logId: 1,
    memberName: '허준호',
    title: '콘텐츠 등록',
    generateTime: '2025-08-01T09:15:00.000Z',
    status: 'PENDING',
  },
  {
    logId: 2,
    memberName: '허준호',
    title: '콘텐츠 수정',
    generateTime: '2025-08-01T14:32:28.123Z',
    status: 'PENDING',
  },
  {
    logId: 3,
    memberName: '허준호',
    title: '콘텐츠 삭제',
    generateTime: '2025-08-02T06:35:40.271Z',
    status: 'CANCEL',
  },
  {
    logId: 4,
    memberName: '허준호',
    title: '사용자 추천 피드백',
    generateTime: '2025-08-02T12:20:15.789Z',
    status: 'PENDING',
  },
  {
    logId: 5,
    memberName: '허준호',
    title: '콘텐츠 등록',
    generateTime: '2025-08-03T08:51:03.501Z',
    status: 'PENDING',
  },
  {
    logId: 6,
    memberName: '허준호',
    title: '콘텐츠 수정',
    generateTime: '2025-08-03T17:04:22.005Z',
    status: 'PENDING',
  },
  {
    logId: 7,
    memberName: '허준호',
    title: '사용자 추천 피드백',
    generateTime: '2025-08-04T01:43:59.842Z',
    status: 'PENDING',
  },
  {
    logId: 8,
    memberName: '허준호',
    title: '콘텐츠 삭제',
    generateTime: '2025-08-04T11:19:11.111Z',
    status: 'CANCEL',
  },
  {
    logId: 9,
    memberName: '허준호',
    title: '콘텐츠 등록',
    generateTime: '2025-08-05T03:10:36.600Z',
    status: 'PENDING',
  },
  {
    logId: 10,
    memberName: '허준호',
    title: '사용자 추천 피드백',
    generateTime: '2025-08-05T10:55:05.321Z',
    status: 'PENDING',
  },
  {
    logId: 11,
    memberName: '허준서',
    title: '사용자 추천 피드백',
    generateTime: '2025-08-05T10:55:05.321Z',
    status: 'PENDING',
  },
  {
    logId: 12,
    memberName: '허준서',
    title: '사용자 추천 피드백',
    generateTime: '2025-08-05T10:55:05.321Z',
    status: 'PENDING',
  },
];

// TODO: 나중에 api 연동 후엔 삭제 예정
export const mockRequestsInBatchResult = [
  {
    batchId: 1,
    memberId: '허준호',
    title: '콘텐츠 등록',
    generateTime: '2025-07-31 10:15:23:123',
    status: 'PARTIAL_SUCCESS',
  },
  {
    batchId: 2,
    memberId: '허준호',
    title: '콘텐츠 수정',
    generateTime: '2025-08-01 10:15:23:123',
    status: 'PARTIAL_SUCCESS',
  },
  {
    batchId: 3,
    memberId: '허준호',
    title: '콘텐츠 삭제',
    generateTime: '2025-08-02 10:15:23:123',
    status: 'FAIL',
  },
  {
    batchId: 4,
    memberId: '허준호',
    title: '사용자 피드백',
    generateTime: '2025-08-03 10:15:23:123',
    status: 'SUCCESS',
  },
];
