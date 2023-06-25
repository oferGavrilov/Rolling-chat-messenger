import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
// import Cryptr from 'cryptr'
// import dotenv from 'dotenv'

// dotenv.config()

// const cryptr = new Cryptr(process.env.JWT_SECRET)

export const generateToken = (id: ObjectId) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
      })
}

// export const validateToken = (loginToken: string) => {
//       try {
//             const json = cryptr.decrypt(loginToken);
//             const loggedinUser = JSON.parse(json);
//             return loggedinUser;
//       } catch (err) {
//             console.log('Error decrypting login token:', err);
//             return null;
//       }
// };
