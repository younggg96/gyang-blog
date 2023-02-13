/*
  Warnings:

  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `profile` table. All the data in the column will be lost.
  - Added the required column `bio` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` DROP PRIMARY KEY,
    DROP COLUMN `description`,
    DROP COLUMN `id`,
    ADD COLUMN `bio` TEXT NOT NULL,
    ADD COLUMN `profileId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`profileId`);
