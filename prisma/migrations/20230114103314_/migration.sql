/*
  Warnings:

  - You are about to drop the `usercategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `usercategory` DROP FOREIGN KEY `userCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `usercategory` DROP FOREIGN KEY `userCategory_userId_fkey`;

-- DropTable
DROP TABLE `usercategory`;
