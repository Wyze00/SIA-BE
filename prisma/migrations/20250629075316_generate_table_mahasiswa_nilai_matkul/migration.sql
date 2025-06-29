/*
  Warnings:

  - You are about to alter the column `pertemuan` on the `mahasiswa_absen_matkul` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `semester` on the `mahasiswa_ambil_matkul` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `total_pertemuan` on the `matkul` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `total_sks` on the `matkul` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `mahasiswa_absen_matkul` MODIFY `pertemuan` TINYINT NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa_ambil_matkul` MODIFY `semester` TINYINT NOT NULL;

-- AlterTable
ALTER TABLE `matkul` MODIFY `total_pertemuan` TINYINT NOT NULL,
    MODIFY `total_sks` TINYINT NOT NULL;

-- CreateTable
CREATE TABLE `mahasiswa_nilai_matkul` (
    `kode_matkul` VARCHAR(10) NOT NULL,
    `nim` VARCHAR(10) NOT NULL,
    `semester` TINYINT NOT NULL,
    `nilai` FLOAT NOT NULL,
    `bobot` FLOAT NULL,
    `tipe` ENUM('uts', 'uas', 'quiz') NOT NULL,

    PRIMARY KEY (`kode_matkul`, `nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa_nilai_matkul` ADD CONSTRAINT `mahasiswa_nilai_matkul_kode_matkul_fkey` FOREIGN KEY (`kode_matkul`) REFERENCES `matkul`(`kode_matkul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa_nilai_matkul` ADD CONSTRAINT `mahasiswa_nilai_matkul_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;
