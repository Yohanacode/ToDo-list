// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const mongoose = require("mongoose");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
// linking our css files. the only way to serve our page.
// we tell express to serve up these static resources.


// to connect to our mongo db server.
mongoose.connect("mongodb://localhost:27017/toDolistDB", { useNewUrlParser: true });

// what the db will have/contain
const itemsSchema = {
    name: String
  };

// model take two param and the 1st one should be singular bcoz db will plularise it later.
const Item = mongoose.model("item", itemsSchema);

// this creats new docs
const item1 = new Item ({
  name: "code"
});

const item2 = new Item ({
  name: "code more"
});


// put them in an toArray
const defaultItem = [item1, item2];



app.get("/", function(req, res) {

    // this is how yu read from the DB. empty curly braces means find "all".
    // we want to log the items in the DB.
    // founditems will hold the items found and we will be able to access it;
      Item.find({}, function(err, foundItems){
        // if statement to make sure that we do no keep inserting manay items,
        if (foundItems.length === 0){
          // to insert many items in the db;
          Item.insertMany(defaultItem, function(err){
            if (err){
              console.log(err);
            } else {
              console.log("items inserted");
            }
          });
          res.redirect("/");
        } else {
          res.render("list", {dayOfweek: "Today", newListItem: foundItems});
      };
  });
});



app.post("/", function(req, res){
  const itemName = req.body.newItem;
// we creat a new item from schema and when added to redirect to home
// so that it is updated
    const addItem = new Item ({
      name: itemName
    });
// this will save it to item(shortcut for insert many)
// additem because our new const is named additem
  addItem.save();
  res.redirect("/");
});


app.post("/delete", function(req, res){
  // this will get us the id of the checked item and we will remove it
  const checkedId = req.body.checkbox;

  Item.findByIdAndRemove(checkedId, function(err){
    if (!err){
      console.log("successfully deleted");
      res.redirect("/");
     }
  });
});

app.listen(2000, function() {

});
