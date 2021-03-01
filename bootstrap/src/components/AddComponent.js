
import { Button, Table, Form  } from 'react-bootstrap';
import React, {useContext} from 'react';
import StoreContext from "../context/index";
import TextField from '@material-ui/core/TextField';
import StaticDateRangePicker from '@material-ui/lab/StaticDateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Box from '@material-ui/core/Box';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AppCom(props) {
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState();
    const [res, setRes] = React.useState("");
    const [endDate, setEnd] = React.useState(new Date());
    const [startDate, setStartDate] = React.useState(new Date());
    const add = ()=>{
        if(!name){
            alert("Please insert a name")
            return false
        }
        if(!price || price < 0){
            alert("Please insert correct price")
            return false
        }
        if(!res){
            alert("Please insert a restaurant name")
            return false
        }
        setName("")
        setPrice("")
        setRes('')
        props.addS({name: name, price: price, res_name: res})
        
    }

  return (
    <Table>
        <tbody>
            <tr>
            <td></td>
            <td>From Date</td>
            <td>To Date</td>
            <td></td>
            </tr>
            <tr>
                <td>
                    Filter Date
                </td>
                <td>
                    <DatePicker selected={startDate} onChange={date => {setStartDate(date);  props.filterWithDate([date, endDate])}} />
                </td>
                <td>
                    <DatePicker selected={endDate} onChange={date => {setEnd(date);  props.filterWithDate([startDate, date]);} } />
                </td>
                <td><Button variant="primary" onClick={()=>{console.log("reset");setEnd(new Date()); setStartDate(new Date()); props.getData()}}>Reset</Button>{' '}</td>
            </tr>
            <tr>
                <td><Form.Control type="text" value={name} onChange={(t)=>{setName(t.target.value)}} placeholder="Product Name" /></td>
                <td><Form.Control type="number" value={price} onChange={(t)=>{setPrice(t.target.value)}} placeholder="Product Price" /></td>
                <td><Form.Control type="text" value={res} onChange={(t)=>{setRes(t.target.value)}} placeholder="Restaurant Name" /></td>
                <td><Button variant="success" onClick={add}>Add</Button>{' '}</td>
                {
                    props?.rows?.length?<td><Button variant="success" onClick={props.deleteRow}>Deleted</Button>{' '}</td>:null
                }
            
            </tr>
        </tbody>
    </Table>
  );
}

export default AppCom;
