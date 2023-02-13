-- AlterTable
ALTER TABLE `article` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `file` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `backgroundImg` VARCHAR(191) NULL,
    ADD COLUMN `facebook` VARCHAR(191) NULL,
    ADD COLUMN `github` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `articleId` INTEGER UNSIGNED NULL,
    `userId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reply` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `commentId` INTEGER UNSIGNED NULL,
    `userId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reply` ADD CONSTRAINT `reply_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reply` ADD CONSTRAINT `reply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
