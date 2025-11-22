export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  // Extended properties for detailed movie view
  genres?: Array<{ id: number; name: string }>;
  tagline?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  status?: string;
  imdb_id?: string | null;
}
