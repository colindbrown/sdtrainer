class UserModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create a user in the database
    async create(user) {
        const newUserRef = this.db.dbRef.collection("Users").doc();
        newUserRef.set({
            email: user.email
        });
        return newUserRef;
    }

    // setter methods

    // set references for clubs and templates of the active user
    async setActive(user) {
        const dbRef = this.db.dbRef;
        const snapshot = await dbRef.collection("Users").where("email", "==", user.email).get();
        var activeUserId;
        if (snapshot.size > 0) {
            activeUserId = snapshot.docs[0].id;
            this.db.ClubsRef = dbRef.collection("Users").doc(activeUserId).collection("Clubs");
            this.db.TemplatesRef = dbRef.collection("Users").doc(activeUserId).collection("Templates");
        }
    }

}

export default UserModel;