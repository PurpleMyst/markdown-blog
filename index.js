/* jshint node: true, esnext: true */
"use strict";

const express = require("express");
const markdown = require("markdown").markdown;
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

let pageTemplate;

app.get("/", (req, res) => {
  console.info("Got asked for index.");
  res.send("No index right now.");
});

app.get("/:page", (req, res) => {
  const page = req.params.page;

  console.info(`Got asked to serve ${page}.`);
  fs.readFile(`./pages/${page}`, "utf8", (err, data) => {
    if (err === null) {
      console.info("Found page!");
      res.send(pageTemplate.replace(/__MARKDOWN__/g, markdown.toHTML(data)));
    } else {
      console.error("Couldn't find page.");
      res.status(404)
         .send(`No page named ${page}.`);
    }
  });
});

fs.readFile("./template.html", "utf8", (err, data) => {
  if (err) throw err;

  console.info("Starting.");
  pageTemplate = data;
  app.listen(port);
});
