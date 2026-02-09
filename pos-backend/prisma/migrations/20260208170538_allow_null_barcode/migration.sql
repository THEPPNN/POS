/*
  Warnings:

  - Made the column `method` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Sale` MODIFY `method` ENUM('CASH', 'CREDIT', 'TRANSFER', 'OTHER') NOT NULL;
