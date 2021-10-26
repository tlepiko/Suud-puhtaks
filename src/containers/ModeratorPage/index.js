import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy, doc, getDoc } from '@firebase/firestore';
/**
* @author
* @function ModeratorPage
**/

export const ModeratorPage = () => {
    const [moderatedRooms, setModeratedRooms] = useState([]);
    const email = localStorage.getItem("email");
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("moderator", "==", email),
                orderBy("created", "asc"),),
                (snapshot) =>
                    setModeratedRooms(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [email]
    );
    if (moderatedRooms.length < 1) {
        return (
            <div>
                <div><button type="button" onClick={() => signOut()}>Logi välja</button></div>
                <h1>Siin algab modereerimiseks olevate küsimuste ala</h1>
                <p>Hetkel vastamiseks küsimusi pole</p>
                <button type="button" onClick={returnToMain}>Tagasi</button>
                
            </div>
        )
    }
    return (
        <div>
            <div>Suud puhtaks!</div>
            <div><button type="button" onClick={() => signOut()}>Logi välja</button></div>
            <div clas="App">
            <button type="button" onClick={returnToMain}>Tagasi</button>
            <h1>Siin algab modereerimiseks olevate küsimuste ala</h1>
                {moderatedRooms.map(moderatedRoom => (
                    <div id={moderatedRoom.id} value={moderatedRoom.id} key={moderatedRoom.id}>{moderatedRoom.name}<button onClick={() => enterModeration(moderatedRoom.id)}>Sisene</button></div>
                ))}
            </div>
        </div>

    )
}

/* function enterModeration(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location = '/ModeratedEvent';
}; */

const enterModeration = (roomCode) => {
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/ModeratedEvent";
            } else {
                localStorage.setItem("statusCode", 0);
                window.location="/ModeratedEvent";
            }
        }
    }
    )        
};

function returnToMain() {
    window.location = '/';
}

function signOut() {
    localStorage.clear();
    window.location.reload(false);
}