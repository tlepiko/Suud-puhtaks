import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy } from '@firebase/firestore';
import { returnToMain, signOut, enterModeration } from '../../actions/functions';
/**
* @author
* @function ModeratorPage
**/

//Moderaatori vaaade sisselogitud kasutajale, kus kuvatakse kõik üritused mille moderaatoriks kasutaja on.
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
                <h1>Siin on üritused, kus oled moderaatoriks määratud</h1>
                <p>Sind pole kuskil moderaatoriks määratud</p>
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
            <h1>Siin on üritused, kus oled moderaatoriks määratud</h1>
                {moderatedRooms.map(moderatedRoom => (
                    <div id={moderatedRoom.id} value={moderatedRoom.id} key={moderatedRoom.id}>{moderatedRoom.name}<button onClick={() => enterModeration(moderatedRoom.id)}>Sisene</button></div>
                ))}
            </div>
        </div>

    )
}

