'use client';

import { SubscriptionBoxProps } from '@/types/mypage/Mypage';

const SubscriptionBox = ({ title, items }: SubscriptionBoxProps) => {
  return (
    <div className="w-full max-w-[500px] bg-white/40 rounded-[16px] p-4 flex flex-col justify-between">
      <h3 className="text-[20px] text-white font-bold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1 bg-black/40 text-[12px] text-white rounded-full font-medium border border-white whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionBox;
