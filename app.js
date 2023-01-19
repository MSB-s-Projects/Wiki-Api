// importing express
const express = require("express");
// importing body-parser
const bodyParser = require("body-parser");
// importing mongoose
const mongoose = require("mongoose");
// importing ejs
const ejs = require("ejs");
// import dotenv
require("dotenv").config();

//Set up default mongoose connection
var mongoDB = process.env.mongooseURL;
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
  res.send(
    "<div><h1>Wiki-API</h1><h2>This API is RESTful you can use the following commands:</h2><h3>For all articles use '/articles' route:</h3><ul><li>GET</li><li>POST</li><li>DELETE</li></ul><h3>For Specific articeles use the route '/articles/{article-name}':</article-name></h3><ul><li>GET</li><li>POST</li><li>PATCH</li><li>PUT</li><li>DELETE</li></ul></div>"
  );
});

// -----------------------------REQUEST FOR ALL ARTICLES-----------------------------

app
  .route("/articles")

  .get((req, res) => {
    Article.find({}, { _id: 0, title: 1, content: 1 }, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        console.log("Successfully deleted all articles");
      } else {
        console.log(err);
      }
    });
  });

// -----------------------------REQUEST FOR SPECIFIC ARTICLES-----------------------------

app
  .route("/articles/:articleID")

  .get((req, res) => {
    Article.findOne(
      { title: req.params.articleID },
      { _id: 0, title: 1, content: 1 },
      (err, article) => {
        if (!err) {
          if (article !== null) {
            res.send(article);
          } else {
            res.send("Article Not Found");
          }
        } else {
          res.send(err);
        }
      }
    );
  })

  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleID },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleID },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Sucessfully patched");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleID }, (err) => {
      if (!err) {
        res.send("Successfully deleted");
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
