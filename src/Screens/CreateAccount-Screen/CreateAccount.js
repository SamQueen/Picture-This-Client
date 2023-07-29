import React, { useState } from 'react';
import './CreateAccount.css';
import { CustomButton } from '../../UI_Elements/CustomButton/CustomButton';
import {Input} from '../../UI_Elements/Input/Inputs'
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {conn_path} from '../../host_config'

export function CreateAccount({navigation}) {

    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');
    const [hometown, setHometown] = useState('');

    // send data to server to add user to database
    const createUserAccount = () => {
        console.log("adding user!")
        
        // ensure that passwords are the same
        if (password != confirmPassword) {
            
            toast.error('Passwords do not match', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.log(password)
            console.log(confirmPassword)
            return;
        }

        // check if any fields are empty
        if (gender == "" | username == "" | firstName == '' | lastName == '' | email == '' | dob == '' | hometown == '') {
            toast.error('Plase complete all fields', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            return;
        }

        axios.post(conn_path + "/HandleUser/addUser", {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            gender: gender,
            dob: dob,
            hometown: hometown
        }).then((response) =>{
            if (response.data === "success") {
                toast.success('Wlcome Picture Perfect User!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                navigation.navigate('Login');
            } else if (response.data == 'ER_DUP_ENTRY') {
                toast.warn('Username or email already exists!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error('There was a prolem creating the account!', {
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
        <div className='create-account-screen'>
            <div className='create-account-container'>
                <div className='create-account-title'>
                    <h1>Create Account</h1>
                </div>

                <div className='create-account-form'>
                    <form>
                        <Input 
                            name={'First Name'} 
                            type={'text'}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Input 
                            name={'Last Name'} 
                            type={'text'} 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <Input 
                            name={'Email'} 
                            type={'text'} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input 
                            name={'Username'} 
                            type={'text'} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input 
                            name={'Password'} 
                            type={'password'} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Input 
                            name={'Confirm Password'} 
                            type={'password'} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input 
                            name={'Gender or Pronouns'} 
                            type={'text'} 
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <Input 
                            name={'Hometown'} 
                            type={'text'} 
                            onChange={(e) => setHometown(e.target.value)}
                        />
                        <Input 
                            name={''} 
                            type={'date'}
                            onChange={(e) => setDOB(e.target.value)}
                        />
                    </form>
                </div>
                    
                <div className='log-in-create-account-button'>
                    <CustomButton 
                        title='Create Account!'
                        //onPress={() => navigation.navigate('Login')}
                        onPress={() => createUserAccount()}
                    />
                </div>

                <div className='create-account-back-button'>
                    <CustomButton 
                        title='Go Back'
                        onPress={() => navigation.navigate('Login')}
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