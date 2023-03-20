/*
  Warnings:

  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_userId_fkey`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `replyTo` INTEGER NULL;

-- DropTable
DROP TABLE `like`;

-- CreateTable
CREATE TABLE `article_like` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER UNSIGNED NULL,
    `userId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_like` ADD CONSTRAINT `article_like_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_like` ADD CONSTRAINT `article_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
