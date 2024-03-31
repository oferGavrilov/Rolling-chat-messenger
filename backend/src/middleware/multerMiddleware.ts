import { Request } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  // file: Multer.File,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
