const Marker = require('../models/Marker')

module.exports = {
  //Get
  async get(req, res) {
    const marker = await Marker.find()
    res.json(marker)
},

//add
async create(req, res) {
    const { date } = req.body
    try{
    const marker = await Marker.create({
        date
    })
        res.json(marker)
    }catch{
        res.json({ error: "Falha no registro, tente novamente! " })
    }
},

//update
async update(req, res) {
    const { date } = req.body
    await Marker.findByIdAndUpdate(req.params.id, {
      date
    }).then(() => {
        res.json({ success: "Dado Atualizado com sucesso!" })
    }).catch((err) => {
        res.json({ error: "Erro ao atualizar dado: " + err })
    })
},

//delete
async delete(req, res) {
    await Marker.findByIdAndDelete(req.params.id).then(() => {
        res.json({ success: "Dado deletado!" })
    }).catch((err) => {
        res.json({ error: "Erro ao deletar dados " + err })
    })
},

}