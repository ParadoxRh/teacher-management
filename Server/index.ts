const express = require('express'); 
import {Request, Response, urlencoded} from 'express';
import Student from './Interface/student.scheme';
import config from './db.connection';

const cors = require('cors');

const sql = require('mssql');

let dbRequest; 



const app = express();
app.use(cors());
const port = 8080;
const data:Student[] = [];

// it enables the usage of JSON type in the request. 
app.use(express.json()); 

// decode the json file sent 
app.use(express.urlencoded({extends:true}))





app.get('/student',(req:Request, res:Response) => {

    sql.connect(config)
    .then((pool:any) => {
       dbRequest = pool.request();
       const dbQuery = "SELECT * FROM student";
       dbRequest.query(dbQuery)
        .then((result:any) => {
        console.log(result.recordset)
          res.send(result.recordset);
          sql.close();
        })
        .catch((err:Error) => {
          console.error('Error executing query:', err.message);
          res.status(500).send('An error occurred.');
          sql.close();
        });
    })
    .catch((err:Error) => {
      console.error('Error connecting to SQL Server:', err.message);
      res.status(500).send('An error occurred.');
    });
})

app.get('/student/:id',(req:Request, res:Response) => {
    res.send('Get WOrking')

})

app.post('/student',(req:Request, res:Response) => {

    const {id, name,subject,score}:Student = req.body; 
    const filtedName = data.find(v => v.name === name); 

    sql.connect(config)
    .then((pool:any) => {
       dbRequest = pool.request();
       const dbQuery = 'INSERT INTO student (id, name, subject, score) VALUES (@id, @name, @subject, @score);';
       dbRequest.input('id', sql.Int, id);
       dbRequest.input('name', sql.NVarChar, name);
       dbRequest.input('subject', sql.NVarChar, subject);
       dbRequest.input('score', sql.Int, score);
       
       return dbRequest.query(dbQuery)
        .then((result:any) => {
          res.send(result);
          sql.close();
        })
        .catch((err:Error) => {
          console.error('Error executing query:', err.message);
          res.status(500).send('An error occurred.');
          sql.close();
        });
    })
    .catch((err:Error) => {
      console.error('Error connecting to SQL Server:', err.message);
      res.status(500).send('An error occurred.');
    });
 })
            
        
        
app.put('/student/:ids',(req:Request, res:Response) => {

    const {ids} = req.params;
    const filtedData = data.find(v => v.id === parseInt(ids)); 
    const { name, subject, score}:Student = req.body;

    if(!filtedData){
        res.send({
            status:404,
            message:"data not found"
          })
    }
    else {
        const indexData = data.indexOf(filtedData); 
        filtedData.name = name;
        filtedData.score = score;
        filtedData.subject = subject;

        
        res.send({
            message:"updated",
            data:filtedData
        })
    }


    
})
    


app.delete('/student/:id',(req:Request, res:Response) => {

    const {id} = req.params; 
    const filted = data.find(v => v.id == (+id))
    if(!filted){
        res.send({
          status:404,
          message:"data not found"
        })
    }
    else {
        const index = data.indexOf(filted)
        data.splice(index, 1)
        res.send({
            message:"completed",
            data:data
        })
    }
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})