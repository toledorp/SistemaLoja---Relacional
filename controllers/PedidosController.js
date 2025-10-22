import express from "express";
import Pedido from "../models/Pedido.js";
import Cliente from "../models/Cliente.js"

const router = express.Router();

// ROTA PEDIDOS
router.get("/pedidos", function (req, res) {
  // Realiza ambas as consultas em paraleo dentro de uma promessa
  Promise.all([
    Pedido.findAll({
      //Fazendo o innerjoin com a tabela de clientes
      include: [
        {
          model: Cliente, // Inclui o modelo Cliente que esta relacionado
          required: true, // Garante que somente pedidos com clientes sejam retornados
        },
      ],
    }),
    Cliente.findAll(),
  ])
    .then(([pedidos, clientes]) => {
      res.render("pedidos", {
        pedidos: pedidos,
        clientes: clientes,
      });
    }).catch((err) => {
      console.log(err);
    });
});

// ROTA DE CADASTRO DE PEDIDOS
router.post("/pedidos/new", (req, res) => {
  const numero = req.body.numero;
  const valor = req.body.valor;
  const clienteId = req.body.clienteId;
  Pedido.create({
    numero: numero,
    valor: valor,
    cliente_id: clienteId
  }).then(() => {
      res.redirect("/pedidos");
    }).catch((err) => {
      console.log(err);
    });
});

// ROTA DE EXCLUSÃO DE CLIENTES
router.get("/pedidos/delete/:id", (req, res) => {
  const id = req.params.id;
  Pedido.destroy({
    where: {id: id}
  }).then(() => {
      res.redirect("/pedidos");
    }).catch((err) => {
      console.log(err);
    });
});

export default router;
