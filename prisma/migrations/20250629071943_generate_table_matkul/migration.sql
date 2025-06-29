-- AlterTable
ALTER TABLE `mahasiswa` MODIFY `jurusan` ENUM('informatika', 'dkv', 'industri', 'akuntansi', 'olb', 'management', 'si') NOT NULL;

-- CreateTable
CREATE TABLE `matkul` (
    `kode_matkul` VARCHAR(10) NOT NULL,
    `dosen_nip` VARCHAR(10) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `total_pertemuan` INTEGER NOT NULL,
    `total_sks` INTEGER NOT NULL,

    PRIMARY KEY (`kode_matkul`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `matkul` ADD CONSTRAINT `matkul_dosen_nip_fkey` FOREIGN KEY (`dosen_nip`) REFERENCES `dosen`(`nip`) ON DELETE RESTRICT ON UPDATE CASCADE;
