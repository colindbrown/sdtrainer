class ClubModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create a new club with a given name
    async create(name) {
        const docRef = await this.db.ClubsRef.add({
            name: name,
            createdAt: Date.now(),
            taught: 0
        })
        const allCalls = await this.db.calls.fetchAll();
        allCalls.forEach((call) => {
            docRef.collection("History").add({
                name: call.name,
                everUsed: false,
                uses: []
            })
        })
    }

    // delete a club
    async delete(name) {
        const clubSnapshot = await this.db.ClubsRef.where("name", "==", name).get();
        const ref = clubSnapshot.docs[0].ref;

        var snapshot = await ref.collection("History").get();
        snapshot.docs.forEach((doc) => doc.ref.delete());

        snapshot = await ref.collection("Sessions").get();
        snapshot.docs.forEach(async (session) => {
            const sessionSnapshot = await session.ref.collection("Calls").get();
            sessionSnapshot.docs.forEach((doc) => doc.ref.delete());
            session.ref.delete();
        });

        ref.delete();
    }

    // setter methods

    // set the active club, return the club
    async setActive(name) {
        const snapshot = await this.db.ClubsRef.where("name", "==", name).get();
        this.db.activeClubRef = snapshot.docs[0].ref;
        return snapshot.docs[0].data();
    }

    // accessor methods

    // get the data of all clubs
    async fetchAll() {
        const snapshot = await this.db.ClubsRef.get();
        var clubs = [];
        snapshot.forEach((doc) => {
            clubs.push(doc.data());
        });
        return clubs;
    }

    // return if club with a given name exists
    async check(name) {
        const snapshot = await this.db.ClubsRef.where("name", "==", name).get();
        return snapshot.size === 1;
    }
}

export default ClubModel;