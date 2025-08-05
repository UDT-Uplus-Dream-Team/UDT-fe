import { Director } from '@type/admin/Content';

export type AdminDirectorsGetRequest = {
  name: string;
  cursor?: string;
  size?: number;
};

export type AdminDirectorsGetResponse = {
  item: Director[];
  nextCursor: string;
  hasNext: boolean;
};

export type AdminDirectorCreateRequest = {
  directors: {
    directorName: string;
    directorImageUrl: string;
  }[];
};

export type AdminDirectorCreateResponse = {
  directorIds: number[];
};
