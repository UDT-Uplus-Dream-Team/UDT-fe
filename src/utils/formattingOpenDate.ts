// openDate를 "YYYY-MM-DD" 형식으로 파싱 해주는 유틸 함수
export function formattingOpenDate(dateString?: string | null): string {
  if (!dateString) return '개봉일 정보 없음';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '개봉일 정보 없음';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return '개봉일 정보 없음';
  }
}
