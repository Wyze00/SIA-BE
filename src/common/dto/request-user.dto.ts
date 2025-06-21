import { Request } from 'express';
import { UserRole } from './user-role.dto';

export interface RequestUser extends Request {
    user: UserRole;
}
