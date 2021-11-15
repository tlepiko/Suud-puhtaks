//import algus
import { onSnapshot, query, collection, where, orderBy, limit, doc, updateDoc, getDoc, addDoc, serverTimestamp } from '@firebase/firestore';
import db from "../firebase";
import { useState, useEffect } from 'react';
//import lõpp

//funktsioon hiljem vastamiseks märkimiseks
export function questionAnswerLater(questionId) {
    const roomCode = localStorage.getItem('roomCode');
    const questionDocRef = doc(db, "events", roomCode, "questions", questionId);
    const questionDocData = { status: 5 };
    updateDoc(questionDocRef, questionDocData);
};

//funktsion küsimuse vastatuks märkimiseks
export function questionAnswer(questionId) {
    const roomCode = localStorage.getItem('roomCode');
    const questionDocRef = doc(db, "events", roomCode, "questions", questionId);
    const questionDocData = { status: 4 };
    updateDoc(questionDocRef, questionDocData);
};
//funktsioon küsimuse sobimatuks märkimiseks
export function questionInappropriate(questionId) {
    const roomCode = localStorage.getItem('roomCode');
    const questionDocRef = doc(db, "events", roomCode, "questions", questionId);
    const questionDocData = { status: 3};
    updateDoc(questionDocRef, questionDocData);
};

//küsimuse sobivaks märkimise funktsioon
export function questionApprove(questionId) {
    const roomCode = localStorage.getItem('roomCode');
    const questionDocRef = doc(db, "events", roomCode, "questions", questionId);
    const questionDocData = { status: 2};
    updateDoc(questionDocRef, questionDocData);
};

//funktsioon üritusega liitumiseks
export function joinCode() {
    const roomCode = document.getElementById("roomCode").value;
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/Join"
            } else if(!doc.data().moderated) {
                localStorage.setItem("statusCode", 0);
                window.location="/Join"
            } else {
                window.alert("Palun sisesta kehtiv ürituse kood!");
            }
        } else {
            window.alert("Palun sisesta kehtiv ürituse kood!");
        }
    })
    .catch(error => {
        window.alert("Palun sisesta kehtiv ürituse kood!");
    })
}

//funktsioon pealehele naasmiseks
export function returnToMain() {
    window.location = '/';
}

//funktsioon küsimuste staatuste hindamiseks
export function statusName(statusCode) {
    // eslint-disable-next-line
    if(statusCode == 1) {
        return " -Esitatud";
    }
    // eslint-disable-next-line
    else if(statusCode == 2) {
        return " -Heaks kiidetud";
    }
    // eslint-disable-next-line
    else if(statusCode == 3) {
        return " -Pole heaks kiidetud";
    }
    // eslint-disable-next-line
    else if(statusCode == 4) {
        return " -Vastatud";
    }
    // eslint-disable-next-line
    else if(statusCode == 5) {
        return " -Hiljem vastamiseks";
    }
}

//funktsioon moderaatorivaate kuvamiseks
export function ModeratorView() {
    const [questions, setQuestions] = useState([]);
    const roomCode = localStorage.getItem("roomCode");
    useEffect(
      () =>
        onSnapshot(query(
          collection(db, "events", roomCode, "questions"),
          //erinevad status olekud: 1. posed, 2. readyforanswer, 3. unsuitable, 4. answered, 5. answerlater
          where("status", "==", 1),
          orderBy("created", "asc"),
          limit(10)),
          (snapshot) =>
            setQuestions(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ),
      [roomCode]
    );
    return (
      <div class="App">
          {questions.map(question => (
                    <div id={question.id} value={question.id} key={question.id}>{question.question}<button className={"button"} onClick={() => questionAnswer(question.id)}>Vastatud</button><button className={"button"} onClick={() => questionAnswerLater(question.id)}>Hiljem vastamiseks</button></div>
        ))}
      </div>
    );
};

//funktsioon üritusse sisenemiseks(sisselogituna)
export const eventEnter = (roomCode) => {
    /* localStorage.clear("roomCode"); */
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/EventPage"
            } else {
                localStorage.setItem("statusCode", 0);
                window.location="/EventPage"
            }
        }
    }
    )        
};

//funktsioon modereerimise sisse/välja lülitamiseks
export async function eventModeration(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    await getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            const questionDocData = { moderated: !doc.data().moderated };
            updateDoc(questionDocRef, questionDocData);
        }
    })
}

//funktsioon ürituse avaliku kuva jaoks
export function eventDisplay(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location="/PublicEventPage";
}

//funktsioon ürituse eemaldamiseks
export function eventRemove(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    const questionDocData = { uid: 1 };
    updateDoc(questionDocRef, questionDocData);
};

//funktsioon ürituse loomiseks
export function createRoom() {
    const user = localStorage.getItem('user');
    const roomName = document.getElementById("roomName").value;
    addDoc(collection(db, "events"), {
        created: serverTimestamp(),
        name: roomName,
        uid: user
    });
}

//funktsioon moderaatori määramiseks
export function assignModerator(roomCode) {
    const questionDocRef = doc(db, "events", roomCode);
    var moderatorEmail = prompt("Palun sisesta moderaatori meili aadress", "");
    const questionDocData = { moderator: moderatorEmail };
    updateDoc(questionDocRef, questionDocData);
}

//funktsioon arhiivi kuvamiseks(väga algeline)
export function displayArchive(roomCode) {
    localStorage.setItem("roomCode", roomCode);
    window.location="/Archive";
}

//funktsioon välja logimiseks
export function signOut() {
    localStorage.clear();
    window.location.reload(false);
}

//funktsioon pealehele naasmiseks
export function returnToLogin() {
    window.location="/Login";
}

//funktsioon moderaatorile ürituse kuvamiseks
export const enterModeration = (roomCode) => {
    localStorage.setItem("roomCode", roomCode);
    const questionDocRef = doc(db, "events", roomCode);
    getDoc(questionDocRef)
    .then(function (doc) {
        if(doc.exists) {
            if(doc.data().moderated) {
                localStorage.setItem("statusCode", 1);
                window.location="/ModeratedEvent";
            } else {
                localStorage.setItem("statusCode", 0);
                window.location="/ModeratedEvent";
            }
        }
    }
    )        
};