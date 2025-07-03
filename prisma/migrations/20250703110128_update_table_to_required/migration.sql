/*
  Warnings:

  - Made the column `nilai_huruf` on table `mahasiswa_ambil_matkul` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bobot` on table `mahasiswa_nilai_matkul` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mahasiswa_ambil_matkul` MODIFY `nilai_huruf` CHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa_nilai_matkul` MODIFY `bobot` FLOAT NOT NULL;
