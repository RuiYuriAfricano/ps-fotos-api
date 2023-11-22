-- CreateTable
CREATE TABLE "utilizador" (
    "codutilizador" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "album" (
    "codalbum" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "catalogAlbum" (
    "codcatalogo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coddrive" TEXT NOT NULL,
    "fkutilizador" INTEGER,
    "fkalbum" INTEGER,
    "url" TEXT NOT NULL,
    "coddrivealbum" TEXT NOT NULL,
    CONSTRAINT "catalogAlbum_fkutilizador_fkey" FOREIGN KEY ("fkutilizador") REFERENCES "utilizador" ("codutilizador") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "catalogAlbum_fkalbum_fkey" FOREIGN KEY ("fkalbum") REFERENCES "album" ("codalbum") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizador_nome_key" ON "utilizador"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "album_nome_key" ON "album"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "catalogAlbum_coddrive_key" ON "catalogAlbum"("coddrive");

-- CreateIndex
CREATE UNIQUE INDEX "catalogAlbum_coddrivealbum_key" ON "catalogAlbum"("coddrivealbum");
