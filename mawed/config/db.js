const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`);

    }
    catch (err) {
        console.log(`MongoDB Server Issue ${err.message}`);
    }
}

console.log('MongoDB still Connected');

module.exports = connectDB;