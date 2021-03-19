const mongoose = require("mongoose");

//Configurando o mongoose 

//mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/mongo").then(() => {
    console.log("MongoDB conectado com sucesso");
}).catch((err) => {
    console.log("Houve um erro ao se conectar ao mongoDB: " + err);
});


//Model- usuarios
//Defiinindo o MODEL
const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobreNome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }

})

//COLLECTION
mongoose.model('usuarios', UsuarioSchema);
const Soma = mongoose.model('usuarios');
new Soma({
    nome: "antonio",
    sobreNome: "Soma",
    email: "email@email.com",
    idade: 23,
    pais: "Angola"
}).save().then(() => {
    console.log("Usuario criado com sucesso!")
}).catch((err) => {
    console.log("Houve um erro ao cadastrar o usario!" + err);
})