const express = require("express")
const path = require("path")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: false}))

const db_name = path.join(__dirname, 'data', 'apptest.db')
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful connection to the database 'apptest.db'")
})

const sql_create = `CREATE TABLE IF NOT EXISTS Books (
  Book_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Title VARCHAR(100) NOT NULL,
  Author VARCHAR(100) NOT NULL,
  Comments TEXT
);`;

db.run(sql_create, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful creation of the 'Books' table")
})

const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
  (1, 'Евгений Онегин', 'А.С. Пушкин', 'Роман в стихах охватывает события с 1819 по 1825 год: от Заграничных походов Русской армии после разгрома Наполеона до восстания декабристов. Сюжет романа прост, в центре повествования — история любви Евгения Онегина и Татьяны Лариной.'),
  (2, 'Исповедь хулигана', 'С.A. Есенин', 'Стихотворение «Исповедь хулигана» написано под влиянием эстетики литературного течения имажинистов. Но сквозь надуманный искусственный слой эпатажных образов, необычных метафор, рубленых размеров и аллитераций слышна лирическая сердечность и искренность, отличавшая творчество Сергея Есенина. «Исповедь хулигана» воспринимается прежде всего как правдивый монолог чувствительного и мятущегося, но в то же время дерзкого и непокорного человека. Противоречивость форм и неровность изложения заставляют перечитывать стихотворение еще и еще, отыскивая связующее все строфы звено.'),
  (3, 'Пушкинскому Дому', 'А.А. Блок', '«Пушкинскому дому» — последнее стихотворение Александра Блока (1880-1921)');`;
db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 books");
  });

app.get("/books", (req, res) => {
    const sql = "SELECT * FROM Books ORDER BY Title"
db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: rows });
  });
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = ?";
db.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("edit", { model: row });
  });
});

app.get("/create", (req, res) => {
  const book = {
    Author: ""
  }
  res.render("create", { model: book });
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = ?";
  db.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("delete", { model: row });
  });
});

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const book = [req.body.Title, req.body.Author, req.body.Comments, id];
    const sql = "UPDATE Books SET Title = ?, Author = ?, Comments = ? WHERE (Book_ID = ?)";
db.run(sql, book, err => {
    // if (err) ...
    res.redirect("/books");
  });
})

app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES (?, ?, ?)";
  const book = [req.body.Title, req.body.Author, req.body.Comments];
  db.run(sql, book, err => {
    // if (err) ...
    res.redirect("/books");
  });
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Books WHERE Book_ID = ?";
  db.run(sql, id, err => {
    // if (err) ...
    res.redirect("/books");
  });
});

app.get("/", (req, res) => {
    {
        res.render("index")
    }
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/data", (req, res) => {
    const test = {
        title: "Data test",
        items: ["one", "two", "three"]
    }
    res.render("data", {model: test})
})

app.listen(3000, () => {
    {
        console.log("Server started (http://localhost:3000/) !")
    }
})

