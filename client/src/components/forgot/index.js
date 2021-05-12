import React, { useState } from "react";
import axiosInstance from '../../axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from "query-string";
import { useHistory } from "react-router-dom";
export default function ForgotPasswordComponent(props) {
    const [formData, setFormData] = useState({
        confirmPassword: "",
        password: "",
        isCompleted: false,
        email: ""
    });
    const history = useHistory();
    const queryString12 = queryString.parse(props.location.pathname);
    const { email, password, confirmPassword } = formData;
    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ email });
            const res = await axiosInstance().post("/api/users/forgot", body, config);
            if (res) {
                setFormData({ ...formData, isCompleted: true });
            }
        } catch {
            toast.dark('🦄 Something Wrong!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    const handleForgotPassword = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ password, confirmPassword, email: queryString12.email, token: queryString12.token });
            const res = await axiosInstance().post("/api/users/updatePassword", body, config);
            if (res.data) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user_infor", JSON.stringify(res.data.user));
                history.push("/dashboard")
            }
        } catch {
            toast.dark('🦄 Something Wrong!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    return (
        <>
            {queryString12.token ? <>
                <h1 className='large text-primary'>Update Your Password</h1>
                <form className='form' onSubmit={(e) => handleForgotPassword(e)}>
                    <div className='form-group'>
                        <input
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={(e) => handleInput(e)}
                            name='password'
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            placeholder='Cofirm Password'
                            value={confirmPassword}
                            onChange={(e) => handleInput(e)}
                            name='confirmPassword'
                        />
                    </div>
                    <input type='submit' className='btn btn-primary' value='Submit' />
                </form>
            </> : <>
                <h1 className='large text-primary'>Forgot Password</h1>
                <form className='form' onSubmit={(e) => handleSubmit(e)}>
                    <div className='form-group'>
                        <input
                            type='email'
                            placeholder='Your Email'
                            value={email}
                            onChange={(e) => handleInput(e)}
                            name='email'
                        />
                    </div>
                    <input type='submit' className='btn btn-primary' value='Submit' />
                </form>
                {formData.isCompleted ? <p style={{ color: 'blue' }}>Please check your mail</p> : ""}
            </>}
            <ToastContainer />
        </>
    );
};
