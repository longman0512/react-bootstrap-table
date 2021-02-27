
import { Button, Table, Form  } from 'react-bootstrap';
import React, {useContext} from 'react';
import StoreContext from "../context/index";

function AppCom(props) {
    const { store, setStore } = useContext(StoreContext);
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState();
    const [res, setRes] = React.useState("");
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
