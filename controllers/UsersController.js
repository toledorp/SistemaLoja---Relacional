import express from "express";
const router = express.Router();

//Importandeo models do Usuario
import User from "../models/User.js";

//ROTA DE LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

//ROTA DE CADASTRO
router.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

//ROTA DE CRIAÇÃO DE USUARIO
router.post("/createUser", (req, res) => {
  //Coletando os dados do formulario
  const email = req.body.email;
  const password = req.body.password;
  //enviando para o banco
  User.create({
    email: email,
    password: password,
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });
});

export default router;
