// 배치 결과 조회할 때 status 표기를 위한 함수
export function getRequestTypeConfigInBatchResult(status: string) {
  switch (status) {
    case 'FAILED':
      return { label: '실패', color: 'bg-red-100 text-red-800' };
    case 'PARTIAL_COMPLETED':
      return { label: '부분성공', color: 'bg-orange-100 text-orange-800' };
    case 'COMPLETED':
      return { label: '성공', color: 'bg-green-100 text-green-800' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
}
