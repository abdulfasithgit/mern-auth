import React, {useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import  Layout  from '../core/Layout';
import axios from 'axios'
import {authenticate, isAuth, geteCookie, signout, updateUser } from './helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Private = ({history}) => {
    //
    const [values, setValues] = useState({
        user_role: "",
        first_name: "",
        email: "",
        password: "",
        buttonText: "Submit"
    })
    //
    const {user_role, first_name, email, password, buttonText } = values;
    const token = geteCookie('token');
    //
    useEffect(() => {
      loadProfile();
    }, [])
    //
    const loadProfile = () =>{
        axios({
            method:"GET",
            url: `${process.env.REACT_APP_API}/user/${isAuth().id}`,
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(response=>{
            console.log('response', response);
           
                const {user_role, first_name, email } = response.data;
                setValues({...values,user_role,first_name, email});
            
            
        })
        .catch(error=>{
            console.log("PRIVATE UPDATE ERROR", error.response.data.error);
            if (error.response.status == 401) {
                signout(()=>{
                    history.push('/');
                })
            }
        })
    }
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
            url: `${process.env.REACT_APP_API}/user/update/${isAuth().id}`,
            headers:{
                Authorization: `Bearer ${token}`
            },
            data: {first_name, password}
        })
        .then(response=>{
            console.log('PRIVATE UPDATE SUCCESS', response);
            updateUser(response, ()=>{
                setValues({...values,  buttonText: 'Submitted'});
            toast.success('Profile updated successfully');
            })
            
        })
        .catch(error=>{
            console.log("PRIVATE UPDATE ERROR", error.response.data);
            setValues({...values,  buttonText: 'Submit'});
            toast.error(error.response.data.error)
        })
    }
    //
    const updateForm =()=>(
        <form>
            <div className="form-group">
                <label for="Name" className="text-muted">Role</label>
                <input  defaultValue={user_role} type="text" className="form-control" placeholder="" disabled/>
            </div>
            <div className="form-group">
                <label for="Name" className="text-muted">Name</label>
                <input onChange={handleChange('first_name')} value={first_name} type="text" className="form-control" placeholder="" />
            </div>
            <div className="form-group">
                <label for="Name" className="text-muted">Email</label>
                <input  defaultValue={email} type="email" className="form-control" placeholder="" disabled/>
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
            <h1 className="pt-5 text-center">Private</h1>
            <p className="text-center lead">Profile Update</p>
            {updateForm()}
            </div>
        </Layout>
    )
}

export default Private;