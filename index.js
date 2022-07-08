const express = require('express');
const exphbs = require('express-handlebars');
const pool = require('./db/conn');

const app = express();

// Configuração para pegar o body do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure the view engine to render handlebars.
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// Home
app.get('/', (req, res)=>{
    res.render('home');
})

// Cadastro de Livros - createBook()
app.post('/books/insertbook', (req, res)=>{
    const title = req.body.title;
    const pagesQty = req.body.pagesqty;

    const query = `INSERT INTO books (??, ??) VALUES (?, ?)`;
    const data = ['title', 'pagesqty', title, pagesQty];

    pool.query(query, data,function(err){
        if(err){
            console.log(err);
            res.send('Erro ao cadastrar livro');
            return
        } else {
            res.redirect('/books');
        }
    })
})

// Recuperação de Livros - getBooks()
app.get('/books', (req, res)=>{
    const query = `SELECT * FROM books`;

    pool.query(query, function(err, data){
        if(err){
            console.log(err);
            res.send('Erro ao recuperar livros');
            return
        }
        const books = data;
        //console.log(books);
        res.render('books', {books});
    })
})

// Recuperação de Livro - getBook(Id)
app.get('/books/:id', (req, res)=>{
    const id = req.params.id;
    const query = `SELECT * FROM books WHERE ?? = ?`;

    const data = ['id', id];

    pool.query(query, data, function(err, data){
        if(err){
            console.log(err);
            res.send('Erro ao recuperar livro');
            return
        }
        const book = data[0];
        //console.log(book);
        res.render('book', {book});
    })
})

// Selecionar Livro por Id - selectBook(Id)
app.get('/books/edit/:id', (req, res)=>{
    const id = req.params.id;
    const query = `SELECT * FROM books WHERE id = ${id}`;

    const data = ['id', id];

    pool.query(query, data, function(err, data){
        if(err){
            console.log(err);
            res.send('Erro ao atualizar livro');
            return
        }

        const book = data[0];
        res.render('editbook', {book});
    })
})

// Atualizar Livro - updateBook(Id)
app.post('/books/updatebook', (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;
    const pagesQty = req.body.pagesqty;
    const query = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
    const data = ['title', title, 'pagesqty', pagesQty, 'id', id];
    pool.query(query, data, function(err){
        if(err){
            console.log(err);
            //res.send('Erro ao atualizar livro');
            return
        }
        res.redirect('/books');
    })
})

// Apagar Livro - deleteBook(Id)
app.post('/books/remove/:id', (req, res)=>{
    const id = req.params.id;
    const query = `DELETE FROM books WHERE ?? = ?`;

    const data = ['id', id];

    pool.query(query, data, function(err){
        if(err){
            console.log(err);
            res.send('Erro ao apagar livro');
            return
        }
        res.redirect('/books');
    })
})

app.listen(3000);
