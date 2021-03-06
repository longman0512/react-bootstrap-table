/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import StoreContext from "../context/index";
import React, {useContext, useState} from 'react';
import { removeData } from 'jquery';
import { unstable_useId } from '@material-ui/utils';

function TableCom(props) {
  const { store, setStore } = useContext(StoreContext);
  const [selected, setSeleted] = useState([]);
  const columnStyle =  (cell, row, rowIndex, colIndex) => {
    if(typeof props.modiList!='undefined'){
      var flag = false
      props.modiList.map((modi, index)=>{
        var modiColIndex = null
        
        if(modi.updatedId == row.org_id){
          
          columns.map((col, subindex)=>{

            if(col.dataField == modi.updatedColumn){
              modiColIndex = subindex
            }
          })
          console.log(colIndex, modiColIndex)
          if(colIndex == modiColIndex){
            console.log("flag true")
            flag = true
          }
        }
      })
      if(flag) return { color: 'red', fontWeight: 'bold'}
    }
  }
  const columns = [{
    dataField: 'org_id',
    text: 'DB_ID',
    sort: true,
    editable: (content, row, rowIndex, columnIndex) => false,
  },{
    dataField: 'name',
    text: 'Name',
    sort: true,
    style: columnStyle
  }, {
    dataField: 'price',
    text: 'Price',
    sort: true,
    style: columnStyle,
    validator: (newValue, row, column) => {

      if (isNaN(newValue)) {
        return {
          valid: false,
          message: 'Price should be numeric'
        };
      }
      if (newValue < 0) {
        return {
          valid: false,
          message: 'Price should bigger than 0'
        };
      }
      return true;
    }
  },{
    dataField: 'created_at',
    text: 'Date',
    sort: true,
    editable: (content, row, rowIndex, columnIndex) => false
  },
  {
    dataField: 'action',
    text: 'Action',
    sort: true,
    editable: (content, row, rowIndex, columnIndex) => false
  }];
  
  const rowStyle = (row, rowIndex) => {
    const style = {};
      if(typeof props.modiList!='undefined'){
        props.modiList.map((m, index)=>{
          if (row.org_id == m.updatedId) {
            if(m.type == 'add'){
              style.backgroundColor = 'green';
            } else if(m.type == 'edit'){
              style.backgroundColor = 'yellow';
              
            } else if(m.type == 'delete'){
              style.opacity = 0.3
            }    
          
          }
        })
    }
    return style;
  };
  // const rowEvents = {
  //   onClick: (e, row, rowIndex) => {
  //     // props.readModify(row)
  //   }
  // };  
  return (
    <>
    <BootstrapTable
        keyField='org_id'
        data={ store?.data?store.data:[] } 
        columns={ columns }
        tabIndexCell
        cellEdit={ cellEditFactory({ 
            mode: 'dbclick',
            blurToSave: true,
            onStartEdit: (row, column, rowIndex, columnIndex) => { props.readModify(row) },
            beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
            afterSaveCell: (oldValue, newValue, row, column) => { console.log(oldValue, newValue, row, column); if(oldValue!=newValue)props.edit(row, column.dataField) }
        }) }
        // rowEvents={ rowEvents } 
        rowStyle={rowStyle}
        pagination={ paginationFactory() } 
    />
    </>
  );
}

export default TableCom;
