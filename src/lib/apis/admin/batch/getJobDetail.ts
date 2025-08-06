import axiosInstance from '@lib/apis/axiosInstance';
import { BatchJobDetailType } from '@type/admin/batch';

// 배치 결과 상세보기 API (배치 결과 상세보기 페이지에서 사용, JSON 형식은 문자열로 반환)
export const getJobDetail = async (
  jobId: number,
  jobType: string,
): Promise<string> => {
  let kind;

  // 배치 작업 유형에 따라 조회할 데이터 종류 결정
  if (jobType === 'UPDATE') {
    kind = 'updatejob';
  } else if (jobType === 'REGISTER') {
    kind = 'registerjob';
  } else if (jobType === 'DELETE') {
    kind = 'deletejob';
  } else {
    throw new Error('유효하지 않은 Job Type입니다.');
  }

  // 유형에 따라서 데이터 조회 api 선정
  const { data } = await axiosInstance.get<BatchJobDetailType[]>(
    `/api/admin/batch/contents/${kind}/${jobId}`,
  );

  console.log('data', JSON.stringify(data, null, 2)); // 예쁘게 들여쓰기

  return JSON.stringify(data, null, 2); // 들여쓰기 2칸
};
