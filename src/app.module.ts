import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [CommonModule, AuthModule],
})
export class AppModule {}
