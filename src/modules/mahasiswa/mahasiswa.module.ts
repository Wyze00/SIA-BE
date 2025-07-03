import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './controller/mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenService } from './services/mahasiswa-absen.service';
import { MahasiswaNilaiMatkulService } from './services/mahasiswa-nilai.service';
import { MahasiswaSemesterController } from './controller/mahasiswa-semester.controller';
import { MahasiswaSemesterService } from './services/mahasiswa-semester.service';
import { MahasiswaNilaiMatkulController } from './controller/mahasiswa-nilai-matkul.controller';

@Module({
    imports: [forwardRef(() => MatkulModule)],
    controllers: [
        MahasiswaController,
        MahasiswaSemesterController,
        MahasiswaNilaiMatkulController,
    ],
    providers: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiMatkulService,
        MahasiswaSemesterService,
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiMatkulService,
    ],
})
export class MahasiswaModule {}
