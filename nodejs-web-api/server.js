const express = require('express');
const models=require('./db/models');
const cors = require('cors');
const bodyParser = require('body-parser');
const config=require('./configserver.json');

const app = express();
app.use(cors({origin: config.corsurl}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// сформировать обработку и отправку недостающих ошибок и отправку их на фронт
// конфигурация сервера указана в configdb.json и configserver.json
app.get('/Selectall/:tablename', async (req, res) => {
    const table =(req.params.tablename)
    const request=await models.selectAll(table)
    return res.send(request)
});
app.put('/Selectallnames', async (req, res) => {
    const tablenames =JSON.parse(req.body.tablenames)
    const request=await models.selectAllNames(tablenames)
    return res.send(request)
});
app.post('/Insert/:tablename', async (req, res) => {
    const table =req.params.tablename
    const item =JSON.parse(req.body.values)
    let m
    try {
        const pdata=await models.existsIn(table,item.ID)
        if(pdata)
        return res.sendStatus(405)
        switch(table){
            case("Eq_model"):{
            m= new models.Model_Eq_model(item,table)
            break;
            }
        case("parameter"):{
            m= new models.Model_parameter(item,table)
            break;
        }
        case("process"):{
            m= new models.Model_process(item,table)
            break;
        }
        case("target_type"):{
            m= new models.Model_target_type(item,table)
            break;
        }
        case("target_trans"):{
            m= new models.Model_target_trans(item,table)
            break;
        }
        default: return res.statusCode(404)
        }
        const result=await m.insert()
        return res.status(200).send(result)
    } catch (err) {
        console.log(err)
        return res.status(err.status).send(err.name)
    }
});
app.delete('/Delete/:tablename', async (req, res) => {
    const table = (req.params.tablename)
    const key = (req.body.key)
    try {
        const result= models.deleteByKey(table,key)
        return res.status(200).send(result)
    } catch (err) {
        return res.status(200).send(err.name)
    }
});
app.put('/Update/:tablename', async (req, res) => {
    const table =req.params.tablename
    const item =JSON.parse(req.body.values)
    const key =req.body.key
    let m
    try {
        const pdata=await models.existsIn(table,key)
        if(!pdata)
        return res.sendStatus(404)
        switch(table){
            case("Eq_model"):{
            m= new models.Model_Eq_model(item,table)
            break;
            }
        case("parameter"):{
            m= new models.Model_parameter(item,table)
            break;
        }
        case("process"):{
            m= new models.Model_process(item,table)
            break;
        }
        case("target_type"):{
            m= new models.Model_target_type(item,table)
            break;
        }
        case("target_trans"):{
            m= new models.Model_target_trans(item,table)
            break;
        }
        default: return res.statusCode(404)
        }
        const result=await m.update(key,pdata)
        return res.status(200).send(result)
    } catch (err) {
        console.log(err)
        return res.status(err.status).send(err.name)
    }
});
let server = app.listen(config.portserver, () => {
    console.log(`Server is running on port ${config.portserver}`);
});
