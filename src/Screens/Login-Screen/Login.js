import React from 'react';
import { useState, useEffect} from 'react';
import {CustomButton} from '../../UI_Elements/CustomButton/CustomButton';
import './Login.css';
import {Input} from '../../UI_Elements/Input/Inputs';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import {conn_path} from '../../host_config'

export function Login({navigation}) {
    const[username, setName] = useState("");
    const[password, setPassword] = useState("");

    axios.defaults.withCredentials = true;

    // check if session already exists
    useEffect(() => {
        axios.get('/session')
        .then(res => {
            if (res.data.valid === true) {
                navigation.navigate('Feed');
            } else {
                console.log(res.data);
            }
        })
        .catch(err => console.log(err))
    }, []);

    // send data to server. If the user exists in DB then success response is sent.
    const login = () => {
        
        // check if any user of pass are empty
        if (username === "" || password === "")
            return

        axios.post(conn_path + "/HandleUser/login", { 
            username: username,
            password: password
        }).then((response) =>{
            console.log(response.data);
            // if response from server is "succuess" navigate to feed
            if (response.data.login === true) {
                navigation.navigate('Feed');
                console.log(response.data);
            } else {
                toast.error('There was a problem logging in. Please check credentials.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        });
    }

    return (
        <div className='login-screen-container'>
            <div className="login-container">

                <div className='title-container'>
                    <h1>Log in</h1>
                </div>

                <div className='info-container'>
                    <div className='text-area'>
                        <Input 
                            name={'User Name'} 
                            type={'text'} 
                            onChange={(e) => setName(e.target.value)}>
                        </Input>
                    </div>

                    <div className='text-area'>
                        <Input 
                            name={'Password'} 
                            type={'password'}
                            onChange={(e) => setPassword(e.target.value)}>
                        </Input>
                    </div>
                </div>

                <div className='login-button'>
                    <CustomButton 
                        title='Log in'
                        onPress={() => login()}
                    />
                </div>

                <div className='create-account-button'>
                    <CustomButton 
                        title='No account? Create One!'
                        onPress={() => navigation.navigate('CreateAccount')}
                    />
                </div>

            </div>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
