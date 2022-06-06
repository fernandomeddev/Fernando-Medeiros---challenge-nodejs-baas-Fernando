require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true }))



const consign = require('consign')
require('./src/database/mongodb')

consign()
    .then('./src/config/middlewares.js')
    .then('./src/config/multer.js')
    .then('./src/controllers')
    .into(app)

app.get("/terms", (req, res) => {
    return res.json({
        message: "Termos de Serviço"
    })
})

app.listen(3000, () => {
    
    console.log('Api Rodando.');
});