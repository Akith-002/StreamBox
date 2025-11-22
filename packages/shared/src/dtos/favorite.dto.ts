export interface FavoriteDto {
  id: string;
  userId: string;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  createdAt: string;
}

export interface AddFavoriteDto {
  tmdbId: number;
  title: string;
  posterPath: string | null;
}
