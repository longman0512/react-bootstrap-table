const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// mysql connection

const mysql = require('mysql');
const host = 'localhost';
const user = 'root';
const password = '';
const database = 'bootstrap';
const con = mysql.createConnection({
  host,
  user,
  password,
  database,
});
con.connect();
const saltRounds = 10

// ================user sign up api
router.post("/signup", async (req, res) => {
  var userEmail = req.body.userEmail;
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var userType = req.body.userType;
  console.log(req.body)
  const query1 = "select * from users where u_email = '" + userEmail + "'";

  console.log("userSign up")
  var flag = false
  res.setHeader('Content-Type', 'text/html');
  await con.query(query1, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      flag = true
      res.json({
        flag: false,
        data: "",
        msg: "Email Already Exist!"
      })
      res.send();
      
    } else {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          throw err
        } else {
          bcrypt.hash(userPwd, salt, function (err, hash) {
            if (err) {
              throw err
            } else {
              //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
              const query1 = "INSERT INTO `users` (`u_name`, `u_email`, `u_pwd`, `u_type`) VALUES ('" + userName + "', '" + userEmail + "', '" + hash + "', '"+userType+"'); ";
              con.query(query1, (err, result, fields) => {
                if (err) throw err;
                res.json({
                  flag: true,
                  data: {
                    userName: userName,
                    userEmail: userEmail,
                    token: hash
                  },
                  msg: "Contratulation! Sign Up is Success"
                })
                res.send();
              });
            }
          })
        }
      })
    }
  });
});

router.post("/signin", async (req, res) => {
  var userEmail = req.body.user_email;
  const query1 = "select * from users where u_email = '" + userEmail + "'";
  console.log(query1)
  await con.query(query1, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      res.json({
        flag: true,
        data: result[0],
        msg: "Login Success!"
      })
      res.send();
    } else {
      res.json({
        flag: false,
        data: "",
        msg: "Email or Password is incorrect!"
      })
      res.send();
    }
  });
});

const multer = require('multer')
var upload = multer({ dest: 'uploads/' })

// const upload = multer({ storage })

router.post("/upload", upload.single('target'), async (req, res) => {
  console.log(req)
  res.json({
    flag: false,
    data: "",
    msg: "Email or Password is incorrect!"
  })
  res.send();
});

router.post("/getNoti",  async (req, res) => {
  const query2 = "SELECT * FROM notifications ORDER BY noti_id DESC";

  await con.query(query2, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      res.json({
        flag: true,
        data: result,
        msg: "Get Data of Noti"
      })
      res.send();
    } else {
      res.json({
        flag: false,
        data: [],
        msg: "Get Data of Noti"
      })
      res.send();
    }
  });
});

router.post("/clickNoti",  async (req, res) => {
  const query2 = "SELECT * FROM notifications";

  await con.query(query2, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      res.json({
        flag: true,
        data: result,
        msg: "Get Data of Noti"
      })
      res.send();
    } else {
      res.json({
        flag: false,
        data: [],
        msg: "Get Data of Noti"
      })
      res.send();
    }
  });
});

module.exports = router;