/*
  Warnings:

  - You are about to drop the column `momentId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `momentId` on the `like` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_momentId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_momentId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `momentId`;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `momentId`;

-- AlterTable
ALTER TABLE `reply` ADD COLUMN `momentCommentId` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `momentLike` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NULL,
    `momentId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `momentComment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER UNSIGNED NULL,
    `momentId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `momentLike` ADD CONSTRAINT `momentLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentLike` ADD CONSTRAINT `momentLike_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentComment` ADD CONSTRAINT `momentComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentComment` ADD CONSTRAINT `momentComment_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reply` ADD CONSTRAINT `reply_momentCommentId_fkey` FOREIGN KEY (`momentCommentId`) REFERENCES `momentComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
