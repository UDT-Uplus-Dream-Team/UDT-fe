// 유튜브 영상 재생 시 최대한 깔끔하게 보이도록 링크를 수정하는 util 메소드
export const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';

  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  )?.[1];

  if (!videoId) return '';

  // 최대한 깔끔하게 보이도록 파라미터 추가
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`;
};
