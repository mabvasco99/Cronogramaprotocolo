interface Props {
  current: number;
  total: number;
  labels: string[];
}

export default function StepIndicator({ current, total, labels }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: compact pill */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">
          Etapa {current} de {total}
        </span>
        <span className="text-sm font-semibold text-brand-700">{labels[current - 1]}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-brand-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>

      {/* Desktop: step circles */}
      <div className="hidden sm:flex items-center justify-between mt-4">
        {labels.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${done ? 'bg-brand-600 border-brand-600 text-white' : ''}
                  ${active ? 'bg-white border-brand-600 text-brand-600 ring-4 ring-brand-100' : ''}
                  ${!done && !active ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`mt-1 text-xs text-center leading-tight max-w-[80px]
                  ${active ? 'text-brand-700 font-semibold' : 'text-gray-400'}
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
