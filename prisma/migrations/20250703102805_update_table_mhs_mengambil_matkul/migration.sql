/*
  Warnings:

  - Added the required column `nilai` to the `mahasiswa_ambil_matkul` table without a default value. This is not possible if the table is not empty.
  - Added the required column `persen_absensi` to the `mahasiswa_ambil_matkul` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mahasiswa_ambil_matkul` ADD COLUMN `nilai` TINYINT NOT NULL,
    ADD COLUMN `persen_absensi` FLOAT NOT NULL;
