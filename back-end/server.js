const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { getHeapCodeStatistics } = require("v8");
const app = express();
const PORT = 4001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//setup server
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
  const query = "INSERT INTO data (name, price, res_name) VALUES ('" + data.name + "', '"+data.price+"', '"+data.res_name+"')";
  var updated = ''
  await con.query(query, (err, result, fields) => {
    if (err) throw err;
    updated = result.insertId
  });
  
  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result, 
    {
      type: 'add',
      updatedId: updated, 
      msg: 'The row {'+updated+'} has been added!'
    });
  });
};

const removeData = async (socket, id) => {
  var origin_data = []
  var query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    origin_data = result
  });

  const query = "DELETE FROM data WHERE id='"+id+"'";
  var updated = ''
  await con.query(query, (err, result, fields) => {
      if (err) throw err;
      console.log(result)
  });
  
  query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", origin_data,
    {
      type: 'delete',
      updatedId: id, 
      msg: 'The row {'+id+'} has been eliminated!'
    });
  });
};

const editData = async (socket, data) => {
  var updated = ''
  console.log(data)
  const query = "UPDATE data SET name='"+data.data.name+"', price='"+data.data.price+"', res_name='"+data.data.res_name+"' WHERE id='"+data.data.org_id+"'";
  await con.query(query, (err, result, fields) => {
      if (err) throw err;
      console.log(result)
  });
  
  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result,
    {
      type: 'edit',
      updatedId: data.data.org_id,
      id: data.data.id,
      updatedColumn: data.update_filed,
      msg: 'The row {'+data.data.org_id+'} has been edited!'
    });
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
