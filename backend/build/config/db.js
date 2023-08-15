var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
let connection = null;
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to MongoDB...');
    try {
        let mongoURI;
        if (process.env.NODE_ENV === 'production') {
            mongoURI = process.env.MONGO_ATLAS_URI;
        }
        else {
            mongoURI = process.env.MONGO_LOCAL_URI;
        }
        if (!mongoURI) {
            throw new Error('MongoDB connection URI is not defined');
        }
        connection = yield mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
export const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection) {
        yield connection.disconnect();
        console.log('MongoDB Disconnected');
    }
});
//# sourceMappingURL=db.js.map