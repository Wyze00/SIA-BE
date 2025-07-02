import { Dosen, Matkul, MhsMengambilMatkul } from '@prisma/client';

export type MhsMengambilMatkulWithMatkulAndDosen = MhsMengambilMatkul & {
    matkul: Matkul & { dosen: Dosen };
};
