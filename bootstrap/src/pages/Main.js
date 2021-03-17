/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import AppCom from '../components/AddComponent'
import TableCom from '../components/TableComponent'
import io from 'socket.io-client';
import { Button, Modal } from 'react-bootstrap';
import StoreContext from "../context/index";
import CircularProgress from '@material-ui/core/CircularProgress';
import cogoToast from 'cogo-toast';
import { useHistory } from "react-router-dom";
import { socketClient } from '../socket';

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
  
  useEffect(()=>{
    setDownloading(true)
    socketClient.emit("GetDate")
    socketClient.off('FromAPI');
    socketClient.on('FromAPI', getUpdatedData)
  }, [])

  const updateData = (data) => {
    setStore({
      ...store,
      willUpdateItem: data
    })
    history.push('/update/'+data.id);
  }

  const getUpdatedData = (data, modify)=>{
    console.log(store)
    // when user get data from server, you have to set downloading flag as true using setDownloading(true)
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

    setTempData(temp)
    if(typeof modify != 'undefined'){
      var modi_temp = []
      modi_temp = modiList
      modi_temp.push(modify)
      setModiList([...modiList, modify])

      if(modify.type == 'delete'){
        setTimeout(()=>{
          setStore({
              ...store,
              data: temp,
              modified: modify
          })
          if(modify.type)
          cogoToast.success(modify.msg, {hideAfter: 12});
        }, 500)
        var tru_data = []
        setTimeout(()=>{
          temp.map((t, index)=>{
            if(t.org_id != modify.updatedId) tru_data.push(t)
          })
          setStore({
            ...store,
              data: tru_data,
              modified: modify
          })
        }, 12000)
      } else {
        setTimeout(()=>{
          setStore({
            ...store,
              data: temp,
              modified: modify
          })
          if(modify.type)
          cogoToast.success(modify.msg, {hideAfter: 12});
        }, 500)
      }
    } else {
      setStore({
        ...store,
          data: temp,
          modified: store.modified
      })
    }

    // when the all data are download, you have to set the downloading flag as false to disappear the lazy loading layer using setDownloading(false)
    setTimeout(()=>{
      setDownloading(false)
    }, 500)
  }
  
  const AddtoS = (data)=>{
    socketClient.emit("Add", data)
  }

  const EdittoS = (data, ttt)=>{
    socketClient.emit("Edit",{data: data, update_filed: ttt})
  }

  const confirmRemove = (id)=>{
    setRemove(id)
    setShow(true)
  }
  
  const removeDatatoS = ()=>{
    socketClient.emit("Delete", removalID)
    setShow(false)
  }

  const filterWithDate = (d)=>{
    if(d[0] == d[1]){
      getData()
    }
    socketClient.emit("FilterDate", [new Date(d[0]), new Date(d[1])])
  }

  const getData = ()=>{
    socketClient.emit("GetDate")
  }
  
  const delSelectedRow = () =>{
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
  }
  return (
    <div className="App">
      {/* this is confirm component when user delete one row */}
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
          // downloading?<div style={styles.loadingContainer}><CircularProgress style={{zIndex: 201, color: "white"}}/></div>:null
      }
      <header className="App-header">
        <AppCom addS = {AddtoS} deleteRow = {delSelectedRow} filterWithDate={filterWithDate} rows = {selectedRows} getData= {getData} />
        <TableCom edit={EdittoS} selectCheck={setRows} rows = {selectedRows} modiList = {modiList} readModify= {readModify}/>
      </header>
    </div>
  );
}

const styles = {
  loadingContainer: {
      position: 'fixed', 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      zIndex: 200
  }
}

export default Main;
