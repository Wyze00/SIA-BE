import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './controller/mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenMatkulService } from './services/mahasiswa-absen-matkul.service';
import { MahasiswaNilaiMatkulService } from './services/mahasiswa-nilai.service';
import { MahasiswaSemesterController } from './controller/mahasiswa-semester.controller';
import { MahasiswaSemesterService } from './services/mahasiswa-semester.service';
import { MahasiswaNilaiMatkulController } from './controller/mahasiswa-nilai-matkul.controller';
import { MahasiswaAbsenMatkulController } from './controller/mahasiswa-absen-matkul.controller';

@Module({
    imports: [forwardRef(() => MatkulModule)],
    controllers: [
        MahasiswaController,
        MahasiswaSemesterController,
        MahasiswaNilaiMatkulController,
        MahasiswaAbsenMatkulController,
    ],
    providers: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenMatkulService,
        MahasiswaNilaiMatkulService,
        MahasiswaSemesterService,
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenMatkulService,
        MahasiswaNilaiMatkulService,
        MahasiswaSemesterService,
    ],
})
export class MahasiswaModule {}
