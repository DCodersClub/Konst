const express = require("express");
const ejs = require("ejs");

module.exports = async (app) => {
  const http = require("http").createServer(app);
  app.use(express.json());
  app.use(express.urlencoded({
      extended:true
  }));

  app.use(express.static("public"));
  app.set("view engine", "ejs");
  return app;
};