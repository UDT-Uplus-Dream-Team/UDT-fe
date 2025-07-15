// YouTube 자동 재생을 위한 URL 형식 수정
export const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';

  // YouTube URL에서 video ID 추출
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  )?.[1];

  if (!videoId) return '';

  // 자동 재생 및 음소거 파라미터 추가
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
};
