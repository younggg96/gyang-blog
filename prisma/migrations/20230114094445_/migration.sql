/*
  Warnings:

  - Added the required column `assignedBy` to the `userCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `articlecategory` ADD COLUMN `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usercategory` ADD COLUMN `assignedBy` VARCHAR(191) NOT NULL;
