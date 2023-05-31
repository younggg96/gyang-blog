/*
  Warnings:

  - You are about to drop the `momentcomment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `moment_comment_like` DROP FOREIGN KEY `moment_comment_like_momentCommentId_fkey`;

-- DropForeignKey
ALTER TABLE `momentcomment` DROP FOREIGN KEY `momentComment_momentId_fkey`;

-- DropForeignKey
ALTER TABLE `momentcomment` DROP FOREIGN KEY `momentComment_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `momentcomment` DROP FOREIGN KEY `momentComment_userId_fkey`;

-- DropTable
DROP TABLE `momentcomment`;

-- CreateTable
CREATE TABLE `moment_comment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `momentId` INTEGER UNSIGNED NULL,
    `userId` INTEGER UNSIGNED NULL,
    `parentId` INTEGER UNSIGNED NULL,
    `replyTo` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `moment_comment` ADD CONSTRAINT `moment_comment_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_comment` ADD CONSTRAINT `moment_comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_comment` ADD CONSTRAINT `moment_comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `moment_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_comment_like` ADD CONSTRAINT `moment_comment_like_momentCommentId_fkey` FOREIGN KEY (`momentCommentId`) REFERENCES `moment_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
