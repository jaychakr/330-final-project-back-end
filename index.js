require('dotenv').config();
const app = require("./server");
const mongoose = require('mongoose');

const PORT = 3000;

// Connect to the DB
mongoose.connect(process.env.MONGO_CONNECT_URI).then(() => {
    console.log('DB connected!');

    // Start the server
    app.listen(PORT, () => {
        console.log('App is running on localhost:3000');
    });
});