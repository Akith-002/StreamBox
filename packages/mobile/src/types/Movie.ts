export type MediaType = "movie" | "tv" | "person";

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
  media_type?: MediaType;
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

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  origin_country?: string[];
  media_type?: MediaType;
  // Extended properties for detailed TV view
  genres?: Array<{ id: number; name: string }>;
  tagline?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    air_date: string;
    poster_path: string | null;
  }>;
  networks?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  status?: string;
  type?: string;
  last_air_date?: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity: number;
  known_for?: Array<Movie | TVShow>;
  media_type?: MediaType;
}

export type MediaItem = Movie | TVShow | Person;

// Type guards
export function isMovie(item: MediaItem): item is Movie {
  return "title" in item || item.media_type === "movie";
}

export function isTVShow(item: MediaItem): item is TVShow {
  return (
    ("name" in item && "first_air_date" in item) || item.media_type === "tv"
  );
}

export function isPerson(item: MediaItem): item is Person {
  return "known_for_department" in item || item.media_type === "person";
}
