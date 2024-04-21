import express from 'express'
import { authMiddleware, groupAdminMiddleware } from '@/middleware/authMiddleware'
import { UpdateUsersInGroupChatHandler, createChatHandler, createGroupChatHandler, getChatByIdHandler, getUserChatsHandler, kickFromGroupChatHandler, leaveGroupChatHandler, removeChatHandler, renameGroupChatHandler, updateGroupImageHandler } from '../controllers/chat.controller'
import { validate } from '@/middleware/validate'
import { createChatSchema, createGroupChatSchema, getChatByIdSchema, kickFromGroupChatSchema, leaveGroupChatSchema, removeChatSchema, renameGroupChatSchema, updateGroupImageSchema, updateUsersInGroupChatSchema } from '@/schemas/chat.schema'
import upload from '@/middleware/multerMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getUserChatsHandler)

router.get(
    '/:chatId',
    validate(getChatByIdSchema),
    getChatByIdHandler
)

router.post(
    '/createchat',
    validate(createChatSchema),
    createChatHandler
)

router.post(
    '/creategroup',
    upload.single('groupImage'),
    validate(createGroupChatSchema),
    createGroupChatHandler
)

router.put(
    '/leave',
    validate(leaveGroupChatSchema),
    leaveGroupChatHandler
)

router.put(
    '/kick',
    groupAdminMiddleware,
    validate(kickFromGroupChatSchema),
    kickFromGroupChatHandler

)

router.put(
    '/remove',
    validate(removeChatSchema),
    removeChatHandler
)

router.put(
    '/rename',
    groupAdminMiddleware,
    validate(renameGroupChatSchema),
    renameGroupChatHandler
)

router.put(
    '/groupimage',
    upload.single('groupImage'),
    groupAdminMiddleware,
    validate(updateGroupImageSchema),
    updateGroupImageHandler
)

router.put(
    '/updateusers',
    groupAdminMiddleware,
    validate(updateUsersInGroupChatSchema),
    UpdateUsersInGroupChatHandler
)

export { router as chatRouter };
