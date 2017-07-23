/* jshint node: true, esnext: true */
"use strict";

const express = require("express");
const markdown = require("markdown").markdown;
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

let pageTemplate;
let indexTemplate;

app.get("/", (req, res) => {
  console.info("Got asked for index.");

  fs.readdir("./pages", (err, files) => {
    if (err) {
      res.status(500)
         .send("Could not fetch page list.");
    } else {
      let pageListItems = [];

      for (let filename of files) {
        pageListItems.push(`<li><a href="/${filename}">${filename}</a></li>`);
      }

      const pageList = `<ul>\n${pageListItems.join('\n')}\n</ul>`;

      res.send(indexTemplate.replace(/__PAGES__/g, pageList));
    }
  });
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

fs.readFile("./pageTemplate.html", "utf8", (err, data) => {
  if (err) throw err;

  pageTemplate = data;
  fs.readFile("./indexTemplate.html", "utf8", (err, data) => {
    if (err) throw err;
    indexTemplate = data;

    console.info("Starting.");
    app.listen(port);
  });
});
