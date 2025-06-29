-- CreateTable
CREATE TABLE `mahasiswa_total_nilai` (
    `nim` VARCHAR(10) NOT NULL,
    `semester` TINYINT NOT NULL,
    `total_sks` TINYINT NOT NULL,
    `ips` FLOAT NOT NULL,

    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa_total_nilai` ADD CONSTRAINT `mahasiswa_total_nilai_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;
