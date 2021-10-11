const sql = require('mssql')
const config = require('./configdb.json')
//организовать передачу данных об ошибках на фронт
module.exports.existsIn = async function existsIn(table, key) {
    try {
        const sqlconnect = await sql.connect(config)
        const req = await sqlconnect.request()
            .query(` select * from ${table} where id=${key}`)
        const data = req.recordset[0]
        await sqlconnect.close()
        return data
    } catch (err) {
        throw err
    }
}
module.exports.selectAll = async function selectAll(table) {
    try {
        let sqlconnect = await sql.connect(config)
        let result = await sqlconnect.request()
            .query(` select * from ${table}`)
        console.log(`Table ${table} sended all`)
        await sqlconnect.close()
        return result.recordset
    } catch (err) {
        throw err.name
    }
}
module.exports.selectAllNames = async function selectAllNames(tablenames) { 
    let result = []
    try {
        let sqlconnect = await sql.connect(config)
        for (tablename in tablenames) {
            let req = await sqlconnect.request()
                .query(` select ID,Name from ${tablenames[tablename]}`)
            console.log(`ID,Name ${tablenames[tablename]} getted`)
            result += `,"${tablenames[tablename]}":` + JSON.stringify(req.recordset)
        }
        await sqlconnect.close()
        return ('{' + result.substr(1) + '}')
    } catch (err) {
        throw err.name
    }
}
module.exports.deleteByKey =async function deleteByKey(table,key){
    try {
        let sqlconnect = await sql.connect(config)
        let result = await sqlconnect.request()
            .query(`delete from ${table} where id=${key}`)
            sqlconnect.close()
        return result
    } catch (err) {
        return res.status(err.status).send(err.name)
    }
}
// был вариант динамически генерировать запросы, реализованные в моделях, но с целью экономии времени не реализовано 
module.exports.Model_Eq_model = class Model_Eq_model {
    constructor(item, table) {
        this.item = item
        this.table = table
    }
    async insert() {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID', sql.Int, this.item.ID)
            await result.input('Name', sql.NVarChar(255), this.item.Name)
            await result.input('Model_type', sql.NVarChar(3), this.item.Model_type)
            await result.input('Active', sql.Bit, this.item.Active)
            await result.input('Sname', sql.NVarChar(10), this.item.Sname)
            await result.query(`SET IDENTITY_INSERT ${this.table} ON
                insert into ${this.table} (ID, Name, Model_type, Active, Sname) values (@ID, @Name, @Model_type, @Active, @Sname)`)
            await sqlconnect.close()
            return (this.item)
        } catch (err) {
            
                      console.log(err)
            return err
        }
    }
    async update(key, pdata) {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('Name', sql.NVarChar(255), this.item.Name || pdata.Name)
            await result.input('Model_type', sql.NVarChar(3), this.item.Model_type || pdata.Model_type)
            if (this.item.Active != undefined) await result.input('Active', sql.Bit, this.item.Active)
            else await result.input('Active', sql.Bit, pdata.Active)
            await result.input('Sname', sql.NVarChar(10), this.item.Sname || pdata.Sname)
            await result.query(`UPDATE ${this.table} SET Name=@Name, Model_type=@Model_type, Active=@Active, Sname=@Sname where id=${key}`)
            await sqlconnect.close()
            return ({
                ID: Number(key),
                Name: result.parameters.Name.value,
                Model_type: result.parameters.Model_type.value,
                Active: result.parameters.Active.value,
                Sname: result.parameters.Sname.value
            })
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports.Model_parameter = class Model_parameter {
    constructor(item, table) {
        this.item = item
        this.table = table
    }
    async insert() {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID', sql.Int, this.item.ID)
            await result.input('Name', sql.NVarChar(255), this.item.Name)
            await result.input('Active', sql.Bit, this.item.Active)
            await result.input('Unit', sql.NVarChar(12), this.item.Unit)
            await result.input('STATUS_CODE', sql.NVarChar(12), this.item.STATUS_CODE)
            await result.input('SUB_STATUS_CODE', sql.NVarChar(12), this.item.SUB_STATUS_CODE)
            await result.query(`SET IDENTITY_INSERT ${this.table} ON
            insert into ${this.table} (ID, Name, Active, Unit, STATUS_CODE, SUB_STATUS_CODE) values (@ID, @Name, @Active, @Unit, @STATUS_CODE, @SUB_STATUS_CODE)`)
            sqlconnect.close()
            return (this.item)
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async update(key, pdata) {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('Name', sql.NVarChar(255), this.item.Name || pdata.Name)
            if (this.item.Active != undefined) await result.input('Active', sql.Bit, this.item.Active)
            else await result.input('Active', sql.Bit, pdata.Active)
            await result.input('Unit', sql.NVarChar(12), this.item.Unit || pdata.Unit)
            await result.input('STATUS_CODE', sql.NVarChar(12), this.item.STATUS_CODE || pdata.STATUS_CODE)
            await result.input('SUB_STATUS_CODE', sql.NVarChar(12), this.item.SUB_STATUS_CODE || pdata.SUB_STATUS_CODE)
            await result.query(`UPDATE ${this.table} SET Name=@Name, Active=@Active, Unit=@Unit, STATUS_CODE=@STATUS_CODE, SUB_STATUS_CODE=@SUB_STATUS_CODE where id=${key}`)
            sqlconnect.close()

            return ({
                ID: Number(key),
                Name: result.parameters.Name.value,
                Active: result.parameters.Active.value,
                Unit: result.parameters.Unit.value,
                STATUS_CODE: result.parameters.STATUS_CODE.value,
            })
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports.Model_process = class Model_process {
    constructor(item, table) {
        this.item = item
        this.table = table
    }
    async insert() {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID', sql.Int, this.item.ID)
            await result.input('Name', sql.NVarChar(255), this.item.Name)
            await result.input('Active', sql.Bit, this.item.Active)
            await result.query(`SET IDENTITY_INSERT ${this.table} ON
            insert into ${this.table} (ID, Name, Active) values (@ID, @Name, @Active)`)
            sqlconnect.close()
            
            return (this.item)
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async update(key, pdata) {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('Name', sql.NVarChar(255), this.item.Name || pdata.Name)
            if (this.item.Active != undefined) await result.input('Active', sql.Bit, this.item.Active)
            else await result.input('Active', sql.Bit, pdata.Active)
            await result.query(`UPDATE ${this.table} SET Name=@Name, Active=@Active where id=${key}`)
            sqlconnect.close()
            return ({ 
                ID: Number(key),
                 Name: result.parameters.Name.value,
                   Active: result.parameters.Active.value
                })
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports.Model_target_type = class Model_target_type {
    constructor(item, table) {
        this.item = item
        this.table = table
    }
    async insert() {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID', sql.Int, this.item.ID)
            await result.input('Name', sql.NVarChar(255), this.item.Name)
            await result.input('Active', sql.Bit, this.item.Active)
            await result.input('Descr', sql.NVarChar(255), this.item.Descr)
            await result.query(`SET IDENTITY_INSERT ${this.table} ON
            insert into ${this.table} (ID, Name, Active, Descr) values (@ID, @Name, @Active, @Descr)`)
            sqlconnect.close()
            return (this.item)
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async update(key, pdata) {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('Name', sql.NVarChar(255), this.item.Name || pdata.Name)
            if (this.item.Active != undefined) await result.input('Active', sql.Bit, this.item.Active)
            else await result.input('Active', sql.Bit, pdata.Active)
            await result.input('Descr', sql.NVarChar(255), this.item.Descr||pdata.Descr)
            await result.query(`UPDATE ${this.table} SET Name=@Name, Active=@Active, Descr=@Descr where id=${key}`)
            sqlconnect.close()
            return ({ 
                ID: Number(key),
                 Name: result.parameters.Name.value,
                   Active: result.parameters.Active.value,
                   Descr: result.parameters.Descr.value
                })
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports.Model_target_trans = class Model_target_trans {
    constructor(item, table) {
        this.item = item
        this.table = table
    }
    async insert() {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID', sql.Int, this.item.ID)
            await result.input('ID_Loader_model', sql.Int, this.item.ID_Loader_model)
            await result.input('ID_Hauler_model', sql.Int, this.item.ID_Hauler_model)
            await result.input('ID_Drill_model', sql.Int, this.item.ID_Drill_model)
            await result.input('ID_Process', sql.Int, this.item.ID_Process)
            await result.input('ID_Parameter', sql.Int, this.item.ID_Parameter)
            await result.input('ID_Target_type', sql.Int, this.item.ID_Target_type)
            await result.input('Target', sql.Float, this.item.Target)
            await result.query(`SET IDENTITY_INSERT ${this.table} ON
            insert into ${this.table} (ID, ID_Loader_model, ID_Hauler_model, ID_Drill_model, ID_Process, ID_Parameter,ID_Target_type, Target) values
             (@ID, @ID_Loader_model, @ID_Hauler_model, @ID_Drill_model, @ID_Process, @ID_Parameter, @ID_Target_type, @Target)`)
            sqlconnect.close()
            return (this.item)
        } catch (err) {
            console.log(err)
            return err
        }
    }
    async update(key, pdata) {
        try {
            const sqlconnect = await sql.connect(config)
            let result = await sqlconnect.request()
            await result.input('ID_Hauler_model', sql.Int, this.item.ID_Hauler_model||pdata.ID_Hauler_model)
            await result.input('ID_Loader_model', sql.Int, this.item.ID_Loader_model||pdata.ID_Hauler_model)
            await result.input('ID_Drill_model', sql.Int, this.item.ID_Drill_model||pdata.ID_Drill_model)
            await result.input('ID_Process', sql.Int, this.item.ID_Process||pdata.ID_Process)
            await result.input('ID_Parameter', sql.Int, this.item.ID_Parameter||pdata.ID_Parameter)
            await result.input('ID_Target_type', sql.Int, this.item.ID_Target_type||pdata.ID_Target_type)
            await result.input('Target', sql.Float, this.item.Target||pdata.Target)
            await result.query(`UPDATE ${this.table} SET ID_Hauler_model=@ID_Hauler_model,ID_Loader_model=@ID_Loader_model, ID_Drill_model=@ID_Drill_model, ID_Process=@ID_Process, ID_Parameter=@ID_Parameter, ID_Target_type=@ID_Target_type, Target=@Target where id=${key}`)
            sqlconnect.close()
            return ({ 
                ID: Number(key),
                ID_Hauler_model: result.parameters.ID_Hauler_model.value,
                ID_Loader_model: result.parameters.ID_Loader_model.value,
                ID_Drill_model: result.parameters.ID_Drill_model.value,
                ID_Process: result.parameters.ID_Process.value,
                ID_Parameter: result.parameters.ID_Parameter.value,
                ID_Target_type: result.parameters.ID_Target_type.value,
                Target: result.parameters.Target.value
                })
        } catch (err) {
            console.log(err)
            return err
        }
    }
}