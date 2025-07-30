interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressDots = ({
  currentStep,
  totalSteps,
}: ProgressDotsProps) => {
  return (
    <div className="w-full flex gap-2 md:gap-4 items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1 rounded-full transition-all duration-300
            ${
              index <= currentStep
                ? 'bg-primary-300 w-6 md:w-10'
                : 'bg-blue-100 w-6 md:w-10 opacity-50'
            }
          `}
        />
      ))}
    </div>
  );
};
