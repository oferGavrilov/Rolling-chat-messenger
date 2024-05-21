
export const USER_EMAIL = 'example@example.com';
const USER_ID = '65a819e75ef06affe4a56649'
const USER_PASSWORD = 'demo1234';
const USER_PASSWORD_HASH = '$2a$10$QuwuyYmk6dXD.uNhQL7JDu56Eo5X2JuWMO4vIk.MUZP/tb/rx1y66';
// {
//     "_id": {
//       "$oid": "65a819e75ef06affe4a56649"
//     },
//     "username": "John Doe",
//     "email": "example@example.com",
//     "password": "$2a$10$QuwuyYmk6dXD.uNhQL7JDu56Eo5X2JuWMO4vIk.MUZP/tb/rx1y66",
//     "profileImg": "https://res.cloudinary.com/dqkstk6dw/image/upload/v1708209606/uqmatvngqnkobzthco7n.jpg",
//     "about": "Available",
//     "isOnline": true,
//     "lastSeen": {
//       "$date": "2024-04-21T17:45:35.473Z"
//     },
//     "createdAt": {
//       "$date": "2024-01-17T18:18:15.098Z"
//     },
//     "updatedAt": {
//       "$date": "2024-04-21T17:45:41.153Z"
//     },
//     "__v": 0,
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTgxOWU3NWVmMDZhZmZlNGE1NjY0OSIsImlhdCI6MTcxMzU1OTUzMCwiZXhwIjoxNzE0MTY0MzMwfQ.BqtA39uzYpCaM-2-gHNEWzLdgX4HtBSRmZZtX6_WPjQ",
//     "TN_profileImg": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
//   }

// mock user find by email

// import { IUser } from "@/models/user.model";
// import { ObjectId } from "mongodb";

// export const mockUserFindByEmail = jest.fn(
//     async (email: string): IUser | null => {
//         if (email === USER_EMAIL) {
//             return {
//                 _id: "65a819e75ef06affe4a56649" ,//new ObjectId(USER_ID),
//                 email: USER_EMAIL,
//                 password: USER_PASSWORD_HASH,
//                 username: 'John Doe',
//                 profileImg: 'https://res.cloudinary.com/dqkstk6dw/image/upload/v1708209606/uqmatvngqnkobzthco7n.jpg',
//                 about: 'Available',
//                 isOnline: true,
//             }
//         }
//     }
// )