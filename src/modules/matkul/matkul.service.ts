import { Injectable } from '@nestjs/common';
import { CreateMatkulRequest } from './dto/create-matkul-request.dto';
import { UpdateMatkulRequest } from './dto/update-matkul.dto-request';

@Injectable()
export class MatkulService {
    create(request: CreateMatkulRequest) {
        return 'This action adds a new matkul';
    }

    findAll() {
        return `This action returns all matkul`;
    }

    findOne(id: number) {
        return `This action returns a #${id} matkul`;
    }

    update(id: number, request: UpdateMatkulRequest) {
        return `This action updates a #${id} matkul`;
    }

    remove(id: number) {
        return `This action removes a #${id} matkul`;
    }
}
