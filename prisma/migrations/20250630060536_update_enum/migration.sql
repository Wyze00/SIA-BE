/*
  Warnings:

  - The values [uts,uas,quiz] on the enum `mahasiswa_nilai_matkul_tipe` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `mahasiswa_absen_matkul` MODIFY `status` ENUM('none', 'izin', 'alpha', 'hadir') NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa_nilai_matkul` MODIFY `tipe` ENUM('UTS', 'UAS', 'QUIZ1', 'QUIZ2', 'QUIZ3', 'QUIZ4', 'QUIZ5') NOT NULL;
