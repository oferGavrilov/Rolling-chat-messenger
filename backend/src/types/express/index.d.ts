import { IUser } from '@/models/user.model';
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
            cookies: {
                accessToken?: string;
                refreshToken?: string;
            }
            file?: Multer.File;
        }
    }
}