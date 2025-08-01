export interface MovieCardProps {
  contentId: number;
  title: string;
  runtime: string;
  releaseDate: string;
  rating: string;
  description: string;
  thumbnailUrl: string;
  genres: string[];
  platformList: {
    name: string;
    url: string;
  }[];
}

export interface PlatFormButtonProps {
  platformName: string;
  iconUrl: string;
  url: string | null;
}

export interface RecommendationCardProps {
  imageUrl: string;
  title: string;
  description: string;
  route: string;
  disabled?: boolean;
}

export interface SubscriptionBoxProps {
  title: string;
  items: string[];
}
