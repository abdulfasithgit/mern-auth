import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isAuth} from './helper';

const PrivateRoute = ({component: Component, ...rest})=>(
    
    <Route {...rest} render={
        props=> isAuth()&&isAuth().user_role==='A' ? (<Component {...props} />) : (<Redirect to={{
            pathname : '/signin',
            state: {from:props.location}
        }}/>)
    }>
     </Route>
)

export default PrivateRoute;