const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB connection options optimized for Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to MongoDB Atlas");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  Mongoose disconnected from MongoDB Atlas");
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "🔴 Mongoose connection closed due to application termination"
      );
      process.exit(0);
    });
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);

    // Provide helpful error messages
    if (error.message.includes("authentication failed")) {
      console.error("🔑 Check your database username and password");
    } else if (error.message.includes("IP")) {
      console.error(
        "🌐 Check if your IP address is whitelisted in MongoDB Atlas"
      );
    } else if (error.message.includes("ENOTFOUND")) {
      console.error(
        "🔗 Check your internet connection and MongoDB Atlas cluster URL"
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
