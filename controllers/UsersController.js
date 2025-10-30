import express from "express";
const router = express.Router();

//Importandeo models do Usuario
import User from "../models/User.js";

// importando bcrypt - no terminal dar npm install bcrypt
import bcrypt from "bcrypt";
import { where } from "sequelize";

//ROTA DE LOGIN
router.get("/login", (req, res) => {
  res.render("login", {
    hasNoSession: true,
  });
});

//ROTA DE CADASTRO
router.get("/cadastro", (req, res) => {
  res.render("cadastro", {
    hasNoSession: true,
  });
});

//ROTA DE CRIAÇÃO DE USUARIO
router.post("/createUser", (req, res) => {
  //Coletando os dados do formulario
  const email = req.body.email;
  const password = req.body.password;

  // Verificando se o usário ja está cadastrado no banco
  User.findOne({ where: { email: email } }).then((user) => {
    //se o usuario não exisitir
    if (user == undefined) {
      //fara o cadastro

      //gerando o hash de senha - Obs. Quanto maior for o valor do salt mais complexo é a crip´tografia e mais demorado a geração
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      //enviando para o banco
      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //se o usuario já existir
      res.send(`O usuário informado já esta cadastrado! <br>
        <a href="/login">Tentar novamente.</a>`);
    }
  });
});

//Rota de Autenticação
router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //buscando o usuario no banco
  User.findOne({ where: { email: email } }).then((user) => {
    //se o usuario existir
    if (user != undefined) {
      // valida senha
      const correct = bcrypt.compareSync(password, user.password);
      //se a senha for valida
      if (correct) {
        //autoriza login
        //gerando a sessao para o usuario
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        // res.send(`O usuario logado é: <br>
        //   ID: ${req.session.user["id"]} <br>
        //   E-mail: ${req.session.user["email"]}`);
        res.redirect("/");
        //se a senha for invalida
      } else {
        res.send(`A senha digitada esta incorreta. <br> 
          <a href="/login>Tentar novamente!</a>`);
      }
      //se o usuario não existir
    } else {
      res.send(`Usuario informado não existi! <br>
      <a href="/login">Tentar novamente</a>`);
    }
  });
});

//Rota de logout
router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

export default router;
