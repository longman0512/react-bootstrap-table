/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import StoreContext from "../context/index";
import cogoToast from 'cogo-toast';
import { useHistory, useParams } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { socketClient } from '../socket';
import Axios from 'axios';

function Signin(props) {
    const { store, setStore } = useContext(StoreContext);
    const history = useHistory();
    const [userEmail, setEmail] = useState("");
    const [userPwd, setPwd] = useState("");

    const signin = () => {
        if(!userEmail){
            cogoToast.success("Please insert your Email", { hideAfter: 3 });
        } else if(!userPwd){
            cogoToast.warn("Please insert your Password", { hideAfter: 3 });
        } else {
            Axios.post('signin', {
                email: userEmail,
                pwd: userPwd
            }).then((res) => {
                console.log(res.data, "singup response data")
                if (res.status === 200) {
                  if(res.data.flag){
                    cogoToast.success(res.data.msg+" Redirecting...", {hideAfter: 2});

                    localStorage.setItem('bootstrap', JSON.stringify({
                        userId: res.data.data.u_id,
                        userEmail: res.data.data.u_email,
                        userAvatar: res.data.data.u_avatar,
                        userComAvatar: res.data.data.u_com_avatar,
                        userName: res.data.data.u_name,
                        userComName: res.data.data.u_company_name
                    }));

                    setTimeout(()=>{
                        window.location="/main"
                    }, 2000)
                  } else {
                    cogoToast.success(res.data.msg);
                  }
                }
                return res;
              }).catch((err) => {
                return err
              });
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                <Paper variant="outlined">
                    <h1>Sign In</h1>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Insert Email"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(d) => { setEmail(d.target.value) }}
                            value = {userEmail}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="password"
                            placeholder="Insert Password"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(d) => { setPwd(d.target.value) }}
                            value = {userPwd}
                        />
                    </InputGroup>
                    <div style={styles.mainBtnContainer}>
                        <div><Button variant="success" size={"sm"} className="action-button" onClick={signin} >Sign In</Button></div>
                        <div><Button variant="primary" size={"sm"} className="action-button" onClick={() => { history.push('/signup') }}>To Signup</Button></div>
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

export default Signin;
