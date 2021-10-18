import React from 'react';
import { Layout } from '../../components/Layout';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy, limit, addDoc, doc, updateDoc, serverTimestamp, setDoc } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import { PublicEventPage } from '../PublicEventPage/PublicEventPage';
const auth = getAuth();
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
            <Layout>

            </Layout>

            <div clas="App">
                {events.map(event => (
                    <div id={event.id} value={event.id} key={event.id}>{event.name}<button onClick={() => eventEnter(event.id)}>Sisene</button><button onClick={() => eventDisplay(event.id)}>Avalik vaade</button><button onClick={() => eventRemove(event.id)}>Kustuta üritus</button><button onClick={() => window.alert("Selle ruumi kood on: " + event.id)}>Hangi kood</button></div>
                ))}
            </div>
            <div>
                Ürituse nimi:
                <input type="text" id="roomName" />
                <button type="submit" onClick={() => createRoom()}>Loo üritus</button></div>
        </div>

    )
}

function eventEnter(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location="/EventPage";
};

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

function signOut() {
    localStorage.clear();
    window.location.reload(false);
}