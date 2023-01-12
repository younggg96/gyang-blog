-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_email_key` TO `User_email_key`;
