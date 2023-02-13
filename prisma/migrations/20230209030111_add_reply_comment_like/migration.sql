/*
  Warnings:

  - You are about to drop the column `commentId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `replyId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `like` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_replyId_fkey`;

-- DropForeignKey
ALTER TABLE `reply` DROP FOREIGN KEY `reply_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `reply` DROP FOREIGN KEY `reply_userId_fkey`;

-- AlterTable
ALTER TABLE `article` ADD COLUMN `collectionId` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `commentId`,
    DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `replyId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `articleId` INTEGER UNSIGNED NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reply` ADD COLUMN `replySelfId` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `collection` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collection` ADD CONSTRAINT `collection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reply` ADD CONSTRAINT `reply_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reply` ADD CONSTRAINT `reply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
