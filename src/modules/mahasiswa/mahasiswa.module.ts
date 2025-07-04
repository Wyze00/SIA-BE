import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './controller/mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenMatkulService } from './services/mahasiswa-absen-matkul.service';
import { MahasiswaNilaiMatkulService } from './services/mahasiswa-nilai.service';
import { MahasiswaNilaiSemesterController } from './controller/mahasiswa-nilai-semester.controller';
import { MahasiswaNilaiSemesterService } from './services/mahasiswa-nilai-semester.service';
import { MahasiswaNilaiMatkulController } from './controller/mahasiswa-nilai-matkul.controller';
import { MahasiswaAbsenMatkulController } from './controller/mahasiswa-absen-matkul.controller';

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
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenMatkulService,
        MahasiswaNilaiMatkulService,
        MahasiswaNilaiSemesterService,
    ],
})
export class MahasiswaModule {}
