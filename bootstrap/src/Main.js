/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
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
import CircularProgress from '@material-ui/core/CircularProgress';
import cogoToast from 'cogo-toast';
import { useHistory } from "react-router-dom";
import { socketClient } from './socket';

function Main() {
  const { store, setStore } = useContext(StoreContext);
  const history = useHistory();
  
  const [show, setShow] = useState(false);
  const [selectedRows, setRows] = useState([]);
  const [removalID, setRemove] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [modiList, setModiList] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [readItem, setReadItem] = useState([]);
  
  // const socket = io("http://127.0.0.1:4001");
  useEffect(()=>{
    setDownloading(true)
    console.log("connect socket")
    // setSocket()
    socketClient.emit("GetDate")
    socketClient.off('FromAPI');
    socketClient.on('FromAPI', getUpdatedData)
  }, [])
  
  useEffect(()=>{
    return () => {
      // socketClient.disconnect()
        // Anything in here is fired on component unmount.
    }
  }, [])  

  const getUpdatedData = (data, modify)=>{
    setDownloading(true)
    if(typeof data == 'undefined') return false
    let temp = []
    data.map((d, index)=>{
      temp.push({
        id: index+1,
        org_id: d.id,
        name: d.name,
        price: d.price,
        res_name: d.res_name,
        created_at: d.created_at.substring(0, 10),
        action: [
          <Button variant="warning" size={"sm"} className="action-button" onClick={()=>{updateData(d)}}>Update</Button>,
          <Button variant="danger" size={"sm"} className="action-button" onClick={()=>confirmRemove(d.id)}>Delete</Button>
      ]
      })
    })
    const updateData = (data) => {
      setStore({
        ...store,
        willUpdateItem: data
      })
      history.push('/update/'+data.id);
    }
    setTempData(temp)
    if(typeof modify != 'undefined'){
      var modi_temp = []
      modi_temp = modiList
      modi_temp.push(modify)
      setModiList([...modiList, modify])

      if(modify.type == 'delete'){
        setTimeout(()=>{
          setStore({
              data: temp,
              modified: modify
          })
          cogoToast.success(modify.msg, {hideAfter: 12});
        }, 500)
        var tru_data = []
        setTimeout(()=>{
          temp.map((t, index)=>{
            if(t.org_id != modify.updatedId) tru_data.push(t)
          })
          setStore({
              data: tru_data,
              modified: modify
          })
        }, 12000)
      } else {
        setTimeout(()=>{
          setStore({
              data: temp,
              modified: modify
          })
          cogoToast.success(modify.msg, {hideAfter: 12});
        }, 500)
      }
    } else {
      setStore({
          data: temp,
          modified: store.modified
      })
    }
    setTimeout(()=>{
      setDownloading(false)
    }, 500)
  }
  
  const AddtoS = (data)=>{
    // console.log(data)
    // emitEvent("Add", data)
    socketClient.emit("Add", data)
  }

  const EdittoS = (data, ttt)=>{
    // console.log({data: data, update_filed: ttt}, "edit data table")
    // emitEvent("Edit", {data: data, update_filed: ttt})
    socketClient.emit("Edit",{data: data, update_filed: ttt})
  }

  const confirmRemove = (id)=>{
    setRemove(id)
    setShow(true)
  }
  
  const removeDatatoS = ()=>{
    // emitEvent("Delete", removalID)
    socketClient.emit("Delete", removalID)
    setShow(false)
  }

  const filterWithDate = (d)=>{
    if(d[0] == d[1]){
      getData()
    }
    // emitEvent("FilterDate", [new Date(d[0]), new Date(d[1])])
    socketClient.emit("FilterDate", [new Date(d[0]), new Date(d[1])])
  }

  const getData = ()=>{
    socketClient.emit("GetDate")
  }
  
  const delSelectedRow = () =>{
    // // console.log("dele rows", selectedRows)
    // emitEvent("DelRows", selectedRows)
    socketClient.emit("DelRows", selectedRows)
    setRows([])
  }
  
  useEffect(()=>{
    var temp = []
    modiList.map((modi, index)=>{
      if(modi.updatedId != readItem?.org_id){
        temp.push(modi)
      }
    })
    setModiList(temp)
  }, [readItem])
  const readModify = (item) =>  {
    setReadItem(item)
    // var temp = []
    // modiList.map((modi, index)=>{
    //   // console.log(modi.updatedId, item.org_id)
    //   if(modi.updatedId != item.org_id){
    //     temp.push(modi)
    //   }
    // })
    // setModiList(temp)
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
        {
            downloading?<div style={{position: 'fixed', width: '100vw', height: '100vh', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 200}}><CircularProgress style={{zIndex: 201, color: "white"}}/></div>:null
        }
      <header className="App-header">
        <AppCom addS = {AddtoS} deleteRow = {delSelectedRow} filterWithDate={filterWithDate} rows = {selectedRows} getData= {getData} />
        <TableCom edit={EdittoS} selectCheck={setRows} rows = {selectedRows} modiList = {modiList} readModify= {readModify}/>
      </header>
    </div>
  );
}

export default Main;
