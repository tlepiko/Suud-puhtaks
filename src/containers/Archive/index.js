import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy } from '@firebase/firestore';
import { questionStats, returnToMain, statusName, htmlToCSV } from '../../actions/functions';
const array121 = [1, 2, 3, 4, 5];
/**
* @author
* @function Archive
**/
//Arhiivi leht, kus kuvatakse kõik konkreetse ürituse küsimused ja nende olek.
export const Archive = () => {
    const [questions, setQuestions] = useState([]);
    const roomCode = localStorage.getItem("roomCode");
    var html = document.querySelector("table");
    useEffect(
        () =>
            onSnapshot(query(
                collection(db, "events", roomCode, "questions"),
                //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
                where("status", "in", array121),
                orderBy("created", "asc")),
                (snapshot) =>
                    setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            ),
        [roomCode]
    );
    if (questions.length < 1) {
        return (
            <div>
                <h1>Siia ilmuvad kõik üritusel esitatud küsimused esitamise järjekorras</h1>
                <p>Hetkel ürituses küsimusi pole</p>
                <button type="button" onClick={returnToMain}>Tagasi</button>
            </div>
        )
    }
    return (
        <div>
            <div>Suud puhtaks!</div>
            <button type="button" onClick={returnToMain}>Tagasi</button>
            <div clas="App">
                <h1>Siia ilmuvad kõik üritusel esitatud küsimused esitamise järjekorras</h1>
                <p>{questionStats(questions)}</p>
                <button onClick={() => htmlToCSV(html, "kysimused.csv")}>Lae tabel alla!</button>
                <table>
                <tbody>
                    <tr>
                        <th>Küsimus</th>
                        <th>Staatus</th>
                    </tr>
                
                {questions.map(question => (
                    <tr id={question.id} value={question.id} key={question.id}><td>{question.question}</td><td>{statusName(question.status)}</td></tr>
                ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}