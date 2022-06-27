const UserSchema = require('../models/userSchema');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const login = (req, res) => {
    try {
        // UserSchema.findOne(filtro é o email do usuario, função anonima) essas são os parâmetros
        UserSchema.findOne({ email: req.body.email }, (error, user) => {
            if(!user) {
                return res.status(401).send({
                    message: "User não encontrado",
                    email: `${req.body.email}`
                })
            }
            // o que eu tenho: usuário da requisição e usuário do bando de dados, mesmo email
            // preciso verificar se é também a mesma senha
            //chamar o bcrypt, passar a função de comparar; o req.body.password é a requisição e o user.password é o que vem do banco
            //usamos o password pq corresponde lá no Schema
            const validPassword = bcrypt.compareSync(req.body.password, user.password);
            
            if(!validPassword) {
                return res.status(401).send({
                    "message": "Login não autorizado"
                })
              };
            // jwt.sign(recebe dois, parâmetros)
            //jwt.sign(nome do usuário, SECRET)
            //aí guardamos isso numa const chamada de token
            const token = jwt.sign({ name: user.name }, SECRET);
            
            res.status(200).send({
                message: "Login autorizado",
                token
            });
        
        });
        
    } catch (error) {
        console.error(error)
    };
};

module.exports = {
    login
};