const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const connection = require('./app/database/database');

const Cliente = require('./app/Models/Cliente');

app.use(express.static(__dirname + '/app'));
app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

connection
    .authenticate()
    .then(() => {
        console.log("Sucesso")
    })
    .catch((err) => {
        console.log(err)
    });

app.get('/', (req, res) => {
    res.render(__dirname + '/app/views/index.ejs');
});

app.post('/cadastrar', (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var cep = req.body.cep;
    var logradouro = req.body.logradouro;
    var numero = req.body.numero;
    var bairro = req.body. bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var cpf = null;
    var cnpj = null;
    if(req.body.cpfOuCnpj.length == 14){
        var cpf = req.body.cpfOuCnpj;
    }else if(req.body.cpfOuCnpj.length == 18){
        var cnpj = req.body.cpfOuCnpj;
    }

    (async () => {
        const database = require('./app/database/database');
     
        try {
            const resultado = await database.sync();
            console.log("Sync bem sucedido");
        } catch (error) {
            console.log("Deu zica");
        }
    })();

    if(nome != null){
        const resultadoCreate = Cliente.create({
            nome: nome,
            telefone: telefone,
            email: email,
            cep: cep,
            cpf: cpf,
            cnpj: cnpj,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        }).then(
            res.redirect('/usuarios')
        ).catch((err) => {
            res.send(err)
        });
    }
});

app.get('/usuarios', (req, res) => {
    Cliente.findAll().then(clientes => {
        res.render(__dirname + '/app/views/usuarios.ejs', {clientes: clientes});
    });
    
});

app.post('/deletar', (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Cliente.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/usuarios');
            })
        }else{
            res.redirect('/usuarios');
        }
    }else{
        res.redirect('/usuarios');
    }
});

app.get('/usuarios/:id', (req, res) => {
    var id = req.params.id;
    Cliente.findByPk(id).then(cliente => {
        if(isNaN(id)){
            res.redirect('/usuarios');
        }
        if(cliente != undefined){
            res.render(__dirname + '/app/views/detalhes.ejs', {cliente: cliente});
        }else{
            res.redirect('/usuarios');
        }
    }).catch(erro => {
        res.redirect('/usuarios');
    })
});

var port = process.env.PORT || 3000;
app.listen(port);