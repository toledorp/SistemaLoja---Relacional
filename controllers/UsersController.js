import express from "express";
const router = express.Router()

//ROTA DE LOGIN
router.get("/login", (req, res) =>{
    res.render("login")
});

//ROTA DE CADASTRO
router.get("/cadastro", (req,res) =>{
    res.render("cadastro")
});

export default router;

