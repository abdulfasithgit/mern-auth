import React  from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import {authenticate, isAuth } from './helper';

const Google = ({informPassword = f => f}) => {
    const responseGoogle =(response) =>{
        console.log(response.tokenId)
        axios({
          method:"POST",
          url:`${process.env.REACT_APP_API}/google-login`,
          data:{idToken:response.tokenId}
        })
        .then(response=>{
          console.log('GOOGLE SIGN IN SUCCESS', response)
          informPassword(response);
        })
        .catch(error=>{
          console.log('GOOGLE SIGN IN ERROR', error.response)
        })
    }
    return (
        <div className="pb-3">
        <GoogleLogin
        clientId={`${process.env.REACT_APP_API_GOOGLE_CLIENT_ID}`}
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn btn-lg btn-danger btn-block"> <i className="fab fa-google pr-2"></i> Login with google</button>
        )}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
      </div>
    )
}

export default Google;