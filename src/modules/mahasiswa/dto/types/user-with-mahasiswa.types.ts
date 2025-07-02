import { Mahasiswa, User } from '@prisma/client';

export type UserWithMahasiswa = User & { mahasiswa: Mahasiswa | null };
