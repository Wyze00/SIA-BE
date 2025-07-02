import { Dosen, User } from '@prisma/client';

export type UserWithDosen = User & { dosen: Dosen | null };
