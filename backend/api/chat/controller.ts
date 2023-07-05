
import { Response } from 'express'
import { AuthenticatedRequest } from '../../models/types'
import { User } from '../../models/user.model'
import { addToGroupChatService, createChatService, createGroupChatService, getChatsService, getUserChatsService, removeFromGroupChatService, renameGroupChatService, updateGroupImageService } from './service'

export async function createChat (req: AuthenticatedRequest, res: Response) {
      const { userId } = req.body;
      const currentUser = req.user as User;

      try {
            const chat = await createChatService(userId, currentUser);
            res.status(200).json(chat);
      } catch (error) {
            console.error('Error creating chat:', error);
            res.status(400).json({ message: 'Error creating chat' });
      }
}

export async function getChats (req: AuthenticatedRequest, res: Response) {
      try {
            const chats = await getChatsService(req.user as User);
            res.status(200).send(chats);
      } catch (error) {
            console.error('Error retrieving chats:', error);
            res.status(400).json({ message: 'Error retrieving chats' });
      }
}

export async function getUserChats (req: AuthenticatedRequest, res: Response) {
      const { userId } = req.params;

      if (!userId) {
            console.log('No user id sent to the server');
            return res.status(400).json({ message: 'No user id sent to the server' });
      }

      try {
            const result = await getUserChatsService(req.user as User, userId);
            res.status(200).send(result);
      } catch (error) {
            console.error('Error retrieving user chats:', error);
            res.status(400).json({ message: 'Error retrieving user chats' });
      }
}


export async function createGroupChat (req: AuthenticatedRequest, res: Response) {
      const { users, chatName, groupImage } = req.body;
      const currentUser = req.user as User;

      try {
            const createdChat = await createGroupChatService(users, chatName, groupImage, currentUser);
            res.status(200).send(createdChat);
      } catch (error) {
            console.error('Error creating group chat:', error);
            res.status(400).json({ message: 'Error creating group chat' });
      }
}

export async function renameGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, groupName } = req.body;

      try {
            const updatedGroupName = await renameGroupChatService(chatId, groupName);
            res.status(200).send(updatedGroupName);
      } catch (error) {
            console.error('Error renaming group chat:', error);
            res.status(400).json({ message: 'Error renaming group chat' });
      }
}

export async function updateGroupImage (req: AuthenticatedRequest, res: Response) {
      const { chatId, groupImage } = req.body;

      try {
            const updatedGroupImage = await updateGroupImageService(chatId, groupImage);
            res.status(200).send(updatedGroupImage);
      } catch (error) {
            console.error('Error updating group image:', error);
            res.status(400).json({ message: 'Error updating group image' });
      }
}

export async function addToGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, userId } = req.body;

      try {
            const addedChat = await addToGroupChatService(chatId, userId);
            res.status(200).send(addedChat);
      } catch (error) {
            console.error('Error adding user to group chat:', error);
            res.status(400).json({ message: 'Error adding user to group chat' });
      }
}

export async function removeFromGroupChat (req: AuthenticatedRequest, res: Response) {
      const { chatId, userId } = req.body;

      try {
            const removedChat = await removeFromGroupChatService(chatId, userId);
            res.status(200).send(removedChat);
      } catch (error) {
            console.error('Error removing user from group chat:', error);
            res.status(400).json({ message: 'Error removing user from group chat' });
      }
}
