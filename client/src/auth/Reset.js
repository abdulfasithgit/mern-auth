import React, {useState, useEffect} from 'react';
import jwt from 'jsonwebtoken';
import  Layout  from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Reset = ({match}) => {
    //
    const [values, setValues] = useState({
        name: "",
        token: "",
        newPassword:"",
        buttonText: "Reset Password"
    })
    //
    useEffect(() => {
        let token = match.params.token;
        let {name} = jwt.decode(token);
        console.log(jwt.decode(token));
        if (token) {
            setValues({...values, name, token});
        }
    }, [])
    //
    const {name, token, newPassword, buttonText} = values;
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
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: {newPassword, forgot_request:token}
        })
        .then(response=>{
            console.log('RESET PASSWORD SUCCESS', response);
            toast.success(response.data.message);
            setValues({...values,  buttonText: 'Done'});
            
        })
        .catch(error=>{
            console.log("RESET PASSWORD ERROR", error.response.data);
            toast.error(error.response.data.error)
            setValues({...values,  buttonText: 'Reset Password'});
            
        })
    }
    //
    const passwordResetForm =()=>(
        <form> 
            <div className="form-group">
                <label for="Name" className="text-muted">New Password</label>
                <input onChange={handleChange('newPassword')} value={newPassword} type="password" className="form-control" placeholder="Enter the new password" />
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
            <h1>Hey, {name} type your new password</h1>
            {passwordResetForm()}
            </div>
        </Layout>
    )
}

export default Reset;