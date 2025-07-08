export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col p-6 pt-8 w-full">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-sm text-[var(--primary-200)]">테스트 페이지</h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            커스텀 스타일 확인
          </h1>
          <p className="text-[var(--primary-200)] text-base leading-relaxed">
            이 페이지는 설정한 색상, 반경, 그림자, 폰트를 확인하기 위한
            샘플입니다.
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full px-6 py-3 bg-[var(--primary-500)] text-white rounded-[var(--radius-button)] shadow-[var(--shadow-md)] hover:bg-[var(--primary-600)] transition-colors">
            버튼 스타일
          </button>

          <div className="p-4 bg-[var(--primary-100)] bg-opacity-20 border border-[var(--primary-300)] border-opacity-30 rounded-[var(--radius-modal)] shadow-[var(--shadow-sm)]">
            <p className="text-[var(--primary-100)] text-sm leading-relaxed">
              이 박스를 통해 배경 색상, 테두리, 반경, 그림자가 적용되었는지
              확인하세요.
            </p>
          </div>

          <input
            className="w-full p-3 bg-[var(--input)] bg-opacity-10 border border-[var(--border)] border-opacity-30 rounded-[var(--radius-input)] text-white placeholder-[var(--primary-200)] focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            placeholder="입력 포커스 링 확인"
          />

          {/* 추가 컨텐츠로 스크롤 테스트 */}
          <div className="space-y-3 mt-8">
            <div className="h-20 bg-[var(--primary-200)] bg-opacity-20 rounded-[var(--radius-modal)] flex items-center justify-center">
              <span className="text-[var(--primary-100)]">컨텐츠 블록 1</span>
            </div>
            <div className="h-20 bg-[var(--primary-200)] bg-opacity-20 rounded-[var(--radius-modal)] flex items-center justify-center">
              <span className="text-[var(--primary-100)]">컨텐츠 블록 2</span>
            </div>
            <div className="h-20 bg-[var(--primary-200)] bg-opacity-20 rounded-[var(--radius-modal)] flex items-center justify-center">
              <span className="text-[var(--primary-100)]">컨텐츠 블록 3</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <span className="text-sm text-[var(--primary-200)]">
          © {new Date().getFullYear()} Your Company
        </span>
      </footer>
    </div>
  );
}
