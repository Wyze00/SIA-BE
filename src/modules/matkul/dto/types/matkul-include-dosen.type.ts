import { Dosen, Matkul } from '@prisma/client';

export type MatkulWithDosen = Matkul & { dosen: Dosen };
