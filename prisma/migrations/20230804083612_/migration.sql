/*
  Warnings:

  - You are about to drop the column `createdAt` on the `conversation_user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `conversation_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `conversation_user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
