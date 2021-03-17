/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Button, InputGroup,  FormControl} from 'react-bootstrap';
import StoreContext from "../context/index";
import cogoToast from 'cogo-toast';
import { useHistory, useParams } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { socketClient } from '../socket';

function Update(props) {
  const { store, setStore } = useContext(StoreContext);
  const { updateID } = useParams()
  const history = useHistory();
  const [downloading, setDownloading] = useState(false);
  const [updateObject, setUpdateObject] = useState(store.willUpdateItem)
  const [deletedFlag, setDeletedFlag] = useState(false)
  
  useEffect(()=>{
    setDownloading(true)
    socketClient.emit("getItem", updateID)
    socketClient.off('willUpDateItem');
    socketClient.off('FromAPI');
    socketClient.on("willUpDateItem", getDataById)
    socketClient.on("FromAPI", getUpdatedData)
    console.log(socketClient._callbacks, "callbacks = ===============")
    console.log(store)
  }, [])

  const getUpdatedData = (data, modify) => {
    console.log(data, modify)
    if(typeof modify != "undefined"){
        if(modify.type == 'edit'){
            console.log(modify)
            if(modify.id == updateID){
                cogoToast.success(modify.msg, {hideAfter: 12});
                setDownloading(true)
                socketClient.emit("getItem", updateID)
            }
        } else if(modify.type == 'delete') {
            cogoToast.success(modify.msg, {hideAfter: 12});
            setDeletedFlag(true)
        }
    }
  }
  const getDataById = (data) => {
    if(data.length == 0) {
        setDeletedFlag(true)
        setDownloading(false)
        return false
    }
    setUpdateObject(data[0])
    setStore({
        ...store,
        willUpdateObject: data[0]
    })
    setTimeout(()=>{
        setDownloading(false)
    }, 300)
    
  }

    const updateAll = ()=>{
        var temp = []
        if(store.willUpdateObject.price != updateObject.price) temp.push('price')
        if(store.willUpdateObject.name != updateObject.name) temp.push('name')
        var data = {
            ...updateObject,
            org_id: updateObject.id
        }
        if(temp.length == 0){
            alert("There is no update")
            return false
        }
        socketClient.emit("Edit",{data: data, update_filed: temp})
    }
    
  return (
    <div className="App">
        {
            // downloading?<div style={styles.loadingContainer}><CircularProgress style={{zIndex: 201, color: "white"}}/></div>:null
        }
        <header className="App-header">
            <Paper variant="outlined">
                <h1>Update Product Detail</h1>
                {
                    deletedFlag?<h1 style={{color: 'red'}}>This row is eliminated</h1>:null
                }
                <div style={styles.mainBtnContainer}>
                    <div><Button variant="success" size={"sm"} className="action-button" onClick={updateAll} disabled={deletedFlag}>Save All</Button></div>
                    <div><Button variant="primary" size={"sm"} className="action-button" onClick = {()=>{history.push('/')}}>Back</Button></div>
                </div>
                <div style={styles.mainDataContainer}>
                    <div>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Product Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Name"
                                aria-label="Name"
                                aria-describedby="basic-addon1"
                                value={updateObject?.name}
                                onChange={(d)=>{setUpdateObject({...updateObject, name: d.target.value})}}
                                disabled={deletedFlag}
                            />
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Product Price</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Price"
                                aria-label="Price"
                                aria-describedby="basic-addon1"
                                value={updateObject?.price}
                                onChange={(d)=>{setUpdateObject({...updateObject, price: d.target.value})}}
                                disabled={deletedFlag}
                            />
                            <InputGroup.Append>
                                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>
            </Paper>
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
    mainBtnContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: "flex-end", 
        alignItems: 'center'
    },
    mainDataContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: "space-around", 
        alignItems: 'center', 
        marginTop: 20
    }
}

export default Update;
