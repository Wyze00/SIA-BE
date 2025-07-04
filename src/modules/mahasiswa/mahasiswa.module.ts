import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './controller/mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenMatkulService } from './services/mahasiswa-absen-matkul.service';
import { MahasiswaNilaiMatkulService } from './services/mahasiswa-nilai-matkul.service';
import { MahasiswaNilaiSemesterController } from './controller/mahasiswa-nilai-semester.controller';
import { MahasiswaNilaiSemesterService } from './services/mahasiswa-nilai-semester.service';
import { MahasiswaNilaiMatkulController } from './controller/mahasiswa-nilai-matkul.controller';
import { MahasiswaAbsenMatkulController } from './controller/mahasiswa-absen-matkul.controller';
import { MahasiswaAmbilMatkulService } from './services/mahasiswa-ambil-matkul.sevice';

@Module({
    imports: [forwardRef(() => MatkulModule)],
    controllers: [
        MahasiswaNilaiSemesterController,
        MahasiswaNilaiMatkulController,
        MahasiswaAbsenMatkulController,
        MahasiswaController,
    ],
    providers: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenMatkulService,
        MahasiswaNilaiMatkulService,
        MahasiswaNilaiSemesterService,
        MahasiswaAmbilMatkulService,
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenMatkulService,
        MahasiswaNilaiMatkulService,
        MahasiswaNilaiSemesterService,
        MahasiswaAmbilMatkulService,
    ],
})
export class MahasiswaModule {}
