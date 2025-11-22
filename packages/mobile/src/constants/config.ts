// Backend API Configuration
// Use your computer's IP address for mobile testing (not localhost!)
// Find your IP: Run 'ipconfig' in terminal and look for IPv4 Address
export const API_BASE_URL = __DEV__
  ? "http://192.168.1.138:3000/api"
  : "https://your-production-api.com/api";

// TMDB Image URLs (still needed for displaying images)
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const TMDB_IMAGE_BASE_URL_ORIGINAL =
  "https://image.tmdb.org/t/p/original";
