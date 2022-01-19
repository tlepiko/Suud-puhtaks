import React, { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit, addDoc, serverTimestamp, } from '@firebase/firestore';
import db from "../../firebase";
import { returnToLogin } from '../../actions/functions';
/**
* @author
* @function JoinEventPage
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

//Anonüümsele kasutajale üritusega ühinemisel kuvatav vaade, kus on võimalik küsimusi esitada
export const JoinEventPage = () => {
    const roomCode = localStorage.getItem('roomCode');
    const [questions, setQuestions] = useState([]);
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
    const questionSubmit = async (event) => {
        event.preventDefault();
        var question = event.target.question.value;
        document.questionForm.reset();
        const questionsRef = collection(db, "events", roomCode, "questions");
        const questionData = { question: question, status: 1, created: serverTimestamp() };
        await addDoc(questionsRef, questionData);
    };
    if (questions[0] !== undefined) {
        return (
            <div>
                <div>Suud puhtaks!</div>
                <button type="button" onClick={returnToLogin}>Tagasi</button>
                <div className="questionDisplay2">
                    {questions.map(question => (
                        <div id={question.id} value={question.id} key={question.id}>{question.question}</div>
                    ))}
                </div>
                <div className="questionSubmit">
                    <form name="questionForm" onSubmit={questionSubmit}>
                        <label>Küsimus
                            <input type="text" name="question" />
                        </label>
                        <button type="submit">Saada</button>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <p>Hetkel küsimusi pole!</p>
                <div>
                    <form name="questionForm" onSubmit={questionSubmit}>
                        <label>Küsimus
                            <input type="text" name="question" />
                        </label>
                        <button type="submit">Esita</button>
                    </form>
                </div>
                <button type="button" onClick={returnToLogin}>Tagasi</button>
            </div>
        )
    }
}