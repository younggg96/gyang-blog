/*
  Warnings:

  - You are about to drop the `_articletocategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_articletocategory` DROP FOREIGN KEY `_articleTocategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_articletocategory` DROP FOREIGN KEY `_articleTocategory_B_fkey`;

-- DropTable
DROP TABLE `_articletocategory`;
