import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { DosenResponse } from './dto/dosen-response.dto';
import { UpdateDosenRequest } from './dto/update-dosen-request.dto';
import { Dosen } from '@prisma/client';
import { UserWithDosen } from './dto/types/user-with-dosen.type';
import { DosenRepository } from './dosen.repository';

@Injectable()
export class DosenService {
    constructor(private readonly dosenRepository: DosenRepository) {}

    async create(request: CreateDosenRequest): Promise<DosenResponse> {
        await this.ensureDosenNotExistsOrThrow(request.id);

        const userWithDosen: UserWithDosen =
            await this.dosenRepository.insert(request);

        return this.toDosenResponse(userWithDosen.dosen!);
    }

    async update(
        nip: string,
        request: UpdateDosenRequest,
    ): Promise<DosenResponse> {
        await this.ensureDosenExistsOrThrow(nip);

        if (nip != request.nip) {
            await this.ensureDosenNotExistsOrThrow(nip);
        }

        const userWithDosen: UserWithDosen = await this.dosenRepository.update(
            nip,
            request,
        );

        return this.toDosenResponse(userWithDosen.dosen!);
    }

    async findOne(nip: string): Promise<DosenResponse> {
        const dosen: Dosen = await this.ensureDosenExistsOrThrow(nip);
        return this.toDosenResponse(dosen);
    }

    async findAll(): Promise<DosenResponse[]> {
        const dosen: Dosen[] = await this.dosenRepository.getAll();
        return dosen.map((d) => this.toDosenResponse(d));
    }

    async remove(nip: string): Promise<void> {
        await this.ensureDosenExistsOrThrow(nip);
        await this.dosenRepository.deleteByNIP(nip);
    }

    // Validaion

    async ensureDosenExistsOrThrow(nip: string): Promise<Dosen> {
        const dosen: Dosen | null = await this.dosenRepository.getByNIP(nip);

        if (dosen == null) {
            throw new NotFoundException('Dosen Tidak Ditemukan');
        }

        return dosen;
    }

    async ensureDosenNotExistsOrThrow(nip: string): Promise<void> {
        const dosen: Dosen | null = await this.dosenRepository.getByNIP(nip);

        if (dosen) {
            throw new ConflictException('Dosen Sudah Ada');
        }
    }

    // Mapper

    toDosenResponse(dosen: Dosen): DosenResponse {
        return {
            name: dosen.name,
            nip: dosen.nip,
        };
    }
}
