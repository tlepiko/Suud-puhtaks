import React from 'react';
import { useState, useEffect } from 'react';
import db from "../../firebase";
import { onSnapshot, query, collection, where, orderBy, limit } from '@firebase/firestore';
import { signOut, returnToMain, ModeratorView } from '../../actions/functions';
/**
* @author
* @function ModeratedEvent
**/

//Ürituse moderaatorile vaade konkreetse ürituse kohta, kus on võimalik küsimusi sobivaks või mittesobivaks märkida.
export const ModeratedEvent = () => {
  const [questions, setQuestions] = useState([]);
  const roomCode = localStorage.getItem("roomCode");
  useEffect(
    () =>
      onSnapshot(query(
        collection(db, "events", roomCode, "questions"),
        //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
        where("status", "==", 2),
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
        <div><button type="button" onClick={() => signOut()}>Logi välja</button></div>
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
      <div><button type="button" onClick={() => signOut()}>Logi välja</button></div>


      <div clas="App">
        <h1>Siin algab vastamiseks olevate küsimuste ala</h1>
        {questions.map(question => (
          <div id={question.id} value={question.id} key={question.id}>{question.question}</div>
        ))}
      </div>
      <div>
        <h1>Siin algab modereerimiseks olevate küsimuste ala</h1>
        <ModeratorView />
      </div>
    </div>

  )
}