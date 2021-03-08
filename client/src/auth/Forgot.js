import React, {useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import  Layout  from '../core/Layout';
import axios from 'axios';
import {authenticate, isAuth } from './helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Forgot = ({history}) => {
    //
    const [values, setValues] = useState({
        email: "",
        buttonText: "Reset Password"
    })
    //
    const {email, buttonText } = values;
    //
    const handleChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    }
    //
    const clickSubmit = event=>{
        event.preventDefault();
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method:"PUT",
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: {email}
        })
        .then(response=>{
            console.log('FORGOT PASSWORD SUCCESS', response);
            toast.success(response.data.message);
            setValues({...values,  buttonText: 'Requested'});
            
        })
        .catch(error=>{
            console.log("FORGOT PASSWORD ERROR", error.response.data);
            toast.error(error.response.data.error)
            setValues({...values,  buttonText: 'Reset Password'});
            
        })
    }
    //
    const passwordForgotForm =()=>(
        <form> 
            <div className="form-group">
                <label for="Name" className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" placeholder="" />
            </div>
           
            <div>
                <button onClick={clickSubmit} className="btn btn-primary">{buttonText}</button>
            </div>
        </form>
    )
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
            <ToastContainer />
            <h1>Forgot Password</h1>
            {passwordForgotForm()}
            </div>
        </Layout>
    )
}

export default Forgot;