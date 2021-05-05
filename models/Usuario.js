const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({

    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    },
    nivel: {
        type: Number,
        default: 0
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("usuarios", Usuario);