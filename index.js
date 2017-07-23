/* jshint node: true, esnext: true */
"use strict";

const express = require("express");
const markdown = require("markdown").markdown;
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("No index right now.");
});

app.get("/page/:page", (req, res) => {
  fs.readFile(`./pages/${req.params.page}`, "utf8", (err, data) => {
    if (err === null) {
      res.send(markdown.toHTML(data));
    } else {
      res.status(404)
         .send(`No page named ${req.params.page}.`);
    }
  });
});

app.listen(port);
