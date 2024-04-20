const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//dotenv conig
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));

//port
const port = process.env.PORT;
//listen port
app.listen(port, () => { 
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});

app.get('/', (req, res) => {
  res.send('The server is running\n');
});


