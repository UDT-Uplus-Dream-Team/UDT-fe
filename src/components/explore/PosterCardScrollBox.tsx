// 영화(PosterCard) 카드를 모아 놓은 스크롤 박스 컴포넌트
import { PosterCardScrollBoxProps } from '@type/explore/Explore';
import { PosterCard } from './PosterCard';

export const PosterCardScrollBox = ({
  title,
  SimpleMovieData,
}: PosterCardScrollBoxProps) => {
  const handlePosterClick = (movieId: number) => {
    console.log(`영화 ID ${movieId} 클릭됨`);
    // TODO: 영화 상세 페이지로 이동하는 로직 추가
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <span className="text-xl text-primary-600">{title}</span>
      <div className="w-full h-auto flex flex-row gap-3 overflow-x-auto scrollbar-hide">
        {SimpleMovieData.map((movie) => (
          <PosterCard
            key={movie.id}
            title={movie.title}
            image={movie.image}
            isTitleVisible={true}
            onClick={() => handlePosterClick(movie.id)}
          />
        ))}
      </div>
    </div>
  );
};
