/*
  Warnings:

  - You are about to drop the column `file` on the `article` table. All the data in the column will be lost.
  - The primary key for the `article_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `article_category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `file`;

-- AlterTable
ALTER TABLE `article_category` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`articleId`, `categoryId`);
