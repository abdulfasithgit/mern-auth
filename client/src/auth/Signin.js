import React, {useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import  Layout  from '../core/Layout';
import axios from 'axios';
import {authenticate, isAuth } from './helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import Google from './Google';

const Signin = ({history}) => {
    //
    const [values, setValues] = useState({
        email: "",
        password: "",
        buttonText: "Submit"
    })
    //
    const {email, password, buttonText } = values;
    //
    const handleChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    }
    //
    const informPassword  = response =>{
        authenticate(response, ()=>{
            // toast.success(`Hey ${response.data.user.first_name}, Welcome back!`)
            isAuth() && isAuth().user_role === 'A' ? history.push('/admin') : history.push('/private')
        })
    }
    //
    const clickSubmit = event=>{
        event.preventDefault();
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method:"POST",
            url: `${process.env.REACT_APP_API}/signin`,
            data: {email, password}
        })
        .then(response=>{
            console.log('SIGNIN SUCCESS', response);
            authenticate(response, ()=>{
                setValues({...values, email: '', password: ''});
                // toast.success(`Hey ${response.data.user.first_name}, Welcome back!`)
                isAuth() && isAuth().user_role === 'A' ? history.push('/admin') : history.push('/private')
            })
        })
        .catch(error=>{
            console.log("SIGNIN ERROR", error.response.data);
            setValues({...values,  buttonText: 'Submit'});
            toast.error(error.response.data.error)
        })
    }
    //
    const signinForm =()=>(
        <form> 
            <div className="form-group">
                <label for="Name" className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" placeholder="" />
            </div>
            <div className="form-group">
                <label for="Name" className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" placeholder="" />
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
            {isAuth() ? <Redirect to="/" /> : null}
            <h1>Signin</h1>
            <Google informPassword={informPassword}/>
            {signinForm()}
            <br />
            <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot Password</Link>
            </div>
        </Layout>
    )
}

export default Signin;