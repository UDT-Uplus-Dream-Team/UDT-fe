'use client';

import { SubscriptionBoxProps } from '@/types/mypage/Mypage.type';

const SubscriptionBox = ({ title, items }: SubscriptionBoxProps) => {
  return (
    <div className="w-[320px] h-full bg-white/40 rounded-[16px] p-4 flex flex-col justify-between">
      <h3 className="text-[20px] text-white font-bold mb-2">{title}</h3>
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1 bg-black/40 text-[12px] text-white rounded-full font-medium border border-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionBox;
