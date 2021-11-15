import React, { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit } from '@firebase/firestore';
import db from "../../firebase";
import { returnToMain } from '../../actions/functions';
import'./style.css';
/**
* @author
* @function PublicEventPage
**/

export const PublicEventPage = () => {
    const roomName = localStorage.getItem('roomCode');
    const [questions, setQuestions] = useState([]);
    console.log(questions);
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events", roomName, "questions"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("status", "==", 2),
                orderBy("created", "asc"),
                limit(1)),
                (snapshot) =>
                    setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [roomName]
    );

    if(questions[0] !== undefined) {
        return (
            <div className={"flex-v flexbox"}>
                <div className={"centered-text"}>Suud puhtaks!</div>
                <blockquote class="App q-container">
                    {questions.map(question => (
                        <p className={"question"} id={question.id} value={question.id} key={question.id}>{question.question}</p>
                        ))}
                </blockquote>
                <button className={"button back-button"} type="button" onClick={returnToMain}>Tagasi</button>    
            </div>
        )
    } else {
        return (
            <div>
            <p className={"error-message"}>Hetkel küsimusi pole!</p>
            </div>
        )
    }


}