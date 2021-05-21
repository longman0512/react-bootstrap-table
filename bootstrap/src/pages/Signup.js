/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
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
import { signUp } from '../API'

function Signup(props) {
    const history = useHistory();
    const [userEmail, setEmail] = useState("");
    const [userPwd, setPwd] = useState("");
    const [userConfirmPwd, setConfirmPwd] = useState("");
    const [userName, setUserName] = useState("");

    const signup = async () => {
        if(!userName){
            cogoToast.success("Please insert Full Name");
        } else if (!userEmail) {
            cogoToast.success("Please insert User Email")
        } else if (!userPwd || !userConfirmPwd){
            cogoToast.success("Please password")
        } else if(userPwd != userConfirmPwd){
            cogoToast.success("Please insert valid password")
        } else {
            Axios.post('signup', {
                email: userEmail,
                pwd: userPwd,
                name: userName
            }).then((res) => {
                console.log(res.data, "singup response data")
                if (res.status === 200) {
                  if(res.data.flag){
                    cogoToast.success(res.data.msg);
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
                    <h1>Sign Up</h1>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Insert Full Name"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(e)=>{setUserName(e.target.value)}}
                            value={userName}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Insert Email or userName"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(e)=>{setEmail(e.target.value)}}
                            value={userEmail}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">New Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="password"
                            placeholder="New Password"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(e)=>{setPwd(e.target.value)}}
                            value={userPwd}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Confirm Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Confirm Password"
                            type="password"
                            aria-label="Name"
                            aria-describedby="basic-addon1"
                            onChange={(e)=>{setConfirmPwd(e.target.value)}}
                            value={userConfirmPwd}
                        />
                    </InputGroup>
                    <div style={styles.mainBtnContainer}>
                        <div><Button variant="success" size={"sm"} className="action-button" onClick={signup}>Sign Up</Button></div>
                        <div><Button variant="primary" size={"sm"} className="action-button" onClick={() => { history.push('/signin') }}>To Signin</Button></div>
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

export default Signup;
