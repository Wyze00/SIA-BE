-- CreateTable
CREATE TABLE `mahasiswa_ambil_matkul` (
    `kode_matkul` VARCHAR(10) NOT NULL,
    `nim` VARCHAR(10) NOT NULL,
    `semester` INTEGER NOT NULL,
    `nilai_huruf` CHAR(2) NULL,
    `status` ENUM('diambil', 'dibatalkan', 'lulus', 'gagal') NOT NULL,

    PRIMARY KEY (`kode_matkul`, `nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa_ambil_matkul` ADD CONSTRAINT `mahasiswa_ambil_matkul_kode_matkul_fkey` FOREIGN KEY (`kode_matkul`) REFERENCES `matkul`(`kode_matkul`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa_ambil_matkul` ADD CONSTRAINT `mahasiswa_ambil_matkul_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;
