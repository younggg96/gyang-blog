/*
  Warnings:

  - You are about to drop the `articlecategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articlecategory` DROP FOREIGN KEY `articleCategory_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `articlecategory` DROP FOREIGN KEY `articleCategory_categoryId_fkey`;

-- DropTable
DROP TABLE `articlecategory`;

-- CreateTable
CREATE TABLE `article_category` (
    `categoryId` INTEGER UNSIGNED NOT NULL,
    `articleId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`categoryId`, `articleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_category` ADD CONSTRAINT `article_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_category` ADD CONSTRAINT `article_category_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
