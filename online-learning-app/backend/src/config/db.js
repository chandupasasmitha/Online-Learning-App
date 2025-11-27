const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection in serverless
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    // MongoDB connection options optimized for Atlas and Serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Limit connection pool for serverless
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to MongoDB Atlas");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  Mongoose disconnected from MongoDB Atlas");
      isConnected = false;
    });
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    isConnected = false;

    // Provide helpful error messages
    if (error.message.includes("authentication failed")) {
      console.error("🔑 Check your database username and password");
    } else if (error.message.includes("IP")) {
      console.error(
        "🌐 Check if your IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for Vercel)"
      );
    } else if (error.message.includes("ENOTFOUND")) {
      console.error(
        "🔗 Check your internet connection and MongoDB Atlas cluster URL"
      );
    }

    throw error; // Let serverless function handle the error
  }
};

module.exports = connectDB;
