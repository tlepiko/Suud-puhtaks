//Teenuste impordi algus
import React, { useEffect, useState } from 'react';
import db from "./firebase";
import { onSnapshot, collection, orderBy, query, limit, where, addDoc, serverTimestamp, doc, updateDoc } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
//Teenuste impordi lõpp

//Autentimise konstantid algus
const provider = new GoogleAuthProvider();
const auth = getAuth();
//Autentimise konstantid lõpp

//Pealeht algus
function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <header>
        <h1>Test question</h1>
        {user ? <SigningOut /> : <SignIn />}
      </header>
      <section>
        {user ? <OrganizerView /> : <QuestionView />}
        {user ? <ModeratorView /> : <p>Logi sisse, et modereerida ja vastata küsimustele</p>}
      </section>
    </div>
  );
}
//Pealeht lõpp

//Sisselogimine algus
function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  }
  return (
    <button onClick={signInWithGoogle}>Logi sisse</button>
  )
}
//Sisselogimine lõpp

//Väljalogimine algus
function SigningOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Logi välja</button>
  )
}
//Väljalogimine lõpp

//Küsimuste vaade algus
function QuestionView() {
  const [questions, setQuestions] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(
        collection(db, "questions"),
        //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
        where("status", "==", 2),
        orderBy("created", "desc"),
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
    const questionsRef = collection(db, "questions");
    const questionData = { question: question, status: 1, created: serverTimestamp() };
    await addDoc(questionsRef, questionData);
  };
  return (
    <div clas="App">
      <div>
        {questions.map(question => (
          <div key={question.id}>{question.question}</div>
        ))}
      </div>
      <div>
        <form name="questionForm" onSubmit={questionSubmit}>
          <label>Küsimus
            <input type="text" name="question" />
          </label>
          <button type="submit">Saada</button>
        </form>
      </div>
    </div>
  );
}
//Küsimuste vaade lõpp

//Korraldaja vaade algus
function OrganizerView() {
  const [questions, setQuestions] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(
        collection(db, "questions"),
        //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
        where("status", "==", 2),
        orderBy("created", "asc"),
        limit(1)),
        (snapshot) =>
          setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );
  return (
    <div clas="App">
        {questions.map(question => (
          <div id={question.id} value={question.id} key={question.id}>{question.question}<button onClick={() => questionAnswer(question.id)}>Vastatud</button><button onClick={() => questionAnswerLater(question.id)}>Hiljem vastamiseks</button></div>
        ))}
    </div>
  );
};
//Korraldaja vaade lõpp



//Moderaatori vaade algus
function ModeratorView() {
  const [questions, setQuestions] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(
        collection(db, "questions"),
        //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
        where("status", "==", 1),
        orderBy("created", "asc"),
        limit(1)),
        (snapshot) =>
          setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );
  return (
    <div clas="App">
        {questions.map(question => (
          <div id={question.id} value={question.id} key={question.id}>{question.question}<button onClick={() => questionApprove(question.id)}>Sobilik</button><button onClick={() => questionInappropriate(question.id)}>Mittesobilik</button></div>
        ))}
    </div>
  );
};
//Moderaatori vaade lõpp

//Küsimuste haldamine algus
function questionAnswer(questionId) {
  const questionDocRef = doc(db, "questions", questionId);
  const questionDocData = { status: 4};
  updateDoc(questionDocRef, questionDocData);
};

function questionAnswerLater(questionId) {
  const questionDocRef = doc(db, "questions", questionId);
  const questionDocData = { status: 5};
  updateDoc(questionDocRef, questionDocData);
};

function questionInappropriate(questionId) {
  const questionDocRef = doc(db, "questions", questionId);
  const questionDocData = { status: 3};
  updateDoc(questionDocRef, questionDocData);
};

function questionApprove(questionId) {
  const questionDocRef = doc(db, "questions", questionId);
  const questionDocData = { status: 2};
  updateDoc(questionDocRef, questionDocData);
};
//Küsimuste haldamine lõpp
//Export
export default App;