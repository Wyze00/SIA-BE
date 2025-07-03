import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { MatkulRecomendationMahasiswaService } from 'src/modules/matkul/services/matkul-recomendation-mahasiswa.service';
import { MhsMengambilMatkulWithMatkulAndDosen } from 'src/modules/matkul/dto/types/mhsMengambilMatkul-with-matkul-and-dosen.type';
import { MahasiswaSemester } from '../dto/types/mahasiswa-semester.type';
import { MahasiswaTotalNilaiService } from './mahasiswa-total-nilai.service';
import { FindAllMahaiswaSemesterResponse } from '../dto/response/find-all-mahasiswa-semester-response.dto';

@Injectable()
export class MahasiswaSemesterService {
    constructor(
        private readonly mahasiswaService: MahasiswaService,
        @Inject(forwardRef(() => MatkulRecomendationMahasiswaService))
        private readonly matkulRecomendationMahasiswaService: MatkulRecomendationMahasiswaService,
        private readonly mahasiswaTotalNilai: MahasiswaTotalNilaiService,
    ) {}

    async findOne(
        nim: string,
        semester: number,
    ): Promise<FindAllMahaiswaSemesterResponse> {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);

        const matkul: MhsMengambilMatkulWithMatkulAndDosen[] =
            await this.matkulRecomendationMahasiswaService.getMhsMengambilMaktulWithMatkulAndDosen(
                nim,
                semester,
            );

        const formated =
            this.formatMhsMengambilMatkulWithMakulAndDosenToMahasiswaSemester(
                matkul,
            );

        const totalNilai = await this.mahasiswaTotalNilai.findOne(
            nim,
            semester,
        );

        return {
            all: formated,
            nilai: {
                ips: totalNilai.ips,
                total_sks: totalNilai.total_sks,
            },
        };
    }
    formatMhsMengambilMatkulWithMakulAndDosenToMahasiswaSemester(
        raw: MhsMengambilMatkulWithMatkulAndDosen[],
    ): MahasiswaSemester[] {
        return raw.map((r) => {
            return {
                kode_matkul: r.kode_matkul,
                name: r.matkul.name,
                dosen_name: r.matkul.dosen.name,
                absen_percent: r.persen_absensi,
                nilai: r.nilai,
                nilai_huruf: r.nilai_huruf,
                total_sks: r.matkul.total_sks,
            };
        });
    }
}
