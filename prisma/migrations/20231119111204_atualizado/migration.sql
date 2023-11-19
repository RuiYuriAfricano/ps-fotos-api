/*
  Warnings:

  - A unique constraint covering the columns `[coddrive]` on the table `catalogAlbum` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coddrivealbum]` on the table `catalogAlbum` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coddrive` to the `catalogAlbum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coddrivealbum` to the `catalogAlbum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `catalogalbum` ADD COLUMN `coddrive` VARCHAR(191) NOT NULL,
    ADD COLUMN `coddrivealbum` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `catalogAlbum_coddrive_key` ON `catalogAlbum`(`coddrive`);

-- CreateIndex
CREATE UNIQUE INDEX `catalogAlbum_coddrivealbum_key` ON `catalogAlbum`(`coddrivealbum`);
