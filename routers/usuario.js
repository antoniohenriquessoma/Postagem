const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport")




router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})


router.post("/registro", (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({
            texto: "Senha Inválido"
        })
    }
    if (req.body.senha <= 7) {
        erros.push({
            texto: "Senha  deve ter entre 8 a 40 caracteres"
        })
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({
            texto: "As senhas sao diferentes, tente novamente!"
        })
    }


    if (erros.length > 0) {
        res.render("usuarios/registro", {
            erros: erros
        });
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Ja existe uma conta com este e-mail no nosso sistema!")
                res.redirect("/usuario/registro");
            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,

                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario!");
                            res.redirect("/")
                            return;
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Salvo com sucesso!")
                            res.redirect("/usuario/registro");
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao salvar!")
                            res.redirect("/usuario/registro");
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!")
            res.redirect("/usuario/registro");
        })

    }

})

router.get("/login", (req, res) => {
    res.render("usuarios/login");
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/Usuario/login",
        failureFlash: true
    })(req, res, next)
    res.render("usuarios/login");
})

router.get("/perfil", (req, res) => {
    res.render("usuarios/perfil");
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Desligado com sucesso!")
    res.redirect("/");
})



module.exports = router;