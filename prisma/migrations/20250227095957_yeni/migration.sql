/*
  Warnings:

  - Added the required column `regions_parent` to the `villas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `villas` ADD COLUMN `regions_parent` JSON NOT NULL;
