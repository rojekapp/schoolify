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
  const beb = await query(conn,"SELECT nama,email,sekolah,induk,id_guru FROM guru WHERE email='"+email+"' AND password='"+passwords+"'").then(response=>{
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
 const beb = await query(conn,"SELECT * FROM guru WHERE email='"+email+"'").then(response=>{
  if(response.length == 0){
    async function insert(){
      const op = await query(conn,"INSERT INTO guru (nama,email,password,sekolah,induk) VALUES ('"+nama+"','"+email+"','"+passwords+"','"+sekolah+"','"+induk+"')").catch(console.log);
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
  const id_guru = req.body.id_guru;
  const passwords = req.body.password;
  const sekolah = req.body.sekolah;
  const induk = req.body.induk;
  const conn = await connection({ host, user, password, database}).catch(e => {});
  if(passwords != '' && passwords != undefined){
    const beb = await query(conn,"UPDATE guru SET password='"+passwords+"' WHERE id_guru='"+id_guru+"'")
  }
  if(sekolah != '' && sekolah != undefined){
    const beb = await query(conn,"UPDATE guru SET sekolah='"+sekolah+"' WHERE id_guru='"+id_guru+"'")
  }
  if(induk != '' && induk != undefined){
    const beb = await query(conn,"UPDATE guru SET induk='"+induk+"' WHERE id_guru='"+id_guru+"'")
  }
  res.send("update "+id_guru+" succeed")
})

router.post('/delete', async (req,res)=>{
  
  const id_guru = req.body.id_guru;
  const conn = await connection({ host, user, password, database}).catch(e => {});
    const beb = await query(conn,"DELETE FROM guru WHERE id_guru='"+id_guru+"'")
 
  res.send("delete "+id_guru+" succeed")
})

router.post('/addkelas',  async (req, res) => {
  const pelajaran  = req.body.pelajaran;
   const tingkat = req.body.tingkat;
   const id_guru = req.body.id_guru;
   
 
 const conn = await connection({ host, user, password, database}).catch(e => {});

      const op = await query(conn,"INSERT INTO kelas (id_guru,pelajaran,tingkat) VALUES ('"+id_guru+"','"+pelajaran+"','"+tingkat+"')").catch(console.log);
      res.send("Register successfull")
    

 });
 router.post('/updatekelas', async (req,res)=>{
  const id_kelas = req.body.id_kelas;
  const id_guru = req.body.id_guru;
  const tingkat = req.body.tingkat;
  const conn = await connection({ host, user, password, database}).catch(e => {});
  if(id_guru != '' && id_guru != undefined){
    const beb = await query(conn,"UPDATE kelas SET id_guru='"+id_guru+"' WHERE id_kelas='"+id_kelas+"'")
  }
  if(tingkat != '' && tingkat != undefined){
    const beb = await query(conn,"UPDATE kelas SET tingkat='"+tingkat+"' WHERE id_kelas='"+id_kelas+"'")
  }
 
  res.send("update "+id_kelas+" succeed")
})
router.post('/deletekelas', async (req,res)=>{
  
  const id_kelas = req.body.id_kelas;
  const conn = await connection({ host, user, password, database}).catch(e => {});
    const beb = await query(conn,"DELETE FROM kelas WHERE id_kelas='"+id_kelas+"'")
 
  res.send("delete "+id_kelas+" succeed")
})
router.post('/addpertemuan',  async (req, res) => {
  const urutan  = req.body.urutan;
   const link_daring = req.body.link_daring;
   const materi = req.body.materi;
   const link_materi = req.body.link_materi;
   const id_kelas = req.body.id_kelas;
 const conn = await connection({ host, user, password, database}).catch(e => {});

      const op = await query(conn,"INSERT INTO pertemuan (urutan,link_daring,materi,link_materi,id_kelas) VALUES ('"+urutan+"','"+link_daring+"','"+materi+"','"+link_materi+"','"+id_kelas+"')").catch(console.log);
      res.send("Register successfull")
    

 });
 router.post('/updatepertemuan', async (req,res)=>{
  const id_pertemuan = req.body.id_pertemuan;
  const link_daring = req.body.link_daring;
  const materi = req.body.materi;
  const link_materi = req.body.link_materi;
  const conn = await connection({ host, user, password, database}).catch(e => {});
  if(link_daring != '' && link_daring != undefined){
    const beb = await query(conn,"UPDATE pertemuan SET link_daring='"+link_daring+"' WHERE id_pertemuan='"+id_pertemuan+"'")
  }
  if(materi != '' && materi != undefined){
    const beb = await query(conn,"UPDATE pertemuan SET materi='"+materi+"' WHERE id_pertemuan='"+id_pertemuan+"'")
  } 
  if(link_materi != '' && link_materi != undefined){
    const beb = await query(conn,"UPDATE pertemuan SET link_materi='"+link_materi+"' WHERE id_pertemuan='"+id_pertemuan+"'")
  }
 
 
  res.send("update "+id_pertemuan+" succeed")
})
router.post('/deletepertemuan', async (req,res)=>{
  
  const id_pertemuan = req.body.id_pertemuan;
  const conn = await connection({ host, user, password, database}).catch(e => {});
    const beb = await query(conn,"DELETE FROM pertemuan WHERE id_pertemuan='"+id_pertemuan+"'")
 
  res.send("delete "+id_pertemuan+" succeed")
})
module.exports = router;
