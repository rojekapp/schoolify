var express = require('express');
var router = express.Router();
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const dbConfig = require('../dbConfig');
const {auth} = require('../middleware')
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var multer  = require('multer');
var fs = require('fs-extra');
var md5 = require('md5')
// get config vars
dotenv.config();

// access config var
const host = process.env.MYSQL_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.MYSQL_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.MYSQL_PASS || '';

// Get the Database from Environment or use default
let database = process.env.MYSQL_DB || 'schoolify';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
  
    fs.mkdirsSync('./public/uploads/menu');
      cb(null, './public/uploads/menu');
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
  }
});
let upload = multer({
  storage: storage
});
// list tenant
router.post('/login',async (req,res)=>{
  var email = req.body.email;
  var passwords = md5(req.body.password);
  const conn = await connection({ host, user, password, database }).catch(e => {});
  const beb = await query(conn,"SELECT nama,email,sekolah,induk,id_murid FROM murid WHERE email='"+email+"' AND password='"+passwords+"'").then(response=>{
    if(response.length == 0){
      
      
      res.send("Login failed")
    }else{
      res.json(response[0])
    }
  }).catch()
})

router.post('/register',  async (req, res) => {
  const nama  = req.body.nama;
   const email = req.body.email;
   const passwords =  md5(req.body.password);
   const sekolah = req.body.sekolah;
   const induk = req.body.induk;
 
 const conn = await connection({ host, user, password, database}).catch(e => {});
 const beb = await query(conn,"SELECT * FROM murid WHERE email='"+email+"'").then(response=>{
  if(response.length == 0){
    async function insert(){
      const op = await query(conn,"INSERT INTO murid (nama,email,password,sekolah,induk) VALUES ('"+nama+"','"+email+"','"+passwords+"','"+sekolah+"','"+induk+"')").catch(console.log);
      res.send("Register successfull")
    }
      insert()
  
    
    
  }else{
    res.send("Username not unique")
  }
 });
       
  res.send("success")
  
 });
//search tenant
router.post('/update', async (req,res)=>{
  const id_murid = req.body.id_murid;
  const passwords = req.body.password;
  const sekolah = req.body.sekolah;
  const induk = req.body.induk;
  const conn = await connection({ host, user, password, database}).catch(e => {});
  if(passwords != '' && passwords != undefined){
    const beb = await query(conn,"UPDATE murid SET password='"+passwords+"' WHERE id_murid='"+id_murid+"'")
  }
  if(sekolah != '' && sekolah != undefined){
    const beb = await query(conn,"UPDATE murid SET sekolah='"+sekolah+"' WHERE id_murid='"+id_murid+"'")
  }
  if(induk != '' && induk != undefined){
    const beb = await query(conn,"UPDATE murid SET induk='"+induk+"' WHERE id_murid='"+id_murid+"'")
  }
  res.send("update "+id_murid+" succeed")
})

router.post('/delete', async (req,res)=>{
  
  const id_murid = req.body.id_murid;
  const conn = await connection({ host, user, password, database}).catch(e => {});
    const beb = await query(conn,"DELETE FROM murid WHERE id_murid='"+id_murid+"'")
 
  res.send("delete "+id_murid+" succeed")
})

    
module.exports = router;
