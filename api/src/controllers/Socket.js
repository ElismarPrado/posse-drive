module.exports = {
    async connected(req, res) {
        res.send(req.connectedUsers)
    },

    async canal(req, res){
        const id = req.params.id
        const msg = req.params.msg
        req.io.emit('canal', {id, msg})
        res.send(msg)
    },


    async refresh(req, res){
        req.io.emit('refresh', 'refresh')
        res.send('refresh')
    },

}
