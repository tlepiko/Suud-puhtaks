import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy } from '@firebase/firestore';
/**
* @author
* @function Archive
**/

export const Archive = () => {
    const [questions, setQuestions] = useState([]);
    const roomCode = localStorage.getItem("roomCode");
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events", roomCode, "questions"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("status", "in", [1, 2, 3, 4, 5]),
                orderBy("created", "asc")),
                (snapshot) =>
                    setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [roomCode]
    );
    if (questions.length < 1) {
        return (
            <div>
                <h1>Siia ilmuvad kõik küsimused</h1>
                <p>Hetkel küsimusi pole</p>
                <button type="button" onClick={returnToMain}>Tagasi</button>
            </div>
        )
    }
    return (
        <div>
            <div>Suud puhtaks!</div>
            <button type="button" onClick={returnToMain}>Tagasi</button>
            <div clas="App">
                <h1>Siia ilmuvad kõik küsimused</h1>
                {questions.map(question => (
                    <div id={question.id} value={question.id} key={question.id}>{question.question}{statusName(question.status)}</div>
                ))}
            </div>
        </div>

    )
}

function returnToMain() {
    window.location = '/';
}

function statusName(statusCode) {
    if(statusCode == 1) {
        return " -Esitatud";
    }
    else if(statusCode == 2) {
        return " -Heaks kiidetud";
    }
    else if(statusCode == 3) {
        return " -Pole heaks kiidetud";
    }
    else if(statusCode == 4) {
        return " -Vastatud";
    }
    else if(statusCode == 5) {
        return " -Hiljem vastamiseks";
    }
}