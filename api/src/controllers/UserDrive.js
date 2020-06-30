process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const UserDrive = require('../models/UserDrive')
const nodemailer = require('nodemailer')

async function mail(email, senha) {
    //let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'insitetecnologia2020@gmail.com', // generated ethereal user
        pass: 'elismar9620', // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'Posse Drive', // sender address
      to: email, // list of receivers
      subject: "Bem vindo ao Posse Drive", // Subject line
      text: "Olá, Seja bem vido ao Posse Drive, seu App de carro particular.", // plain text body
      html: `<h6>Seus dados de acesso: <br/> Email: ${email} <br/> Senha: ${senha}</h6>`, // html body
    });
  
    console.log("Message sent:", info.messageId);
  }

module.exports = {
    //consulta completa
    async getAll(req, res){
        const {page=1} = req.query
        const users = await UserDrive.paginate({},{page, limit: 10})
        res.json(users)
    },
    //consulta unica
    async getOne(req, res){
        const users = await UserDrive.findById(req.params.id)
        res.json({user:users})
    },

      //login
    async login(req, res){
    const { email, password } = req.body
    const users = await UserDrive.findOne({email}).select('+password')
    if(!users)
        res.json({error: "Usuario não cadastrado!"})
    
    if (password != users.password) 
        res.json({error: "Senha incorreta!"})

    users.password = undefined

    res.json({user: users})
    },

    //add
    async create(req, res){
        const {name, email, fone, cpf, cnh, carro, placa, renavam, password} = req.body
        try{
        if(await UserDrive.findOne({email})){
        res.json({error: "Email já cadastrado!"})
       }
        else if(await UserDrive.findOne({fone})){
        res.json({error: "Telefone já cadastrado!"})
        }
        else if(await UserDrive.findOne({cpf})){
        res.json({error: "CPF já cadastrado!"})
        }
        else if(await UserDrive.findOne({cnh})){
        res.json({error: "CNH já cadastrada!"})
        }
        else{
        const users = await UserDrive.create({
            name,
            email,
            fone,
            cpf,
            cnh,
            carro,
            placa,
            renavam,
            password
        })

        mail(users.email, users.password)
        users.password = undefined
        res.json({user:users})
    }
    }catch (err){
        res.json({error: `Falha no registro, tente novamente! ${err}`})
    }
    },


    //delete
    async delete(req, res){
    await UserDrive.findByIdAndDelete(req.params.id).then(()=>{
        res.json({success: "Dado deletado!"})
    }).catch((err)=>{
        res.json({error: "Erro ao deletar dados: "+err})
    })
    },

    //update
    async update(req, res){
        const {name, email, fone, cpf, cnh, carro, placa, renavam, password} = req.body
        await UserDrive.findByIdAndUpdate(req.params.id, {
            name,
            email,
            fone,
            cpf,
            cnh,
            carro,
            placa,
            renavam,
            password
        }).then(()=>{
            res.json({success: "Dados Atualizados com sucesso!"})
        }).catch((err)=>{
            res.json({error: "Erro ao atualizar dados: "+err})
        })
    },

    //update
    async updateStatus(req, res){
        const {status} = req.body
        await UserDrive.findByIdAndUpdate(req.params.id, {
            status
        }).then(()=>{
            res.json({success: "Status atualizado com sucesso!"})
        }).catch((err)=>{
            res.json({error: "Erro ao atualizar status: "+err})
        })
    },
}