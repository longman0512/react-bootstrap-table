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


io.on("connection", function(socket) {
  getData(socket)

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

const getData = socket => {
  const query1 = "select * from data order by id DESC"
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
  });
};

const addData = (socket, data) => {
  const query = "INSERT INTO data (name, price, res_name) VALUES ('" + data.name + "', '"+data.price+"', '"+data.res_name+"')";
  con.query(query, (err, result, fields) => {
    if (err) throw err;
  });

  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result);
  });
};

const removeData = (socket, id) => {
  const query = "DELETE FROM data WHERE id='"+id+"'";
  console.log("remove", id)
  con.query(query, (err, result, fields) => {
      if (err) throw err;
  });
  
  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result);
  });
};

const editData = async (socket, data) => {
  console.log(data)
  const query = "UPDATE data SET name='"+data.name+"', price='"+data.price+"', res_name='"+data.res_name+"' WHERE id='"+data.org_id+"'";
  await con.query(query, (err, result, fields) => {
      if (err) throw err;
  });
  
  const query1 = "select * from data order by id DESC";
  con.query(query1, (err, result, fields) => {
    if (err) throw err;
    socket.emit("FromAPI", result);
    socket.broadcast.emit("FromAPI", result);
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
