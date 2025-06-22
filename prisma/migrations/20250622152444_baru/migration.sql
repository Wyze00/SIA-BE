-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(10) NOT NULL,
    `role` ENUM('mahasiswa', 'dosen', 'admin') NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `nim` VARCHAR(10) NOT NULL,
    `jurusan` ENUM('informatika', 'dkv', 'industri', 'akuntansi', 'olb', 'management') NOT NULL,
    `semester` TINYINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `nip` VARCHAR(10) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id_admin` VARCHAR(10) NOT NULL,
    `departemen` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_nip_fkey` FOREIGN KEY (`nip`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `admin_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
