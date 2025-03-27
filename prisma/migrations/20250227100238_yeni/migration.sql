/*
  Warnings:

  - You are about to drop the column `regions_parent` on the `villas` table. All the data in the column will be lost.
  - Added the required column `regions_up` to the `villas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `villas` DROP COLUMN `regions_parent`,
    ADD COLUMN `regions_up` JSON NOT NULL;
