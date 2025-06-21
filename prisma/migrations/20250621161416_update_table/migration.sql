/*
  Warnings:

  - You are about to drop the column `nama` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `dosen` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `mahasiswa` table. All the data in the column will be lost.
  - Added the required column `name` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `dosen` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `nama`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `name` VARCHAR(100) NOT NULL;
