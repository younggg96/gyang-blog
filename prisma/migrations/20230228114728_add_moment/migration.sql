-- AlterTable
ALTER TABLE `comment` ADD COLUMN `momentId` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `like` ADD COLUMN `momentId` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `moment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imgs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `momentId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `moment` ADD CONSTRAINT `moment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imgs` ADD CONSTRAINT `imgs_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_momentId_fkey` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
