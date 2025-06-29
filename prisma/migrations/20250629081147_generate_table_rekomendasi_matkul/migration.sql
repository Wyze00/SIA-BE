-- CreateTable
CREATE TABLE `rekomendasi_matkul` (
    `kode_matkul` VARCHAR(10) NOT NULL,
    `semester` TINYINT NOT NULL,
    `jurusan` ENUM('informatika', 'dkv', 'industri', 'akuntansi', 'olb', 'management', 'si') NOT NULL,

    PRIMARY KEY (`kode_matkul`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rekomendasi_matkul` ADD CONSTRAINT `rekomendasi_matkul_kode_matkul_fkey` FOREIGN KEY (`kode_matkul`) REFERENCES `matkul`(`kode_matkul`) ON DELETE RESTRICT ON UPDATE CASCADE;
