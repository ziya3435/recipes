const mysql = require("mysql");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
var connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'Ax17*.c*',
    database: 'recipes'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("MYSQL'e bağlandı..");
}); -

app.get("/", function (req, res) {
    var sql = "SELECT * FROM banners WHERE visible=1 ORDER BY seq;" +
    " SELECT recipes.*, ( SELECT ROUND(AVG(rating)) FROM comments GROUP BY recipe HAVING recipe = recipes.recipe_id ) rating  FROM recipes     WHERE recipes.visible=1 ORDER BY recipes.create_date DESC limit 9;"+
    "SELECT * FROM recipes  WHERE visible=1 ORDER BY read_score DESC LIMIT 3;"+
    "SELECT * FROM categories ORDER BY title;";
    connection.query(sql, function (err, results, fields) {

        if (err) throw err;
        res.render("index", {
            slider: results[0],
            recipes:results[1],
            popular: results[2],
            categories: results[3]
        })

    });

});
app.get("/tarifler/:tarif", function (req, res) {
  var tarif = req.params.tarif;
    var sql = "SELECT * FROM recipes WHERE recipe_id="+tarif+";"+
    "SELECT * FROM ingredients WHERE recipe="+tarif+ ";"+
    "SELECT * FROM directions WHERE recipe="+tarif+ ";" +
    "SELECT * FROM comments WHERE recipe="+tarif + ";"+
    "SELECT ROUND(AVG(rating)) FROM comments GROUP BY recipe HAVING recipe="+tarif+ ";"+
    "SELECT * FROM recipes  WHERE visible=1 ORDER BY read_score DESC LIMIT 3;"+
    "SELECT * FROM categories ORDER BY title;"+
    "SELECT * FROM recipes ORDER BY RAND() LIMIT 3;";

    connection.query(sql, function (err, results, fields) {

        if (err) throw err;
        res.render("recipe-detail", {
            recipe: results[0],
            ingredients:results[1],
            directions:results[2],
            comments:results[3],
            rating : results[4],
            popular: results[5],
            categories: results[6],
            randomRecipes: results[7]
        })

    });

});


app.get("/search/:cat/:text", function(req, res){
     var sql = "SELECT * FROM categories ORDER BY title;";

    connection.query(sql, function (err, results, fields) {

        if (err) throw err;
        res.render("search", {
            categories: results
        })

    });

});

app.listen("9000");
