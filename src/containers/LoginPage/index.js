import React from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../actions/auth.actions';
import { Redirect } from 'react-router';
import db from "../../firebase";
import { doc, getDoc } from '@firebase/firestore';

/**
* @author
* @function LoginPage
**/

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

function joinCode() {
    const roomCode = document.getElementById("roomCode").value;
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/Join"
            } else if(!doc.data().moderated) {
                localStorage.setItem("statusCode", 0);
                window.location="/Join"
            } else {
                window.alert("Palun sisesta kehtiv ürituse kood!");
            }
        } else {
            window.alert("Palun sisesta kehtiv ürituse kood!");
        }
    })
    .catch(error => {
        window.alert("Palun sisesta kehtiv ürituse kood!");
    })
}
