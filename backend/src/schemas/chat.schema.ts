import { TypeOf, z } from "zod";

export const getChatByIdSchema = z.object({
    params: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
    }),
});

export const createChatSchema = z.object({
    body: z.object({
        userId: z.string({ required_error: "User ID is required" }),
    }),
});

export const createGroupChatSchema = z.object({
    body: z.object({
        chatName: z.string({ required_error: "Chat name is required" }),
        userIds: z.string({ required_error: "User IDs are required" }).transform((data) => JSON.parse(data)),
    }),
    file: z.object({
        originalname: z.string(),
        mimetype: z.enum(["image/jpeg", "image/png"], { required_error: "Invalid file type" }),
        size: z.number(),
        buffer: z.instanceof(Buffer),
    }).optional().nullable(),
});

export const leaveGroupChatSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
    }),
})

export const removeChatSchema = z.object({
    params: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
    }),
});

export const renameGroupChatSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
        groupName: z.string({ required_error: "Group name is required" }),
    }),
});

export const updateGroupImageSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
    }),
    file: z.object({
        originalname: z.string(),
        mimetype: z.enum(["image/jpeg", "image/png"], { required_error: "Invalid file type" }),
        size: z.number(),
        buffer: z.instanceof(Buffer),
    }),
})

export const updateUsersInGroupChatSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
        userIds: z.string({ required_error: "User IDs are required" }).transform((data) => JSON.parse(data)),
    }),
}); 

export const kickFromGroupChatSchema = z.object({
    body: z.object({
        chatId: z.string({ required_error: "Chat ID is required" }),
        kickedByUserId: z.string({ required_error: "Kicked by user ID is required" }),
    }),
});


export type GetChatByIdInput = TypeOf<typeof getChatByIdSchema>['params'];
export type CreateChatInput = TypeOf<typeof createChatSchema>['body'];
export type CreateGroupChatInput = TypeOf<typeof createGroupChatSchema>['body'] & { file: Express.Multer.File | null };
export type LeaveGroupChatInput = TypeOf<typeof leaveGroupChatSchema>['body'];
export type RemoveChatInput = TypeOf<typeof removeChatSchema>['params'];
export type RenameGroupChatInput = TypeOf<typeof renameGroupChatSchema>['body'];
export type UpdateGroupImageInput = TypeOf<typeof updateGroupImageSchema>['body'] & { file: Express.Multer.File };
export type UpdateUsersInGroupChatInput = TypeOf<typeof updateUsersInGroupChatSchema>['body'];
export type KickFromGroupChatInput = TypeOf<typeof kickFromGroupChatSchema>['body'];