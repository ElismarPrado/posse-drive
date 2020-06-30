const Price = require('../models/Price')

module.exports = {
  //Get
  async get(req, res) {
    const price = await Price.find()
    res.json(price)
},

//add
async create(req, res) {
    const { valor } = req.body
    try{
    const price = await Price.create({
        valor
    })
        res.json(price)
    }catch{
        res.json({ error: "Falha no registro, tente novamente! " })
    }
},

//update
async update(req, res) {
    const { valor } = req.body
    await Price.findByIdAndUpdate(req.params.id, {
      valor
    }).then(() => {
        res.json({ success: "Dado Atualizado com sucesso!" })
    }).catch((err) => {
        res.json({ error: "Erro ao atualizar dado: " + err })
    })
},

//delete
async delete(req, res) {
    await Price.findByIdAndDelete(req.params.id).then(() => {
        res.json({ success: "Dado deletado!" })
    }).catch((err) => {
        res.json({ error: "Erro ao deletar dados " + err })
    })
},

}