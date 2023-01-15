/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `articlecategory` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `articlecategory` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `usercategory` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `usercategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articlecategory` DROP COLUMN `assignedAt`,
    DROP COLUMN `assignedBy`;

-- AlterTable
ALTER TABLE `usercategory` DROP COLUMN `assignedAt`,
    DROP COLUMN `assignedBy`;
