// importing express
const express = require("express");
// importing body-parser
const bodyParser = require("body-parser");
// importing mongoose
const mongoose = require("mongoose");
// importing ejs
const ejs = require("ejs");

//Set up default mongoose connection
var mongoDB = "mongodb://127.0.0.1/wikiDB";
mongoose.set("strictQuery", false);
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Creating app using express
const app = express();
// Setting the view engine to ejs
app.set("view engine", "ejs");
// Setting the public folder to static
app.use(express.static("public"));

// Creating port
const port = 3000;

// using the bodyParser in urlEncoder mode
app.use(bodyParser.urlencoded({ extended: true }));

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// get function for "/" route
app.get("/", (req, res) => {
  res.send("Wiki-Api");
});

// get function for "/articles" route
app.get("/articles", (req, res) => {
  Article.find({}, { _id: 0, title: 1, content: 1 }, (err, articles) => {
    if (!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", (req, res) => {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save((err) => {
    if (!err) {
      res.send("Success");
    } else {
      res.send(err);
    }
  });
});



// Listening to the port
app.listen(port, () => {
  // Console logging the server starting message
  console.log("Server is online at port : " + port);
});
