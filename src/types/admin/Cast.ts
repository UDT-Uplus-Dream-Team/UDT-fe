import { Cast } from '@type/admin/Content';

export type AdminCastsGetRequest = {
  name: string;
  cursor?: string;
  size?: number;
};

export type AdminCastsGetResponse = {
  item: Cast[];
  nextCursor: string;
  hasNext: boolean;
};

export type AdminCastCreateRequest = {
  casts: {
    castName: string;
    castImageUrl: string;
  }[];
};

export type AdminCastCreateResponse = {
  castIds: number[];
};
