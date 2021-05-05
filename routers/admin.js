const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

const { eAdmin } = require("../helpers/helpers")


router.get('/', (req, res) => {
    res.render("admin/home");
});
router.get('/posts', eAdmin, (req, res) => {
        res.send("Pagina de posts")
    })
    //**GRUPO DE ROUTAS Categorias */
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render("admin/categoria", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar!")
            //console.log("Houve um erro ao salvar categoria!")
        res.redirect("/admin")
    })

})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("admin/addcategoria");
})

router.post('/categorias/nova', eAdmin, (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "Slug Inválido"
        })
    }

    if (req.body.nome.length <= 2) {
        erros.push({
            texto: "Nome da categoria  é muito pequeno!"
        })
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", {
            erros: erros
        });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categoria!")
                //console.log("Houve um erro ao salvar categoria!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria });
    }).catch((err) => {
        req.flash("error_msg", "Essa  categoria naao existe!")
            //console.log("Houve um erro ao salvar categoria!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin, (req, res) => {

    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "Slug Inválido"
        })
    }

    if (req.body.nome.length <= 2) {
        erros.push({
            texto: "Nome da categoria  é muito pequeno!"
        })
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", {
            erros: erros
        });
    } else {
        Categoria.findOne({
            _id: req.body.id
        }).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria.save().then(() => {
                req.flash("success_msg", "Editado com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Erro nterno ao salvar a Edicao!");
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao Editar categoria!")
                //console.log("Houve um erro ao salvar categoria!")
            res.redirect("/admin/categorias")
        })
    }
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!");
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
            //console.log("Houve um erro ao salvar categoria!")
        res.redirect("/admin/categorias")
    })
})

//**GRUPO DE ROUTAS POSTAGENS */
router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({ data: 'desc' }).then((postagem) => {
        res.render("admin/postagem", { postagem: postagem });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar!")
        res.redirect("/admin")
    })

})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro o formulario!")
        res.redirect("/admin/categorias")
    })

})

router.post('/postagens/nova', eAdmin, (req, res) => {
    var erros = [];
    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "Slug Inválido"
        })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricao  Inválida"
        })
    }

    if (req.body.conteudo.length <= 75) {
        erros.push({
            texto: "O texto deve ter no minimo 75 caracteres!"
        })
    }
    if (req.body.categoria == "0") {
        erros.push({ text: "Categoria invalida, registre uma categoria" })
    }


    if (erros.length > 0) {
        res.render("admin/addpostagens", {
            erros: erros
        });
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar postagens!")
                //console.log("Houve um erro ao salvar categoria!")
            res.redirect("/admin")
        })
    }

});

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {
        Categoria.find().then((categorias) => {
            res.render("admin/editpostagem", { categorias: categorias, postagem: postagem });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar a postagem!")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Essa  postagem naao existe!")
        res.redirect("/admin/editpostagem")
    })
})

router.post("/postagens/edit", eAdmin, (req, res) => {
    var erros = [];
    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            texto: "Slug Inválido"
        })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricao  Inválida"
        })
    }

    if (req.body.conteudo.length <= 75) {
        erros.push({
            texto: "O texto deve ter no minimo 75 caracteres!"
        })
    }
    if (req.body.categoria == "0") {
        erros.push({ text: "Categoria invalida, registre uma categoria" })
    }


    if (erros.length > 0) {
        res.render("admin/addpostagem", {
            erros: erros
        });
    } else {
        Postagem.findOne({
            _id: req.body.id
        }).then((postagem) => {
            postagem.titulo = req.body.titulo,
                postagem.slug = req.body.slug,
                postagem.descricao = req.body.descricao,
                postagem.conteudo = req.body.conteudo,
                postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Editado com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Erro nterno ao salvar a Edicao!");
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao Editar postagem!")
            res.redirect("/admin/postagens")
        })
    }

})

router.post("/postagens/deletar", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!");
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a postagem!")
            //console.log("Houve um erro ao salvar categoria!")
        res.redirect("/admin/postagens")
    })
})


//**GRUPO DE ROUTAS USUARIOS */
router.get("/usuarios", (req, res) => {
    Usuario.find().sort({ data: 'desc' }).then((usuario) => {
        res.render("admin/usuarios", { usuario: usuario });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar!")
        res.redirect("/admin")
    })

})

router.post("/usuarios/deletar", (req, res) => {
    Usuario.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!");
        res.redirect("/admin/usuarios")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a postagem!")
            //console.log("Houve um erro ao salvar categoria!")
        res.redirect("/admin/usuarios")
    })
})


module.exports = router;
module.exports = router;