import React, {useState, useEffect} from 'react';
import  Layout  from '../core/Layout';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Activate = ({match}) => {
    //
    const [values, setValues] = useState({
        name: "",
        token: "",
        show: true
    })
    //
    useEffect(() => {
       let token = match.params.token;
       let {first_name} = jwt.decode(token);
       console.log(jwt.decode(token));
       if (token) {
           setValues({...values, name:first_name, token})
       }
    }, [])
    //
    const {name, token, show } = values;
    //
    const clickSubmit = event=>{
        event.preventDefault();
        axios({
            method:"POST",
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: {token}
        })
        .then(response=>{
            console.log('ACCOUNT ACTIVATION SUCCESS', response);
            setValues({...values, show: false});
            toast.success(response.data.message)
        })
        .catch(error=>{
            console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
            toast.error(error.response.data.error)
        })
    }
    //
    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5 text-center">Hey {name}, ready to activate your account </h1>
            <button type="button" className="btn btn-outline-primary" onClick={clickSubmit}>Activate</button>
        </div>
    );
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
            <ToastContainer />
            <h1>Account Activation</h1>
            {activationLink()}
            </div>
        </Layout>
    )
}

export default Activate;