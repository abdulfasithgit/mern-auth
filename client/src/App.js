import React from 'react';
import Layout from './core/Layout';

const App = () => {
  return (
    <Layout>
       <div className="col-md-6 offset-md-3 text-center p-5" >
      <h1>React Node Authentication Boilerplate</h1>
      <h2>MERN STACK</h2>
      <hr/>
      <p className="lead">MERN stack login register system with account activation,login with facebook and google as well as private and protected routes for authenticated and users with the role and admin.</p>
      </div>
    </Layout>
  )
}

export default App;
