
import { Button, Table, Form  } from 'react-bootstrap';
import React, {useContext} from 'react';
import StoreContext from "../context/index";
import TextField from '@material-ui/core/TextField';
import StaticDateRangePicker from '@material-ui/lab/StaticDateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Box from '@material-ui/core/Box';
import DatePicker from "react-datepicker";

function AppCom(props) {
    const { store, setStore } = useContext(StoreContext);
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState();
    const [res, setRes] = React.useState("");
    const [startDate, setStart] = React.useState(new Date("2000-01-01").toISOString());
    const [endDate, setEnd] = React.useState(new Date().toISOString());

    const [value, setValue] = React.useState([null, null]);
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
    const handleSelect = (d)=>{
        console.log(d)
    }
    const selectionRange = {
        startDate: new Date("01-01-2021"),
        endDate: new Date(),
        key: "selection"
    }

  return (
    <Table>
        <tbody>
            <tr>
                <td>
                    Filter Date
                </td>
                <td></td>
                <td colSpan="2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue)
                            props.filterWithDate(newValue)
                        }}
                        renderInput={(startProps, endProps) => (
                        <React.Fragment>
                            <TextField {...startProps} variant="standard" />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} variant="standard" />
                        </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
                </td>
                <td><Button variant="success" onClick={()=>{console.log("reset"); setValue([null, null]); props.getData()}}>Reset</Button>{' '}</td>
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
