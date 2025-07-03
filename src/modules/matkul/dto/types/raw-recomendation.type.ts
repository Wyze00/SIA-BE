import { Dosen, Matkul, RekomendasiMatkul } from '@prisma/client';

export type MatkulRecomendationWithMatkulAndDosen = RekomendasiMatkul & {
    matkul: Matkul & { dosen: Dosen };
};
