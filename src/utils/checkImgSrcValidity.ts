// 이미지 소스의 유효성을 검사하는 유틸리티 함수
export function checkImgSrcValidity(rawSrc?: string): rawSrc is string {
  return (
    typeof rawSrc === 'string' &&
    (rawSrc.startsWith('/') ||
      rawSrc.startsWith('http://') ||
      rawSrc.startsWith('https://'))
  );
}
