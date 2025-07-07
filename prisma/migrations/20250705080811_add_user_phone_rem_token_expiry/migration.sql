/*
  Warnings:

  - You are about to drop the column `expiry` on the `token` table. All the data in the column will be lost.
  - The values [ACCESS,API] on the enum `Token_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `token` DROP COLUMN `expiry`,
    MODIFY `type` ENUM('VERIFY', 'REFRESH', 'RESET', 'MCU', 'CAMERA', 'GREENHOUSE') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(191) NULL;
