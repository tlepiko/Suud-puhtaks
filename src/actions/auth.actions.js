import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

//Google kontoga sisselogimise funktsioon
export const signInWithGoogle = () => {
    return async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const loggedIn = result.user.uid;
                const email = result.user.email;
                localStorage.setItem('user', loggedIn);
                localStorage.setItem('email', email);
                window.location.reload(false);

            })
            .catch(error => {
                console.log("Esines viga: " + error.message);
            });
    }
}
