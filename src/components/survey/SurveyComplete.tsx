import { Button } from '@components/ui/button';
import { useRouter } from 'next/navigation';

export default function SurveyComplete() {
  const router = useRouter();

  const handleNextClick = () => {
    router.push('/');
  };

  return (
    <div className="h-[100svh] flex flex-col items-center pt-17 pb-10">
      {/* 중앙 정렬된 텍스트 */}
      <div className="flex-1 flex items-center justify-center text-center text-white">
        <h2 className="text-white font-bold text-[20px]">
          설문 조사가 완료 되었어요!
          <br /> 다시 한 번 로그인해 주세요
        </h2>
      </div>

      {/* 아래쪽 버튼 */}
      <div className="pb-4">
        <Button
          onClick={handleNextClick}
          className="min-w-[99px] min-h-[41px] bg-white/20 text-white rounded-[80px] px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-white/30 cursor-pointer"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
