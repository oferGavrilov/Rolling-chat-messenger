import { Request } from 'express'
import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    console.log('File supported')
    cb(null, true); // Accept file
  } else {
    console.error('File not supported')
    cb(null, false); // Reject file
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter })

export default upload
