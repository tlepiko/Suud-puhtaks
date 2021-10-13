import React from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../actions/auth.actions';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Layout/UI/Card';
import { getAuth } from '@firebase/auth';
import { Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
const auth = getAuth();
/**
* @author
* @function LoginPage
**/

export const LoginPage = (props) => {
    const dispatch = useDispatch();
    const userLogin = (e) => {
        e.preventDefault();
        dispatch(signInWithGoogle());
    }
    const user = localStorage.getItem('user');
    if (user) {
        return <Redirect to="/" />
    } else {
        console.log("No logged in user");
        return (
            <div>
                <div>Suud puhtaks!</div>
                <Layout>
                    <div>
                        <Card>
                            <div>
                                <button onClick={userLogin}>Logi sisse</button>
                            </div>
                            <div>
                                Sisesta ruumi kood:<input id="roomCode"></input>
                                <button type="button" onClick={joinCode}>Liitu üritusega</button>
                            </div>
                        </Card>
                    </div>
                </Layout>
            </div>
        )
    }
}

function joinCode() {
    const roomCode = document.getElementById("roomCode").value;
    localStorage.setItem('roomCode', roomCode)
    if (!roomCode) {
        window.alert("Palun sisesta ürituse kood!");
    } else {
        window.location='/Join';
    }

}
