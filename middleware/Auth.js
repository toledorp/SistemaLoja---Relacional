//Middleware de Autenticação

function Auth(req, res, next){
    //usuario possui uma sessão no site
    if(req.session.user != undefined){
        //permite a continuação da requisição
        next()
    }else {
        res.render("login");
    }
}

export default Auth;