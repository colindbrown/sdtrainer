import firebase from "firebase";

var config = {
apiKey: "AIzaSyCeQqMD5viBw8066MIbAx5TlL-1c9sc9qk",
authDomain: "square-dancing-trainer.firebaseapp.com",
databaseURL: "https://square-dancing-trainer.firebaseio.com",
projectId: "square-dancing-trainer",
storageBucket: "",
messagingSenderId: "671291885254"
};

firebase.initializeApp(config);

const db = firebase.firestore();

export { db };