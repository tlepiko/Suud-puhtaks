import React from 'react';
import { Route, Redirect } from 'react-router-dom';
/**
* @author
* @function PrivateRoute
**/

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} component={(props) => {
            const user = localStorage.getItem('user');
            if(user) {
                return <Component {...props} />
            } else {
                return <Redirect to={`/login`} />
            }
        }} />
    )
}