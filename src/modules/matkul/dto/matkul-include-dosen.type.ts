import { Dosen, Matkul } from '@prisma/client';

export type MatkulIncludeDosen = Matkul & { dosen: Dosen };
