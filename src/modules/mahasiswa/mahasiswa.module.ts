import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './controller/mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenService } from './services/mahasiswa-absen.service';
import { MahasiswaNilaiService } from './services/mahasiswa-nilai.service';
import { MahasiswaSemesterController } from './controller/mahasiswa-semester.controller';
import { MahasiswaSemesterService } from './services/mahasiswa-semester.service';

@Module({
    imports: [forwardRef(() => MatkulModule)],
    controllers: [MahasiswaController, MahasiswaSemesterController],
    providers: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiService,
        MahasiswaSemesterService,
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiService,
    ],
})
export class MahasiswaModule {}
