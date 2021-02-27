import React, {useContext, useEffect, useState} from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import AppCom from './components/AddComponent'
import TableCom from './components/TableComponent'
import io from 'socket.io-client';
import { Button, Modal } from 'react-bootstrap';
import StoreContext from "./context/index";
function App() {
  const ENDPOINT = "http://127.0.0.1:4001";
  const { store, setStore } = useContext(StoreContext);

  const [socketClient, setSocket] = useState("");
  const [show, setShow] = useState(false);
  const [selectedRows, setRows] = useState([]);
  const [removalID, setRemove] = useState(0);
  
  useEffect(() => {
    
    const socket = io("http://127.0.0.1:4001");
    console.log(socket)
    socket.on("FromAPI", data => {
      console.log("Receive data", data)
      let temp = []
      data.map((d, index)=>{
        temp.push({
          id: index+1,
          org_id: d.id,
          name: d.name,
          price: d.price,
          res_name: d.res_name,
          created_at: d.created_at.substring(0, 10),
          action: <Button variant="danger" size={"sm"} onClick={()=>confirmRemove(d.id)}>Delete</Button>
        })
      })
      setStore(temp)
    });
    setSocket(socket)
  }, []);

  const AddtoS = (data)=>{
    console.log(data)
    socketClient.emit("Add", data)
  }

  const EdittoS = (data)=>{
    console.log(data.price, "edit data table")
    socketClient.emit("Edit", data)
  }

  const confirmRemove = (id)=>{
    setRemove(id)
    setShow(true)
  }
  
  const removeDatatoS = ()=>{
    socketClient.emit("Delete", removalID)
    setShow(false)
  }

  const delSelectedRow = () =>{
    console.log("dele rows", selectedRows)
    socketClient.emit("DelRows", selectedRows)
    setRows([])
  }
  return (
    <div className="App">
      {
        show?<div className="Modal-container" onClick={()=>{setShow(false)}} >
        <Modal.Dialog onHide={()=>{setShow(false)}}>
          <Modal.Header>
            <Modal.Title>Are you sure to delete this row?</Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{setShow(false)}}>No</Button>
            <Button variant="danger" onClick={removeDatatoS}>Yes</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>:null
      }
      
      <header className="App-header">
      

        <AppCom addS = {AddtoS} deleteRow = {delSelectedRow} rows = {selectedRows} />
        <TableCom edit={EdittoS} selectCheck={setRows} rows = {selectedRows} />
      </header>
    </div>
  );
}

export default App;
