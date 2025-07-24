import { Film, Tv, Gamepad2, Drama } from 'lucide-react';
import type { ContentSummary } from '@type/admin/Content';

export const getTypeIcon = (type: string) => {
  switch (type) {
    case '영화':
      return Film;
    case '애니메이션':
      return Gamepad2;
    case '예능':
      return Tv;
    case '드라마':
      return Drama;
    default:
      return Film;
  }
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case '영화':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case '애니메이션':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case '예능':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case '드라마':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const generateChartData = (contents: ContentSummary[]) => {
  const chartData = contents.reduce(
    (acc, content) => {
      const category = content.categories?.[0] || '기타';
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: category, count: 1 });
      }
      return acc;
    },
    [] as { name: string; count: number }[],
  );

  return chartData;
};

export const generatePieChartData = (
  chartData: { name: string; count: number }[],
  colors: string[],
) => {
  return chartData.map((item, index) => ({
    name: item.name,
    value: item.count,
    color: colors[index % colors.length],
  }));
};

export const filterContents = (
  contents: ContentSummary[],
  searchTerm: string,
  filterType: string,
) => {
  return contents.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'all' || content.categories[0] === filterType;
    return matchesSearch && matchesType;
  });
};
