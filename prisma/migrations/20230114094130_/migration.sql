/*
  Warnings:

  - You are about to drop the column `createdAt` on the `articlecategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `articlecategory` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `usercategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `usercategory` table. All the data in the column will be lost.
  - Added the required column `assignedBy` to the `articleCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `articlecategory` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `assignedBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usercategory` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
