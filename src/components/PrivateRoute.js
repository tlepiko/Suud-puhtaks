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
                console.log("Sisselogitud!");
                return <Component {...props} />
            } else {
                console.log("Pole sisselogitud!")
                return <Redirect to={`/login`} />
            }
        }} />
    )
}