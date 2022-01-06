import React, { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit } from '@firebase/firestore';
import db from "../../firebase";
import { returnToMain } from '../../actions/functions';
/**
* @author
* @function PublicEventPage
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

export const PublicEventPage = () => {
    const roomName = localStorage.getItem('roomCode');
    const [questions, setQuestions] = useState([]);
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events", roomName, "questions"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("status", "in", status),
                orderBy("created", "asc"),
                limit(1)),
                (snapshot) =>
                    setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [roomName]
    );

    if(questions[0] !== undefined) {
        return (
            <div>
                <div>Suud puhtaks!</div>
                <button type="button" onClick={returnToMain}>Tagasi</button>    
                <div clas="App">
                    {questions.map(question => (
                        <div id={question.id} value={question.id} key={question.id}>{question.question}</div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div>
            <p>Hetkel küsimusi pole!</p>
            </div>
        )
    }


}