import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import StoreContext from "../context/index";
import { Button } from 'react-bootstrap';
import React, {useContext, useState} from 'react';
import { removeData } from 'jquery';

function TableCom(props) {
  const { store, setStore } = useContext(StoreContext);
  const [selected, setSeleted] = useState([]);
  const columns = [{
    dataField: 'id',
    text: 'ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true
  }, {
    dataField: 'price',
    text: 'Price',
    sort: true,
    validator: (newValue, row, column) => {
      console.log(newValue, "data")

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
    dataField: 'res_name',
    text: 'Restaurant',
    sort: true
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

  const handleOnSelect = (row, isSelect) => {
    if(typeof row== "undefined") return false
    console.log(row)
    if (isSelect) {
      setSeleted([...selected, row.org_id])
      props.selectCheck([...selected, row.org_id])
    } else {
      setSeleted(selected.filter(x => x !== row.org_id))
      props.selectCheck(selected.filter(x => x !== row.org_id))
    }
  }

  const handleOnSelectAll = (isSelect, rows) => {
    if(typeof rows== "undefined") return false
    const ids = rows.map(r => r.org_id);
    if (isSelect) {
      props.selectCheck(ids)
      setSeleted(ids)
    } else {
      setSeleted(selected.filter(x => x !== row.org_id))
      props.selectCheck(selected.filter(x => x !== row.org_id))
    }
  }

  return (
    <BootstrapTable
        keyField='id'
        data={ store } 
        columns={ columns }
        tabIndexCell
        selectRow={ 
          {
            mode: 'checkbox',
            onSelect: handleOnSelect,
            onSelectAll: handleOnSelectAll
          }
        }
        cellEdit={ cellEditFactory({ 
            mode: 'dbclick',
            blurToSave: true,
            onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
            beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
            afterSaveCell: (oldValue, newValue, row, column) => { props.edit(row) }
        }) }
        pagination={ paginationFactory() } 
    />
  );
}

export default TableCom;
