import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { eventDisplay, eventRemove, displayArchive, assignModerator, eventModeration, createRoom, signOut, eventEnter } from '../../actions/functions';
import { onSnapshot, query, collection, where, orderBy, limit } from '@firebase/firestore';
/**
* @author
* @function HomePage
**/

//Sisselogitud kasutaja avaleht, kus kuvatakse kõik kasutaja poolt loodud üritused
export const HomePage = () => {
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
            <a href="/ModeratorPage">Vaata üritusi, kus oled määratud moderaatoriks</a>
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