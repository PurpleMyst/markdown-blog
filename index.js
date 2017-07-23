/* jshint node: true, esnext: true */
"use strict";

const express = require("express");
const markdown = require("markdown").markdown;
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

let pageStyle;

app.get("/", (req, res) => {
  res.send("No index right now.");
});

app.get("/page/:page", (req, res) => {
  fs.readFile(`./pages/${req.params.page}`, "utf8", (err, data) => {
    if (err === null) {
      let responseHTML = "";

      /* Add styling info */
      responseHTML += `<style>${pageStyle}</style>`

      /* Render the markdown */
      responseHTML += markdown.toHTML(data);

      res.send(responseHTML);
    } else {
      res.status(404)
         .send(`No page named ${req.params.page}.`);
    }
  });
});

fs.readFile("./style.css", "utf8", (err, data) => {
  if (err) throw err;
  pageStyle = data;
  app.listen(port);
});
