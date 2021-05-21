
import { Button, Table, Form  } from 'react-bootstrap';
import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AppCom(props) {
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState();
    const [res, setRes] = React.useState("");
    const [endDate, setEnd] = React.useState(new Date());
    const [startDate, setStartDate] = React.useState(new Date());
    const add = ()=>{
        setName("")
        setPrice("")
        setRes('')
        props.openModal(true)
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
                <td></td>
                <td></td>
                <td colSpan={2}><Button variant="success" onClick={add}>Add Product</Button>{' '}</td>
            </tr>
        </tbody>
    </Table>
  );
}

export default AppCom;
