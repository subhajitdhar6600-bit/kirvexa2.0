import crypto from 'crypto';
import Notification from '../models/Notification.js';

export const createNotification = async ({
  userId,
  title,
  message,
  type = 'SYSTEM',
  data = {},
}) => {
  try {
    const notification = await Notification.create({
      id: `notif_${crypto.randomBytes(8).toString('hex')}`,
      userId,
      title,
      message,
      type,
      data,
      isRead: false,
    });
    return notification;
  } catch (error) {
    console.error(`[Notification Error] Failed to create notification: ${error.message}`);
    return null;
  }
};

export default {
  createNotification,
};
