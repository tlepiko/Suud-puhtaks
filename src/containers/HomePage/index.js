import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, getDoc, collection, where, orderBy, limit, addDoc, doc, updateDoc, serverTimestamp } from '@firebase/firestore';
/**
* @author
* @function HomePage
**/

export const HomePage = (props) => {
    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("uid", "==", user),
                orderBy("created", "desc"),
                limit(10)),
                (snapshot) =>
                    setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [user]
    );
    return (
        <div>
            <div>Suud puhtaks!</div>
            <div><button type="submit" onClick={() => signOut()}>Logi välja</button></div>
            <div clas="App">
                <h1>Sinu loodud üritused</h1>
                {events.map(event => (
                    <div id={event.id} value={event.id} key={event.id}>{event.name}<button onClick={() => eventEnter(event.id)}>Sisene</button>
                    <button onClick={() => eventDisplay(event.id)}>Avalik vaade</button>
                    <button onClick={() => eventRemove(event.id)}>Kustuta üritus</button>
                    <button onClick={() => window.alert("Selle ruumi kood on: " + event.id)}>Hangi kood</button>
                    <button onClick={() => displayArchive(event.id)}>Arhiiv</button>
                    <button onClick={() => assignModerator(event.id)}>Määra moderaator</button>
                    <label>Moderatsioon sisse/välja:</label><input type="checkbox" checked={event.moderated} onChange={() => eventModeration(event.id)}></input></div>
                ))}
            </div>
            <div>
                Ürituse nimi:
                <input type="text" id="roomName" />
                <button type="submit" onClick={() => createRoom()}>Loo üritus</button></div>
        </div>

    )
}

const eventEnter = (roomCode) => {
    /* localStorage.clear("roomCode"); */
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/EventPage"
            } else {
                localStorage.setItem("statusCode", 0);
                window.location="/EventPage"
            }
        }
    }
    )        
};

async function eventModeration(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    await getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            const questionDocData = { moderated: !doc.data().moderated };
            updateDoc(questionDocRef, questionDocData);
        }
    })
}

function eventDisplay(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location="/PublicEventPage";
}

function eventRemove(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    const questionDocData = { uid: 1 };
    updateDoc(questionDocRef, questionDocData);
};

function createRoom() {
    const user = localStorage.getItem('user');
    const roomName = document.getElementById("roomName").value;
    addDoc(collection(db, "events"), {
        created: serverTimestamp(),
        name: roomName,
        uid: user
    });
}

function assignModerator(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    var moderatorEmail = prompt("Palun sisesta moderaatori meili aadress", "");
    const questionDocData = { moderator: moderatorEmail };
    updateDoc(questionDocRef, questionDocData);
}

function displayArchive(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location="/Archive";
}

function signOut() {
    localStorage.clear();
    window.location.reload(false);
}