import { forwardRef, Module } from '@nestjs/common';
import { MahasiswaController } from './mahasiswa.controller';
import { MahasiswaService } from './services/mahasiswa.service';
import { MatkulModule } from '../matkul/matkul.module';
import { MahasiswaTotalNilaiService } from './services/mahasiswa-total-nilai.service';
import { MahasiswaAbsenService } from './services/mahasiswa.-absenservice';
import { MahasiswaNilaiService } from './services/mahasiswa-nilai.service';

@Module({
    imports: [forwardRef(() => MatkulModule)],
    controllers: [MahasiswaController],
    providers: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiService,
    ],
    exports: [
        MahasiswaService,
        MahasiswaTotalNilaiService,
        MahasiswaAbsenService,
        MahasiswaNilaiService,
    ],
})
export class MahasiswaModule {}
