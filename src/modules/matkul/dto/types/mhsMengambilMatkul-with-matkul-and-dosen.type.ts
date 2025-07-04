import { MhsMengambilMatkul } from '@prisma/client';
import { MatkulWithDosen } from './matkul-include-dosen.type';

export type MhsMengambilMatkulWithMatkulAndDosen = MhsMengambilMatkul & {
    matkul: MatkulWithDosen;
};
