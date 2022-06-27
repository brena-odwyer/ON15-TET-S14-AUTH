const userSchema = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const getAll = async (req, res) => {
  const authHeader = req.get('authorization')
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send("Erro no header")
  }

  jwt.verify(token, SECRET, (err) => {
    if(err) {
        return res.status(401).send("Não autorizado")
    }
})
    
  UserSchema.find(function (err, users) {
    if(err) {
      res.status(500).send({ message: err.message })
    }
      res.status(200).send(users)
  }) 
};


//getAll sem autorização
// const getAll = async (req, res) => {
//   userSchema.find(function (err, users) {
//     if(err) {
//       res.status(500).send({ message: err.message })
//     }
//       res.status(200).send(users)
//   }) 
// };

const createUser = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  try {
    if(!req.body.name || !req.body.email) {
      res.status(404).send({
        "message": "Campos obrigatórios precisam ser preenchidos"
      })
    };
    const newUser = new userSchema ({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  
    const savedUser = await newUser.save();

    res.status(201).send({
      "message": "Usuário criado com sucesso",
      savedUser
    });
  } catch (e) {
    console.log(e)
  };
};

module.exports = {
  getAll,
  createUser
}
