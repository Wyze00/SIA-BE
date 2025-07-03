/*
  Warnings:

  - The primary key for the `mahasiswa_absen_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa_nilai_matkul` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `mahasiswa_absen_matkul` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`kode_matkul`, `nim`, `semester`, `pertemuan`);

-- AlterTable
ALTER TABLE `mahasiswa_nilai_matkul` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`kode_matkul`, `nim`, `semester`, `tipe`);
