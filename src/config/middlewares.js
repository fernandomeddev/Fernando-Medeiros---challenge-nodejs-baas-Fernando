const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path")
const swaggerUi = require('swagger-ui-express')

const swaggerDocs = require('../swagger.json');



module.exports = app => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use("/files", express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use(morgan('dev'))
    app.use(cors());

};