import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
// eslint-disable-next-line

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = () => {
    return async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result.user.displayName + " logis just sisse!");
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
