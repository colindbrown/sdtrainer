class ClubModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create a new club with a given name
    async createNewClub(name) {
        const docRef = await this.db.ClubsRef.add({
            name: name,
            createdAt: Date.now(),
            sessions: 0,
            taught: 0
        })
        const allCalls = await this.db.calls.fetchAllCalls();
        allCalls.forEach((call) => {
            docRef.collection("History").add({
                name: call.name,
                everUsed: false,
                uses: []
            })
        })
    }

    // delete a club
    async deleteClub(name) {
        const snapshot = await this.db.ClubsRef.where("name", "==", name).get();
        if (snapshot.size === 1) {
            snapshot.docs[0].ref.delete();
        }
    }

    // setter methods

    // set the active club, return the club
    async setActiveClub(name) {
        const snapshot = await this.db.ClubsRef.where("name", "==", name).get();
        this.db.activeClubRef = snapshot.docs[0].ref;
        return snapshot.docs[0].data();
    }

    // accessor methods

    // get the data of all clubs
    async fetchClubs() {
        const snapshot = await this.db.ClubsRef.get();
        var clubs = [];
        snapshot.forEach((doc) => {
            clubs.push(doc.data());
        });
        return clubs;
    }

    // return club (a DocumentSnapshot) if it exists, undefined if it doesnt
    async checkClub(name) {
        const snapshot = await this.db.ClubsRef.where("name", "==", name).get();
        if (snapshot.size === 0) {
            return undefined;
        } else {
            return snapshot.docs[0].data();
        }
    }
}

export default ClubModel;