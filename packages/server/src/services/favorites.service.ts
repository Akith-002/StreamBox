import prisma from "../config/database";
import { FavoriteDto, AddFavoriteDto } from "@streambox/shared";
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
      userId: fav.userId,
      createdAt: fav.createdAt.toISOString(),
    }));
  }

  async addFavorite(
    userId: string,
    data: AddFavoriteDto
  ): Promise<FavoriteDto> {
    // Check if already exists
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId: data.tmdbId,
        },
      },
    });

    if (existing) {
      throw new AppError(400, "Movie already in favorites");
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        tmdbId: data.tmdbId,
        title: data.title,
        posterPath: data.posterPath,
      },
    });

    return {
      id: favorite.id,
      tmdbId: favorite.tmdbId,
      title: favorite.title,
      posterPath: favorite.posterPath,
      userId: favorite.userId,
      createdAt: favorite.createdAt.toISOString(),
    };
  }

  async removeFavorite(userId: string, tmdbId: number): Promise<void> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId: { userId, tmdbId },
      },
    });

    if (!favorite) {
      throw new AppError(404, "Favorite not found");
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async isFavorite(userId: string, tmdbId: number): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId: { userId, tmdbId },
      },
    });

    return !!favorite;
  }
}
