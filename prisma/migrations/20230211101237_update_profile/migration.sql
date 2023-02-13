/*
  Warnings:

  - You are about to drop the column `backgroundImg` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `backgroundImg`,
    DROP COLUMN `facebook`,
    DROP COLUMN `github`,
    DROP COLUMN `linkedin`;

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backgroundImg` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `github` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `profile_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
