export type MediaType = "movie" | "tv";

export interface FavoriteDto {
  id: string;
  userId: string;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  mediaType: MediaType;
  createdAt: string;
  voteAverage?: number;
  releaseDate?: string;
}

export interface AddFavoriteDto {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  mediaType: MediaType;
  voteAverage?: number;
  releaseDate?: string;
}
