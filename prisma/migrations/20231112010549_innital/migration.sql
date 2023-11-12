-- CreateTable
CREATE TABLE `utilizador` (
    `codutilizador` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `utilizador_nome_key`(`nome`),
    PRIMARY KEY (`codutilizador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `album` (
    `codalbum` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `album_nome_key`(`nome`),
    PRIMARY KEY (`codalbum`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalogAlbum` (
    `codcatalogo` INTEGER NOT NULL AUTO_INCREMENT,
    `fkutilizador` INTEGER NULL,
    `fkalbum` INTEGER NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codcatalogo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `catalogAlbum` ADD CONSTRAINT `catalogAlbum_fkutilizador_fkey` FOREIGN KEY (`fkutilizador`) REFERENCES `utilizador`(`codutilizador`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalogAlbum` ADD CONSTRAINT `catalogAlbum_fkalbum_fkey` FOREIGN KEY (`fkalbum`) REFERENCES `album`(`codalbum`) ON DELETE SET NULL ON UPDATE CASCADE;
