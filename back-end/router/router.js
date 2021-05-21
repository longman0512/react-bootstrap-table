const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
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

var upload = multer(); // for parsing multipart/form-data

router.post('/deleteAvatar', upload.array(), async function(req, res) {
    var target = req.body.target;
    var userInfo = req.body.user;
    var imageFolder = "upload/user"+userInfo.userId+userInfo.userName+"/imageFiles";
    imageFolder += "/"+target+".png";

    var query = "";
    await fs.unlink(imageFolder, function (err ){
      if(err){
        console.log(err)
      }
    })
    if(target == "Company"){
      query = "UPDATE `users` SET `u_com_avatar`='' WHERE `u_id` = '"+userInfo.userId+"'";
    } else {
      query = "UPDATE `users` SET `u_avatar`='' WHERE `u_id` = '"+userInfo.userId+"'";
    }
    
    await con.query(query, (err, result) => {
      if(err) throw err;
      res.json({
        flag: true,
        data: "",
        msg: "Image is removed"
      })
      res.send();
    });
});
router.post('/uploadavatar', upload.array(), async function(req, res) {
  var base64Data = req.body.image;
    var target = req.body.target;
    var userInfo = req.body.user;
    console.log(base64Data, target, userInfo);
    let base64Image = base64Data.split(';base64,').pop();
    var imageFolder = "upload/user"+userInfo.userId+userInfo.userName+"/imageFiles";
    
    await fs.mkdir("upload", function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created.")
      }
    })

    await fs.mkdir("upload/user"+userInfo.userId+userInfo.userName, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created.")
      }
    })

    await fs.mkdir(imageFolder, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created.")
      }
    })
    var fileName = new Date();
    fileName = fileName.getTime();
    await fs.writeFile(imageFolder+"/"+fileName+".png", base64Image, 'base64', function(err) {
        if (err) console.log(err);
    });
    var query = "";
    if(target == "Company"){
      query = "UPDATE `users` SET `u_com_avatar`='"+imageFolder+"/"+fileName+".png' WHERE `u_id` = '"+userInfo.userId+"'";
    } else {
      query = "UPDATE `users` SET `u_avatar`='"+imageFolder+"/"+fileName+".png' WHERE `u_id` = '"+userInfo.userId+"'";
    }
    
    await con.query(query, (err, result) => {
      if(err) throw err;
      res.json({
        flag: true,
        data: "",
        msg: "Company Logo is Uploaded"
      })
      res.send();
    });
});

router.post("/getUserInfoById",  async (req, res) => {
  const query1 = "select * from users where u_email = '" + req.body.user.userEmail + "'";

  await con.query(query1, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      res.json({
        flag: true,
        data: result[0],
      })
      res.send();
    } else {
      res.json({
        flag: false,
        data: [],
      })
      res.send();
    }
  });
});
// ================user sign up api
router.post("/signup", async (req, res) => {
  var userEmail = req.body.email;
  var userPwd = req.body.pwd;
  var userName = req.body.name;
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
        msg: "Email or UserName Already Exist!"
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
              const query1 = "INSERT INTO `users` (`u_name`, `u_email`, `u_pwd`) VALUES ('"+userName+"', '" + userEmail + "', '" + hash + "'); ";
              con.query(query1, (err, result, fields) => {
                if (err) throw err;
                res.json({
                  flag: true,
                  data: {
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
  var userEmail = req.body.email;
  var userPwd = req.body.pwd;
  console.log(req.body);
  const query1 = "select * from users where u_email = '" + userEmail + "'";
  res.setHeader('Content-Type', 'text/html');
  await con.query(query1, (err, result, fields) => {
    if (err) throw err;
    if (result.length) {
      bcrypt.compare(userPwd, result[0].u_pwd, function(err, isMatch) {
        if (err) {
          throw err
        } else if (!isMatch) {
          res.json({
            flag: false,
            data: "",
            msg: "Email or Password is incorrect!"
          })
          res.send();
        } else {
          res.json({
            flag: true,
            data: result[0],
            msg: "Login Success!"
          });
          res.send();
        }
      })
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



router.post("/getNoti",  async (req, res) => {
  // const query2 = "SELECT * FROM notifications ORDER BY noti_id DESC LIMIT 15 OFFSET "+req.body.pageNum * 15;
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

router.post("/getNewNoti",  async (req, res) => {
  console.log(req.body);
  const query2 = "SELECT * FROM user_notifications WHERE u_u_id = "+req.body.user.userId;
  console.log(query2);
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


router.post("/readNoti",  async (req, res) => {
  console.log(req.body);
  const { userId, noti_id } = req.body;
  const query2 = "DELETE FROM `user_notifications` WHERE u_u_id = "+userId+" AND u_no_id ="+noti_id;

  // const query2 = "DELETE FROM user_notifications WHERE u_u_id = "+userId+" AND ";
  console.log(query2);
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

router.post("/openNoti",  async (req, res) => {
  console.log(req.body);
  const { userId } = req.body;
  const query2 = "UPDATE `user_notifications` SET `clicked` = '1' WHERE clicked = 0 AND u_u_id = "+userId;

  // const query2 = "DELETE FROM user_notifications WHERE u_u_id = "+userId+" AND ";
  console.log(query2);
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