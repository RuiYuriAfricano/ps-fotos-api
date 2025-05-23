-- CreateTable
CREATE TABLE "utilizador" (
    "codutilizador" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "utilizador_pkey" PRIMARY KEY ("codutilizador")
);

-- CreateTable
CREATE TABLE "album" (
    "codalbum" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "access_token" TEXT NOT NULL DEFAULT 'none',
    "id_token" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "album_pkey" PRIMARY KEY ("codalbum")
);

-- CreateTable
CREATE TABLE "catalogAlbum" (
    "codcatalogo" SERIAL NOT NULL,
    "coddrive" TEXT NOT NULL,
    "fkutilizador" INTEGER,
    "fkalbum" INTEGER,
    "url" TEXT NOT NULL,
    "coddrivealbum" TEXT NOT NULL,

    CONSTRAINT "catalogAlbum_pkey" PRIMARY KEY ("codcatalogo")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizador_nome_key" ON "utilizador"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "album_nome_key" ON "album"("nome");

-- AddForeignKey
ALTER TABLE "catalogAlbum" ADD CONSTRAINT "catalogAlbum_fkutilizador_fkey" FOREIGN KEY ("fkutilizador") REFERENCES "utilizador"("codutilizador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogAlbum" ADD CONSTRAINT "catalogAlbum_fkalbum_fkey" FOREIGN KEY ("fkalbum") REFERENCES "album"("codalbum") ON DELETE SET NULL ON UPDATE CASCADE;
