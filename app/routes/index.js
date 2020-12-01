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
router.post('/listkelas', async (req, res,next) => {
  
  const conn = await connection({ host, user, password, database }).catch(e => {});
  const results = await query(conn, 'SELECT kelas.id_kelas,kelas.id_guru,kelas.pelajaran,kelas.tingkat,guru.nama,guru.email,guru.sekolah,guru.induk FROM kelas INNER JOIN guru ON guru.id_guru=kelas.id_guru ORDER BY kelas.pelajaran ASC').catch(console.log);
  
  
  kategori = [];
  json_kategori = {}
  for(var i=0;i < results.length;i++){
    if(kategori.includes(results[i].tingkat) == false){
      json_kategori[results[i].tingkat] = []
      kategori.push(results[i].tingkat)
      json_kategori[results[i].tingkat].push(results[i])
    }else{
      json_kategori[results[i].tingkat].push(results[i])
    }
  }
  res.json(json_kategori);
})
router.post('/listpertemuan', async (req, res,next) => {
  const id_kelas= req.body.id_kelas;
  const conn = await connection({ host, user, password, database }).catch(e => {});
  const results = await query(conn, "SELECT pertemuan.id_pertemuan,pertemuan.id_kelas,pertemuan.urutan,pertemuan.link_daring,pertemuan.materi,pertemuan.link_materi,guru.nama,guru.email,guru.sekolah,guru.induk,kelas.id_guru,kelas.pelajaran,kelas.tingkat FROM pertemuan INNER JOIN kelas ON kelas.id_kelas=pertemuan.id_kelas INNER JOIN guru ON guru.id_guru=kelas.id_guru WHERE kelas.id_kelas='"+id_kelas+"'").catch(console.log);
  
  
  
  res.json(results);
})

router.post('/search', async (req, res,next) => {
  const querys= req.body.query;
  const conn = await connection({ host, user, password, database }).catch(e => {});
  const results = await query(conn, "SELECT pertemuan.id_pertemuan,pertemuan.id_kelas,pertemuan.urutan,pertemuan.link_daring,pertemuan.materi,pertemuan.link_materi,guru.nama,guru.email,guru.sekolah,guru.induk,kelas.id_guru,kelas.pelajaran,kelas.tingkat FROM pertemuan INNER JOIN kelas ON kelas.id_kelas=pertemuan.id_kelas INNER JOIN guru ON guru.id_guru=kelas.id_guru WHERE kelas.pelajaran LIKE '%"+querys+"%' OR pertemuan.materi LIKE '%"+querys+"%'").catch(console.log);
  
  
  
  res.json(results);
})
    
module.exports = router;
