import React from 'react';
import { questionAnswerLater, questionAnswer, returnToMain, ModeratorView } from '../../actions/functions';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy, limit } from '@firebase/firestore';
/**
* @author
* @function EventPage
**/
var statusCode = localStorage.getItem("statusCode");
var status;
// eslint-disable-next-line
if (statusCode == 1) {
    status = [2];
    // eslint-disable-next-line
} else if (statusCode == 0) {
    status = [1, 2];
}

//Konkreetse ürituse leht ürituse korraldajale, kus kuvatakse vastamiseks olevad küsimused, kui ka modereeritavad küsimused.
export const EventPage = () => {
    const [questions, setQuestions] = useState([]);
    const roomCode = localStorage.getItem("roomCode");
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events", roomCode, "questions"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("status", "in", status),
                orderBy("created", "asc"),
                limit(1)),
                (snapshot) =>
                    setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [roomCode]
    );
    if (questions.length < 1) {
        return (
            <div>
                <h1>Siin algab vastamiseks olevate küsimuste ala</h1>
                <p>Hetkel vastamiseks küsimusi pole</p>
                <button type="button" onClick={returnToMain}>Tagasi</button>
                <h1>Siin algab modereerimiseks olevate küsimuste ala</h1>
                <ModeratorView />
            </div>
        )
    }
    return (
        <div>
            <div>Suud puhtaks!</div>
            <button type="button" onClick={returnToMain}>Tagasi</button>


            <div clas="App">
                <h1>Vastamiseks küsimused</h1>
                {questions.map(question => (
                    <div id={question.id} value={question.id} key={question.id}>
                        {question.question}<br></br>
                        <button onClick={() => questionAnswer(question.id)}>Vastatud</button>
                        <button onClick={() => questionAnswerLater(question.id)}>Hiljem vastamiseks</button></div>
                ))}
            </div>
            <div>
                <h1>Modereeritavad küsimused</h1>
                <ModeratorView />
            </div>
        </div>

    )
}