/*
  Warnings:

  - You are about to drop the column `momentCommentId` on the `reply` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `moment_like` DROP FOREIGN KEY `moment_like_momentId_fkey`;

-- DropForeignKey
ALTER TABLE `moment_like` DROP FOREIGN KEY `moment_like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reply` DROP FOREIGN KEY `reply_momentCommentId_fkey`;

-- AlterTable
ALTER TABLE `reply` DROP COLUMN `momentCommentId`;

-- CreateTable
CREATE TABLE `momentReply` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `replySelfId` INTEGER UNSIGNED NULL,
    `userId` INTEGER UNSIGNED NULL,
    `momentCommentId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `moment_like` ADD CONSTRAINT `moment_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_like` ADD CONSTRAINT `moment_like_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentReply` ADD CONSTRAINT `momentReply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentReply` ADD CONSTRAINT `momentReply_momentCommentId_fkey` FOREIGN KEY (`momentCommentId`) REFERENCES `momentComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
