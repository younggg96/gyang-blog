-- AlterTable
ALTER TABLE `category` ADD COLUMN `userId` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
