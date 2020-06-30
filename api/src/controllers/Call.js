const Call = require('../models/Call')

module.exports = {

	//consulta completa------------------------------------------------------------------------------------
    async getAll(req, res){
        const calls = await Call.find()
        res.json(calls)
    },

    //consulta unica----------------------------------------------------------------------------------------
    async getOne(req, res){
        const calls = await Call.findById(req.params.id)
        res.json(calls)
    },

    //Consulta por ID do usuario motorista-------------------------------------------------------------------
     async getIdDriver(req, res){
        const {idDriver} = req.query
        const calls = await Call.find({ idDriver })
        res.json(calls)
    },

     //Consulta por ID do usuario cliente-------------------------------------------------------------------
     async getIdUser(req, res){
        const {idUser} = req.query
        const calls = await Call.find({idUser: idUser})
        res.json(calls)
    },

    //Consulta por status -------------------------------------------------------------------
    async getStatus(req, res){
        const { status } = req.query
        const calls = await Call.find({ status })
        res.json(calls)
    },


	//add---------------------------------------------------------------------------------------------------
    async create(req, res){
        const {idUser, name, fone, latitude, longitude, hour, min, sec, cont,
         status, distance, enderecoDestino, latitudeDestino,
         longitudeDestino, titleDestino, idDriver, nameDriver, foneDriver, latDriver, lgtDriver, placa, carro, valor} = req.body
        await Call.create({
        	idUser,
            name,
            fone,
            latitude,
            longitude,
            hour,
            min,
            sec,
            cont,
            status,
            distance,
            enderecoDestino,
            latitudeDestino,
            longitudeDestino,
            titleDestino,
            idDriver,
            nameDriver,
            foneDriver,
            latDriver,
            lgtDriver,
            placa,
            carro,
            valor,
        }).then(()=>{
            res.json("Dados Salvos com sucesso!")
        }).catch((err)=>{
            res.json("Erro ao salvar dados: "+err)
        })
    },

    //delete por id-------------------------------------------------------------------------------------------
    async delete(req, res){
    const calls = await Call.findByIdAndDelete(req.params.id).then(()=>{
        res.json("Dados deletados!")
    })
    },

    //deleteMany
    async deleteMany(req, res){
    const calls = await Call.deleteMany().then(()=>{
        res.json("Todos os dados foram deletados!")
    })
    },

    //update StatusCall---------------------------------------------------------------------------------------
    async updateStatus(req, res){
        const {status} = req.body
        await Call.findByIdAndUpdate(req.params.id, {
           status,
        }).then(()=>{
            res.json({success: "Status atualizado" })
        }).catch((err)=>{
            res.json({error: `Erro: ${err}`})
        })
    },

        //update StatusCall---------------------------------------------------------------------------------------
        async updateIdDriver(req, res){
            const {idDriver} = req.body
            await Call.findByIdAndUpdate(req.params.id, {
            idDriver,
            }).then(()=>{
                res.json({success: "Id atualizado" })
            }).catch((err)=>{
                res.json({error: `Erro: ${err}`})
            })
        },

       //update StatusCall---------------------------------------------------------------------------------------
       async updateNota(req, res){
        const {notaDriver} = req.body
        await Call.findByIdAndUpdate(req.params.id, {
           notaDriver,
        }).then(()=>{
            res.json({success: "Nota atualizada" })
        }).catch((err)=>{
            res.json({error: `Erro: ${err}`})
        })
    },

     //update IdUser---------------------------------------------------------------------------------------
     async updateIdUser(req, res){
        const {idUser} = req.body
        await Call.findByIdAndUpdate(req.params.id, {
           idUser,
        }).then(()=>{
            res.json({success: "idUser atualizado" })
        }).catch((err)=>{
            res.json({error: `Erro: ${err}`})
        })
    },

    //update IdUser---------------------------------------------------------------------------------------
    async updateReceiveCall(req, res){
        const {receiveCall} = req.body
        await Call.findByIdAndUpdate(req.params.id, {
            receiveCall,
        }).then(()=>{
            res.json({success: "receiveCall atualizado" })
        }).catch((err)=>{
            res.json({error: `Erro: ${err}`})
        })
    },


      //update dados Driver---------------------------------------------------------------------------------------
    async updateDriver(req, res){
        const {idDriver, nameDriver, foneDriver, latDriver, lgtDriver, placa, carro} = req.body
        await Call.findByIdAndUpdate(req.params.id, {
           idDriver,
           nameDriver,
           foneDriver,
           latDriver,
           lgtDriver,
           placa,
           carro
        }).then(()=>{
            res.json({ success: "Driver atualizado com sucesso!" })
        }).catch((err)=>{
            res.json({ error: `Erro ao atualizar statusCall: ${err}`})
        })
    },

}
