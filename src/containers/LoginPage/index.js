import React from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../actions/auth.actions';
import { Redirect } from 'react-router';
import { joinCode } from '../../actions/functions';

/**
* @author
* @function LoginPage
**/

//Lehe külalisele, mitte sisselogitud kasutajale, avavaade, kus on võimalus sisse logida ja üritusega liituda.
export const LoginPage = () => {
    const dispatch = useDispatch();
    const userLogin = (e) => {
        e.preventDefault();
        dispatch(signInWithGoogle());
    }
    const user = localStorage.getItem('user');
    if (user) {
        return <Redirect to="/" />
    } else {
        return (
            <div>
                <div>Suud puhtaks!</div>
                    <div>
                            <div>
                                <button onClick={userLogin}>Logi sisse</button>
                            </div>
                            <div>
                                Sisesta ruumi kood:<input id="roomCode"></input>
                                <button type="button" onClick={joinCode}>Liitu üritusega</button>
                            </div>
                    </div>
            </div>
        )
    }
}
