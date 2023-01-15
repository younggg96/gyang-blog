/*
  Warnings:

  - You are about to drop the column `categoryId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_userId_fkey`;

-- AlterTable
ALTER TABLE `article` DROP COLUMN `categoryId`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_categoryTouser` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_categoryTouser_AB_unique`(`A`, `B`),
    INDEX `_categoryTouser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_articleTocategory` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_articleTocategory_AB_unique`(`A`, `B`),
    INDEX `_articleTocategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_categoryTouser` ADD CONSTRAINT `_categoryTouser_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoryTouser` ADD CONSTRAINT `_categoryTouser_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_articleTocategory` ADD CONSTRAINT `_articleTocategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_articleTocategory` ADD CONSTRAINT `_articleTocategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
