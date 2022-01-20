import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { moderationBtn, showModerator, formatList, eventDisplay, eventRemove, displayArchive, assignModerator, createRoom, signOut, eventEnter } from '../../actions/functions';
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
    formatList();
    return (
        <div>
            <div>Suud puhtaks!</div>
            <div><button type="submit" onClick={() => signOut()}>Logi välja</button></div>
            <a href="/ModeratorPage">Vaata üritusi, kus oled määratud moderaatoriks</a>
            <div className="App">
                <h1>Sinu üritused</h1>
                <div className="createEvent">
                    Ürituse nimi:
                    <input type="text" id="roomName" />
                    <button type="submit" onClick={() => createRoom()}>Loo uus üritus</button>
                </div>
                {events.map(event => (

                    <div id={event.id} value={event.id} key={event.id} onClick={() => formatList()}>

                        <button id={event.id} value={event.id} key={event.id} type="button" className="collapsible">{event.name}</button>
                        <div className="content">
                            <button onClick={() => eventEnter(event.id)}>Sisene</button>
                            <button onClick={() => eventDisplay(event.id)}>Avalik vaade</button>
                            <button onClick={() => eventRemove(event.id)}>Kustuta üritus</button>
                            <button onClick={() => window.alert("Selle ruumi kood on: " + event.id)}>Hangi kood</button>
                            <button onClick={() => displayArchive(event.id)}>Arhiiv</button>
                            <button onClick={() => assignModerator(event.id)}>Määra moderaator</button>
                            {moderationBtn(event)}
                            {/* <button id={"moderationBtn"+event.id} onClick={() => eventModeration(event.id)}>Moderatsioon</button> */}
                            <p>Moderaator:</p>{showModerator(event.moderator)}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}