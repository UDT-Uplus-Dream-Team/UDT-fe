import type { Meta, StoryObj } from '@storybook/nextjs';
import MovieCard from '@components/profile/MovieCard';
import { MovieCardProps } from '@/types/mypage/Mypage';

const meta: Meta<typeof MovieCard> = {
  title: 'Mypage/MovieCard',
  component: MovieCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MovieCard>;

const dummyProps: MovieCardProps = {
  contentId: 1,
  title: '쇼생크 탈출',
  genres: ['드라마', '감동'],
  runtime: '142분',
  releaseDate: '1994년 9월 23일',
  rating: '15세 이상 관람가',
  description:
    "왕년의 게임 챔피언이었지만 지금은 폐업 직전의 게임샵 주인이 된 '개릿'과 엄마를 잃고 낯선 동네로 이사 온 남매 '헨리'와 '나탈리' 그리고 그들을 돕는 부동산 중개업자 '던'. 이들은 ‘개릿’이 수집한 ‘큐브’가 내뿜는 신비한 빛을 따라가다 어느 폐광 속에 열린 포털을 통해 미지의 공간으로 빨려들어간다. 산과 나무, 구름과 달, 심지어 꿀벌까지 상상하는 모든 것이 네모난 현실이 되는 이곳은 바로 ‘오버월드’. 일찍이 이 세계로 넘어와 완벽하게 적응한 ‘스티브’를 만난 네 사람은 지하세계 ‘네더’를 다스리는 마법사 ‘말고샤’의 침공으로 ‘오버월드’가 위험에 빠졌다는 사실을 알게 된다. 현실 세계로 돌아가기 위해서는 일단 살아남아야 하는 법! 다섯 명의 ‘동글이’들은 ‘오버월드’를 구하기 위해 힘을 합치게 되는데…",
  thumbnailUrl: '/movie.webp',
  platformList: [
    {
      name: '넷플릭스',
      url: 'https://www.netflix.com',
    },
    {
      name: '왓챠',
      url: 'https://watcha.com',
    },
  ],
};

export const Default: Story = {
  args: dummyProps,
};
