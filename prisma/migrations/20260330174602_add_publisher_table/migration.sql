/*
  Warnings:

  - You are about to drop the column `author` on the `book` table. All the data in the column will be lost.
  - Added the required column `publisherId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `author`,
    ADD COLUMN `publisherId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Publisher` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Publisher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
