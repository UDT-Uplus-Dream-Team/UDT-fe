'use client';

interface SubscriptionBoxProps {
  title: string;
  items: string[];
}

const SubscriptionBox = ({ title, items }: SubscriptionBoxProps) => {
  return (
    <div className="w-[320px] h-[115px] bg-white/40 rounded-[16px] p-4 flex flex-col justify-between">
      <h3 className="text-[20px] text-white font-bold">{title}</h3>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-[4px] bg-black/40 text-[13px] text-white rounded-full font-medium border border-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionBox;
