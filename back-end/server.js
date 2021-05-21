const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = 4001;
const router = require('./router/router');

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});
app.use(router);
// Ididn't use it now why I don't knwo how to use it I don't know too haha  but you must use multer to upload files to express
//setup server Then Can I send string to express using formdata? yes, you can send form data and recieve it on node.js backend.
// one second
const server = app.listen(PORT, function() {
  console.log("server running: "+PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
}); // socket setup
var connectCounter = 0;

io.on("connection", function(socket) {
  getData(socket)
  connectCounter++
  
  console.log("new connect"+connectCounter)
  socket.on("Delete", function(id) {
    removeData(socket, id)
  });

  socket.on("Add", function(data) {
    addData(socket, data)
  });

  socket.on("Edit", function(data) {
    editData(socket, data)
  });

  socket.on("DelRows", function(data) {
    delRows(socket, data)
  });

  socket.on("FilterDate", function(data) {
    filter(socket, data)
  });

  socket.on("GetDate", function() {
    getData(socket)
  });

  socket.on("getItem", function(id) {
    getItem(socket, id)
  });
  socket.on('disconnect',  function(){
    connectCounter--
    console.log("disconnect"+connectCounter)
  })
});




// mysql connection
const mysql = require('mysql');
const host = 'localhost';
const user = 'root';
const password = '';
const database = 'bootstrap';
const con = mysql.createConnection({
  host, user, password, database,
});
con.connect();


const getItem = (socket, id) => {
  var query1 = "select * from `data` where id = "+id;
  console.log(query1)
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("willUpDateItem", result);
  });
}

const getData = socket => {
  const query1 = "select * from data order by id DESC"
  console.log("return data")
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
  });
};

const addData = async (socket, data) => {
  var query = "INSERT INTO data (name, price, res_name) VALUES ('" + data.name + "', '"+data.price+"', '"+data.res_name+"')";
  var updated = ''
  await con.query(query, async (err, result, fields) => {
    if (err) throw err;
    updated = result.insertId
    query = "INSERT INTO notifications (noti_content) VALUES ('The row "+updated+" has been added!')";
    con.query(query, async (err, result, fields) => {
      if (err) throw err;
      query = "SELECT * from users";
      var notiupdated = result;
      await con.query(query, (err, result, fields) => {
        if (err) throw err;
        result.map(res=>{
          if(data.userId != res.u_id){
            query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`) VALUES ("+notiupdated.insertId+", "+res.u_id+")"
            
            con.query(query);
          } else {
            query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`, `clicked`) VALUES ("+notiupdated.insertId+", "+res.u_id+", 2)"
            con.query(query);
          }
        })
      });
    });
  });
  
  const query1 = "select * from data order by id DESC";

  con.query(query1, async (err, result, fields) => {
    if (err) throw err;
    

    const query2 = "SELECT * FROM notifications ORDER BY noti_id DESC";
    
    con.query(query2, (err, result1, fields)=>{
      console.log(result1)
      socket.broadcast.emit("FromAPI", result, 
      {
        type: 'add',
        updatedId: updated, 
        noti_num: result1,
        msg: 'The row {'+updated+'} has been added!'
      });
      
      socket.emit("FromAPI", result, 
      {
        type: 'FromAPI',
        updatedId: '', 
        noti_num: result1,
        msg: 'The row {'+updated+'} has been added!'
      });


      socket.emit("Noti", result, 
      {
        noti_num: result1
      });

      socket.broadcast.emit("Noti", result, 
      {
        noti_num: result1
      });
    })
  });
};

const removeData = async (socket, data) => {
  console.log(data, '[remove data+++++++++++++++++++++++++++++++++++++++++');
  var origin_data = []
  var query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    origin_data = result
  });

  var query = "DELETE FROM data WHERE id='"+data.id+"'";

  var updated = ''
  await con.query(query, (err, result, fields) => {
      if (err) throw err;
      console.log(result)
  });
  
  query = "INSERT INTO notifications (`noti_content`) VALUES ('The row "+data.id+" has been eliminated!')";
  await con.query(query, async (err, result, fields) => {
    if (err) throw err;
    console.log(result, "deleted result");
    query = "SELECT * from users";
    updated = result;
    await con.query(query, (err, result, fields) => {
      if (err) throw err;
      result.map(res=>{
        if(data.userId != res.u_id){
          query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`) VALUES ("+updated.insertId+", "+res.u_id+")"
          console.log(query);
          con.query(query);
        } else {
          query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`, `clicked`) VALUES ("+updated.insertId+", "+res.u_id+", 2)"
          con.query(query);
        }
      })
    });

  });
  
  query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    // socket.emit("FromAPI", result);
    
    const query2 = "SELECT * FROM notifications ORDER BY noti_id DESC";

    con.query(query2, (err, result1, fields)=>{
      socket.broadcast.emit("FromAPI", result, 
      {
        type: 'delete',
        updatedId: data.id, 
        noti_num: result1,
        msg: 'The row {'+data.id+'} has been eliminated!'
      });
      socket.emit("FromAPI", result,
      {
        type: 'delete',
        updatedId: '',
        noti_num: result1,
        msg: 'The row {'+data.id+'} has been eliminated!'
      });

      // socket.emit("Noti", result, 
      // {
      //   noti_num: result1
      // });

      socket.broadcast.emit("Noti", result, 
      {
        noti_num: result1
      });
    })
  });
};

const editData = async (socket, data) => {
  var updated = ''
  console.log(data)
  var query = "UPDATE data SET name='"+data.data.name+"', price='"+data.data.price+"' WHERE id='"+data.data.org_id+"'";
  await con.query(query, (err, result, fields) => {
      if (err) throw err;
      console.log(result)
  });

  query = "INSERT INTO notifications (noti_content) VALUES ('The row "+data.data.org_id+" has been edited!')";
  await con.query(query, async (err, result, fields) => {
    if (err) throw err;
    query = "SELECT * from users";
    updated = result;
    await con.query(query, async (err, result, fields) => {
      if (err) throw err;
      result.map(res=>{
        if(data.user.userId != res.u_id){
          query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`) VALUES ("+updated.insertId+", "+res.u_id+")"
          console.log(query);
          con.query(query);
        }else {
          query = "INSERT INTO user_notifications (`u_no_id`, `u_u_id`, `clicked`) VALUES ("+updated.insertId+", "+res.u_id+", 2)"
          con.query(query);
        }
      })
    });
  });
  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);

    const query2 = "SELECT * FROM notifications ORDER BY noti_id DESC";
    con.query(query2, (err, result1, fields)=>{
      socket.emit("FromAPI", result, 
      {
        type: 'edit',
        updatedId: '', 
        noti_num: result1,
        msg: 'The row {'+data.data.org_id+'} has been edited!'
      });
      socket.broadcast.emit("FromAPI", result,
      {
        type: 'edit',
        updatedId: data.data.org_id,
        id: data.data.id,
        updatedColumn: data.update_filed,
        noti_num: result1,
        msg: 'The row {'+data.data.org_id+'} has been edited!'
      });

      socket.emit("Noti", result, 
      {
        noti_num: result1
      });

      socket.broadcast.emit("Noti", result, 
      {
        noti_num: result1
      });
    })
    
  });
};

const delRows = async (socket, data) => {
  console.log(data)
  for(var i = 0; i<data.length; i++){
    const query = "DELETE FROM data WHERE id='"+data[i]+"'";
    con.query(query, (err, result, fields) => {
        if (err) throw err;
    });
  }

  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result);
  });
};

const filter = async (socket, data) => {
  const query1 = "select * from `data` where `created_at` >= '"+data[0].toString()+"' and `created_at` <= '"+data[1].toString()+"'  order by id DESC";
  console.log(query1)
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
  });
};
