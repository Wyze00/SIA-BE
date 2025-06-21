/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(0))`.
  - Added the required column `id_admin` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `admin_id_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_admin` VARCHAR(10) NOT NULL,
    ADD PRIMARY KEY (`id_admin`);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`,
    MODIFY `role` ENUM('mahasiswa', 'dosen', 'admin') NOT NULL DEFAULT 'mahasiswa';

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `admin_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
