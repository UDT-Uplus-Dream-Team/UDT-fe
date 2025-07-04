export default function Home() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center
                 min-h-screen p-8 pb-20 gap-16 sm:p-20
                 font-[family-name:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        {/* 로고나 배경 이미지가 필요하면 여기에 Image 컴포넌트 추가 */}
        <h1 className="text-4xl font-bold tracking-tight">
          환영합니다! {/* 변경됨 */}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          저희 앱에 오신 것을 진심으로 환영합니다. {/* 변경됨 */}
        </p>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* 필요 없으면 이 부분도 제거하거나 회사 로고·저작권표시 등으로 교체하세요 */}
        <span className="text-sm text-gray-500">
          © {new Date().getFullYear()} Your Company
        </span>
      </footer>
    </div>
  );
}
