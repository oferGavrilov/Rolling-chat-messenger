import { IUser } from '@/models/user.model';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
            body: any;
            // {
            // username?: string;
            // email?: string;
            // password?: string;
            // profileImg?: string;
            // TN_profileImg?: string;
            // newName?: string;
            // image?: string;
            // chatId?: string;
            // userId?: string;
            // currentUserId?: string;
            // users?: IUser[];
            // usersId?: string[]
            // chatName?: string;
            // groupImage?: string;
            // kickedByUserId?: string;
            // groupName?: string;
            // senderId?: string;
            // deletionType?: 'forMe' | 'forEveryone';
            // messageIds?: string[];
            // content?: string;
            // messageType?: "text" | "image" | "audio" | "file";
            // replyMessage?: string;
            // messageSize?: string;
            // file?: File;
            // };
            params: any // {
            //     userId?: string;
            //     messageId?: string;
            //     chatId?: string;
            // }
            cookies: any //{
            //     accessToken?: string;
            //     refreshToken?: string;
            // }
            file?: Express.Multer.File;
        }
    }
}