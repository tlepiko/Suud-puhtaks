import React from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../actions/auth.actions';
import { Redirect } from 'react-router';
import { joinCode } from '../../actions/functions';
import'./style.css';

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
            <div className={"flex"}>
                <div className={"flex-v box"}> 
                    <div>
                        <h1 className={"title centered-text"}>Suud puhtaks!</h1>
                    </div>
                    <div className={"flex-2 flex-v"}>
                        <div className={"flex v-margin"}>
                            <button className={"button login-button"} type="button" onClick={userLogin}>Logi sisse</button>
                        </div>
                        <h2 className={"centered-text v-margin"}>Või</h2>
                        <p className={"centered-text id1"}>Sisesta ruumi kood</p>
                        <div className={"v-margin"}>
                            <input className={"field"} placeholder="kood" id="roomCode"></input>
                            <button className={"button"} type="button" onClick={joinCode}>Liitu üritusega</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//#351c75
//#ebebf2
//#351c75