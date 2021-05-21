/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import AppCom from '../components/AddComponent'
import TableCom from '../components/TableComponent'
import io from 'socket.io-client';
import { Button, Modal as BtModal, Form } from 'react-bootstrap';
import Modal from '@material-ui/core/Modal';
import StoreContext from "../context/index";
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
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
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editProduct, setEditProduct] = useState({});
  const [currentModify, setCurrentModify] = useState({});
  useEffect(()=>{
    if((currentModify.type == 'edit' || currentModify.type=="delete") && currentModify.id == editProduct.id) {
      closeEditModal()
    }
    if(currentModify.type == 'delete' && currentModify.id == removalID) {
      setShow(false);
      setRemove(0);
    }
    
  }, [currentModify])
  useEffect(() => {
    if(!localStorage.getItem('bootstrap')){
      console.log("not signin")
      history.push("/signin")
    } 
    setDownloading(true)
    socketClient.emit("GetDate")
    socketClient.off('FromAPI');
    socketClient.on('FromAPI', getUpdatedData)
  }, [])

  const updateData = (data) => {
    console.log(data);
    setEditProduct(data);
    setEditName(data.name);
    setEditPrice(data.price);
    setEditModal(true);
  }

  const getUpdatedData = (data, modify) => {
    console.log(store)
    // when user get data from server, you have to set downloading flag as true using setDownloading(true)
    setDownloading(true)
    if (typeof data == 'undefined') return false
    let temp = []
    data.map((d, index) => {
      temp.push({
        id: index + 1,
        org_id: d.id,
        name: d.name,
        price: d.price,
        res_name: d.res_name,
        created_at: d.created_at.substring(0, 10),
        action: [
          <Button variant="warning" size={"sm"} className="action-button" onClick={() => { updateData(d) }}>Update</Button>,
          <Button variant="danger" size={"sm"} className="action-button" onClick={() => confirmRemove(d.id)}>Delete</Button>
        ]
      })
    })

    setTempData(temp)
    if (typeof modify != 'undefined') {
      var modi_temp = []
      modi_temp = modiList
      modi_temp.push(modify)
      setModiList([...modiList, modify])
      console.log(modify, editProduct, "edit product data")
      setCurrentModify({
        type: modify.type,
        id: modify.updatedId
      })
      if (modify.type == 'delete') {
        if (modify.type && !modify.updatedId){
          console.log(temp, 'updated user ');
          cogoToast.success(modify.msg, { hideAfter: 12 });
          setTimeout(() => {
            setStore({
              ...store,
              data: temp,
              modified: modify
            })
            
          }, 100)
          var tru_data = []
          setTimeout(() => {
            temp.map((t, index) => {
              if (t.org_id != modify.updatedId) tru_data.push(t)
            })
            setStore({
              ...store,
              data: tru_data,
              modified: modify
            })
          }, 100)
        } else {
          setTimeout(() => {
            setStore({
              ...store,
              data: temp,
              modified: modify
            })
            
          }, 12000)
          var tru_data = []
          setTimeout(() => {
            temp.map((t, index) => {
              if (t.org_id != modify.updatedId) tru_data.push(t)
            })
            setStore({
              ...store,
              data: tru_data,
              modified: modify
            })
          }, 12000)
        }
        
      } else {
        setTimeout(() => {
          setStore({
            ...store,
            data: temp,
            modified: modify
          })
          if (modify.type && !modify.updatedId)
            cogoToast.success(modify.msg, { hideAfter: 12 });
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
    setTimeout(() => {
      setDownloading(false)
    }, 500)
  }

  const AddtoS = (data) => {
    socketClient.emit("Add", data)
  }

  const EdittoS = (data, ttt) => {
    socketClient.emit("Edit", { data: data, update_filed: ttt })
  }

  const confirmRemove = (id) => {
    setRemove(id)
    setShow(true)
  }

  const removeDatatoS = () => {
    const userInfo = JSON.parse(localStorage.getItem('bootstrap'));
    socketClient.emit("Delete", {id: removalID, userId: userInfo.userId})
    setShow(false)
  }

  const filterWithDate = (d) => {
    if (d[0] == d[1]) {
      getData()
    }
    socketClient.emit("FilterDate", [new Date(d[0]), new Date(d[1])])
  }

  const getData = () => {
    socketClient.emit("GetDate")
  }

  const delSelectedRow = () => {
    socketClient.emit("DelRows", selectedRows)
    setRows([])
  }

  useEffect(() => {
    var temp = []
    modiList.map((modi, index) => {
      if (modi.updatedId != readItem?.org_id) {
        temp.push(modi)
      }
    })
    setModiList(temp)
  }, [readItem])
  const readModify = (item) => {
    setReadItem(item)
  }
  const addProduct = ()=> {
    var userInfo = JSON.parse(localStorage.getItem('bootstrap'));

    AddtoS({name: name, price: price, res_name: '', userId: userInfo.userId})
    setName("");
    setPrice("");
    setAddModal(false);
  }
  const closeAddModal = () => {
    setName("");
    setPrice("");
    setAddModal("");
  }
  const closeEditModal = () => {
    setEditName("");
    setEditPrice("");
    setEditModal(false);
  }
  const submitUpdate = () => {
    if(!editName){
      alert("Please insert the Product Name")
    } else if(!editPrice){
      alert("Please insert the Product Price")
    } else if( editName == editProduct.name && editPrice == editProduct.price){

    } else {
      console.log(editProduct, { 
        data: {
          name: editName,
          price: editPrice,
          org_id: editProduct.id,
          id: editProduct.id
        },
        update_filed: {
          price: editProduct.price,
          name: editProduct.name
        } 
      });
      var temp = []
        // if (editProduct.price != editPrice) temp.push('price')
        // if (editProduct.name != editName) temp.push('name')
        closeEditModal();
      var userInfo = JSON.parse(localStorage.getItem('bootstrap'));
      socketClient.emit("Edit", { 
        data: {
          name: editName,
          price: editPrice,
          org_id: editProduct.id,
          id: editProduct.id
        },
        update_filed: temp,
        user: userInfo
      })
    }
  }
  const openEditProduct = (data) => {
    
  }
  return (
    <div className="App">
      {/* this is confirm component when user delete one row */}
      {
        show ? <div className="Modal-container" onClick={() => { setShow(false) }} >
          <BtModal.Dialog onHide={() => { setShow(false) }}>
            <BtModal.Header>
              <BtModal.Title>Are you sure?</BtModal.Title>
            </BtModal.Header>

            <BtModal.Footer>
              <Button variant="secondary" onClick={() => { setShow(false) }}>No</Button>
              <Button variant="danger" onClick={removeDatatoS}>Yes</Button>
            </BtModal.Footer>
          </BtModal.Dialog>
        </div> : null
      }
      {
        // downloading?<div style={styles.loadingContainer}><CircularProgress style={{zIndex: 201, color: "white"}}/></div>:null
      }

      {/* Add products modal start */}
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addModal}
          onClose={() => { setAddModal(false) }}
          closeAfterTransition
        >
          <Fade in={addModal}>
            <div className="Add-edit-modal">
              <AppBar position="static" className="modal-bar">
                <Toolbar className="modal-bar">
                  <Typography variant="h6" noWrap>
                    Please insert product detail
                  </Typography>
                  <div className={styles.grow} />
                  <IconButton aria-label="show 17 new notifications" color="inherit" onClick={() => { setAddModal(false) }}>
                    <CloseIcon style={{ color: "gray" }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <div className="modal-body">
                <Form.Control type="text" className="form-input" value={name} onChange={(t)=>{setName(t.target.value)}} placeholder="Product Name" />
                <Form.Control type="number" className="form-input" value={price} onChange={(t)=>{setPrice(t.target.value)}} placeholder="Product Price" />
              </div>

              <AppBar position="static" className="modal-bottom-bar" color="inherit">
                <Toolbar  className="modal-bottom-bar">
                  <Button variant="contained" style={{background: '#3f51b5',  color: 'white'}}  onClick={()=>{addProduct()}}>Add</Button>
                  <div style={{ flexGrow: 0.03 }}></div>
                  <Button variant="outlined"  style={{background: 'darkgoldenrod'}} onClick={()=>{closeAddModal()}}>Cancel</Button>
                </Toolbar>
              </AppBar>
            </div>
          </Fade>
        </Modal>

      {/* Add products modal end */}

      {/* Edit products modal start */}
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={editModal}
          onClose={() => { setEditModal(false) }}
          closeAfterTransition
        >
          <Fade in={editModal}>
            <div className="Add-edit-modal">
              <AppBar position="static" className="modal-bar">
                <Toolbar className="modal-bar">
                  <Typography variant="h6" noWrap>
                    Edit Product
                  </Typography>
                  <div className={styles.grow} />
                  <IconButton aria-label="show 17 new notifications" color="inherit" onClick={() => { setEditModal(false) }}>
                    <CloseIcon style={{ color: "gray" }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <div className="modal-body">
                <Form.Control type="text" className="form-input" value={editName} onChange={(t)=>{setEditName(t.target.value)}} placeholder="Product Name" />
                <Form.Control type="number" className="form-input" value={editPrice} onChange={(t)=>{setEditPrice(t.target.value)}} placeholder="Product Price" />
              </div>
              <AppBar position="static" className="modal-bottom-bar" color="inherit">
                <Toolbar  className="modal-bottom-bar">
                  <Button variant="contained" style={{background: '#3f51b5',  color: 'white'}}  onClick={()=>{submitUpdate()}}>Edit</Button>
                  <div style={{ flexGrow: 0.03 }}></div>
                  <Button variant="outlined"  style={{background: 'darkgoldenrod'}} onClick={()=>{closeEditModal()}}>Cancel</Button>
                </Toolbar>
              </AppBar>
            </div>
          </Fade>
        </Modal>

      {/* Edit products modal end */}
      <header className="App-header">
        <AppCom openModal={setAddModal} deleteRow={delSelectedRow} filterWithDate={filterWithDate} rows={selectedRows} getData={getData} />
        <TableCom editModal={openEditProduct} edit={EdittoS} selectCheck={setRows} rows={selectedRows} modiList={modiList} readModify={readModify} />
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
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 200,
    minWidth: 200,
    width: '30vh'
  },
  appbar: {
    zIndex: 10,
    width: 200
  },
}

export default Main;
