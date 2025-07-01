/*
  Warnings:

  - The primary key for the `mahasiswa_absen_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa_ambil_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa_nilai_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa_total_nilai` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rekomendasi_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `semester` to the `mahasiswa_absen_matkul` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mahasiswa_absen_matkul` DROP PRIMARY KEY,
    ADD COLUMN `semester` TINYINT NOT NULL,
    ADD PRIMARY KEY (`kode_matkul`, `nim`, `semester`);

-- AlterTable
ALTER TABLE `mahasiswa_ambil_matkul` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`kode_matkul`, `nim`, `semester`);

-- AlterTable
ALTER TABLE `mahasiswa_nilai_matkul` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`kode_matkul`, `nim`, `semester`);

-- AlterTable
ALTER TABLE `mahasiswa_total_nilai` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`nim`, `semester`);

-- AlterTable
ALTER TABLE `rekomendasi_matkul` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`kode_matkul`, `semester`, `jurusan`);
