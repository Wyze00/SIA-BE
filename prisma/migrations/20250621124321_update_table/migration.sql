/*
  Warnings:

  - Added the required column `departemen` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `departemen` VARCHAR(100) NOT NULL,
    ADD COLUMN `nama` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `dosen` ADD COLUMN `nama` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `jurusan` ENUM('informatika', 'dkv', 'industri', 'akuntansi', 'olb', 'management') NOT NULL,
    ADD COLUMN `nama` VARCHAR(100) NOT NULL,
    ADD COLUMN `semester` TINYINT NOT NULL DEFAULT 1;
