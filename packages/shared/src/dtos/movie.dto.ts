export interface MovieDto {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
}

export interface MovieDetailsDto extends MovieDto {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  popularity: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface PaginatedMoviesResponse {
  results: MovieDto[];
  page: number;
  total_pages: number;
  total_results: number;
}
