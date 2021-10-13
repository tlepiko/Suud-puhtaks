import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { onSnapshot, query, collection, where, orderBy, limit, addDoc, doc, updateDoc, serverTimestamp, setDoc } from '@firebase/firestore';
import db from "../../firebase";
import { NavLink } from 'react-router-dom';
/**
* @author
* @function JoinEventPage
**/

export const JoinEventPage = (props) => {
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
        []
    );
    const questionSubmit = async (event) => {
        event.preventDefault();
        var question = event.target.question.value;
        document.questionForm.reset();
        const questionsRef = collection(db, "events", roomName, "questions");
        const questionData = { question: question, status: 1, created: serverTimestamp() };
        await addDoc(questionsRef, questionData);
    };
    if(questions[0] !== undefined) {
        return (
            <div>
                <div>Suud puhtaks!</div>
                <Layout>
    
                </Layout>
    
                <div clas="App">
                    {questions.map(question => (
                        <div id={question.id} value={question.id} key={question.id}>{question.question}</div>
                    ))}
                    <div>
                        <form name="questionForm" onSubmit={questionSubmit}>
                            <label>Küsimus
                                <input type="text" name="question" />
                            </label>
                            <button type="submit">Saada</button>
                        </form>
                    </div>
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
            <button type="button" onClick={returnToMain}>Tagasi</button>
            </div>
        )
    }


}

function returnToMain() {
    window.location="/Login";
}