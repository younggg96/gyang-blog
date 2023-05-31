/*
  Warnings:

  - You are about to drop the `momentreply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `momentreply` DROP FOREIGN KEY `momentReply_momentCommentId_fkey`;

-- DropForeignKey
ALTER TABLE `momentreply` DROP FOREIGN KEY `momentReply_userId_fkey`;

-- AlterTable
ALTER TABLE `momentcomment` ADD COLUMN `parentId` INTEGER UNSIGNED NULL,
    ADD COLUMN `replyTo` INTEGER NULL;

-- DropTable
DROP TABLE `momentreply`;

-- CreateTable
CREATE TABLE `moment_comment_like` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `momentCommentId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `momentComment` ADD CONSTRAINT `momentComment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `momentComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_comment_like` ADD CONSTRAINT `moment_comment_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_comment_like` ADD CONSTRAINT `moment_comment_like_momentCommentId_fkey` FOREIGN KEY (`momentCommentId`) REFERENCES `momentComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
