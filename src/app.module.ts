import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { MahasiswaModule } from './modules/mahasiswa/mahasiswa.module';
import { DosenModule } from './modules/dosen/dosen.module';
import { MatkulModule } from './modules/matkul/matkul.module';

@Module({
    imports: [
        CommonModule,
        AuthModule,
        MahasiswaModule,
        DosenModule,
        MatkulModule,
    ],
})
export class AppModule {}
