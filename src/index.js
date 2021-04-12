require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const loaders = require("./loaders");


async function startServer() {
  const app = express();
  await loaders.init(app);
  app.listen(process.env.PORT || 80, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Server Started`);
  });

  // setting up routes
  // Will see if we can do this in another file
  const indexRoutes=  require("./routes/index");
  const userRoutes= require("./routes/user");
  const leaderboardRoutes = require("./routes/leaderboard");
  const adminRoutes = require("./routes/admin");
  const contestRoutes = require("./routes/contest");
  app.use("/admin",adminRoutes);
  app.use("/leaderboard",leaderboardRoutes);
  app.use("/contest",contestRoutes);
  app.use("/user",userRoutes);
  app.use("/",indexRoutes);
}

startServer();