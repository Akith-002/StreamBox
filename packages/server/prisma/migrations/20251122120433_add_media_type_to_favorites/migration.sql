-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'movie',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Favorite" ("createdAt", "id", "posterPath", "title", "tmdbId", "userId") SELECT "createdAt", "id", "posterPath", "title", "tmdbId", "userId" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
CREATE UNIQUE INDEX "Favorite_userId_tmdbId_mediaType_key" ON "Favorite"("userId", "tmdbId", "mediaType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
