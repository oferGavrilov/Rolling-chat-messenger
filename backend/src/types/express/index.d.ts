import { User } from '@/models/user.model';

declare global {
    namespace Express {
        interface Request {
            user: User;
            body: {
                username?: string;
                email?: string;
                password?: string;
                profileImg?: string;
                TN_profileImg?: string;
                newName?: string;
                image?: string;
                chatId?: string;
                userId?: string;
                currentUserId?: string;
                users?: User[];
                usersId?: string[]
                chatName?: string;
                groupImage?: string;
                kickedByUserId?: string;
                groupName?: string;
                senderId?: string;
                deletionType?: 'forMe' | 'forEveryone';
                messageIds?: string[];
                content?: string;
                messageType?: "text" | "image" | "audio" | "file";
                replyMessage?: string;
                messageSize?: string;
                file?: File;
            };
            params: {
                userId?: string;
                messageId?: string;
                chatId?: string;
            }
            cookies: {
                accessToken?: string;
                refreshToken?: string;
            }
            file?: Express.Multer.File;
        }
    }
}