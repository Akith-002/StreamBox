import prisma from "../config/database";
import { FavoriteDto, AddFavoriteDto, MediaType } from "@streambox/shared";
import { AppError } from "../middleware/errorHandler";

export class FavoritesService {
  async getUserFavorites(userId: string): Promise<FavoriteDto[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((fav: any) => ({
      id: fav.id,
      tmdbId: fav.tmdbId,
      title: fav.title,
      posterPath: fav.posterPath,
      mediaType: (fav.mediaType || "movie") as MediaType,
      userId: fav.userId,
      createdAt: fav.createdAt.toISOString(),
      voteAverage: fav.voteAverage,
      releaseDate: fav.releaseDate,
    }));
  }

  async addFavorite(
    userId: string,
    data: AddFavoriteDto
  ): Promise<FavoriteDto> {
    // Validate required fields
    if (!data.tmdbId || !data.title || !data.posterPath) {
      throw new AppError(400, "tmdbId, title, and posterPath are required");
    }

    const mediaType = data.mediaType || "movie";

    // Check if already exists
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId: data.tmdbId,
          mediaType,
        },
      },
    });

    if (existing) {
      const itemType = mediaType === "tv" ? "TV show" : "Movie";
      throw new AppError(400, `${itemType} already in favorites`);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        tmdbId: data.tmdbId,
        title: data.title,
        posterPath: data.posterPath,
        mediaType,
        voteAverage: data.voteAverage,
        releaseDate: data.releaseDate,
      },
    });

    return {
      id: favorite.id,
      tmdbId: favorite.tmdbId,
      title: favorite.title,
      posterPath: favorite.posterPath,
      mediaType: favorite.mediaType as MediaType,
      userId: favorite.userId,
      createdAt: favorite.createdAt.toISOString(),
      voteAverage: favorite.voteAverage ?? undefined,
      releaseDate: favorite.releaseDate ?? undefined,
    };
  }

  async removeFavorite(
    userId: string,
    tmdbId: number,
    mediaType: MediaType = "movie"
  ): Promise<void> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType },
      },
    });

    if (!favorite) {
      throw new AppError(404, "Favorite not found");
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async isFavorite(
    userId: string,
    tmdbId: number,
    mediaType: MediaType = "movie"
  ): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType },
      },
    });

    return !!favorite;
  }
}
