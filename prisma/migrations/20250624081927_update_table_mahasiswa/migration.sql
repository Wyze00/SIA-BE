/*
  Warnings:

  - Added the required column `angkatan` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `angkatan` CHAR(4) NOT NULL;
