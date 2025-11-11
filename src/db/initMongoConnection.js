import mongoose from "mongoose";

export async function initMongoConnection() {
    const {
        MONGODB_USER,
        MONGODB_PASSWORD,
        MONGODB_URL,
        MONGODB_DB
    } = process.env;
    
    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
        throw new Error('Missing MongoDB environment variables. Check .env'); 
    }
    const connectionString = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongo connection successfully estabished!');
    }
    catch (err) {
        console.error('Mongo connection error:', err);
        throw err;
    };
    
}