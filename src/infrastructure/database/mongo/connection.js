import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};