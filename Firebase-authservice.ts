import firebase from 'firebase';

export class AuthService {
    // Signup with Email/Password method
    signupWithEmail(email: string, password: string){
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    // Signin with Email/Password method
    signinWithEmail(email: string, password: string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    // Logout
    logout() {
	    firebase.auth().signOut();
    }

    // Get active user
    getActiveUser(){
        return firebase.auth().currentUser;
    }
}
