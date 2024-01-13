-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_album" (
    "codalbum" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "access_token" TEXT NOT NULL DEFAULT 'none',
    "id_token" TEXT NOT NULL DEFAULT 'none'
);
INSERT INTO "new_album" ("codalbum", "nome") SELECT "codalbum", "nome" FROM "album";
DROP TABLE "album";
ALTER TABLE "new_album" RENAME TO "album";
CREATE UNIQUE INDEX "album_nome_key" ON "album"("nome");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
