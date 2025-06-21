import { $Enums } from '@prisma/client';

export class UserResponse {
    id: string;
    role: $Enums.Role;
    name: string;
}
