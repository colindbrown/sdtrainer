class SessionModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create or update a session with the provided calls
    async setSession(name, calls) {
        var session = await this.fetchRef(name);
        if (session) {
            var batch = this.db.dbRef.batch();
            var snapshot = await session.collection("Calls").get();
            snapshot.docs.forEach((callDoc) => {
                const call = calls.find((callIterator) => (callIterator.name === callDoc.data().name));
                batch.update(callDoc.ref, {
                    used: call.used,
                    timestamp: call.timestamp
                });
            });
            batch.update(session, {
                finished: true,
                finishedAt: Date.now()
            });
            batch.commit();
        } else {
            const newSession = this.db.activeClubRef.collection("Sessions").doc();
            const activeClub = await this.db.activeClubRef.get();
            newSession.set({ name: name, createdAt: Date.now(), finished: false });
            for (var i = 0; i < calls.length; i++) {
                const ref = await newSession.collection("Calls").add(calls[i]);
                ref.update({position: i});
            }
        }
    }

    // delete a session
    async delete(name) {
        const ref = await this.fetchRef(name);
        const snapshot = await ref.collection("Calls").get();
        snapshot.docs.forEach((doc) => doc.ref.delete());
        ref.delete();
    }

    // accessor methods

    // return session data for a specific session
    async fetchAll() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        })
        return sessions;
    }

    // returns an array of all session names
    async fetchNames() {
        const sessions = await this.fetchAll();
        return this.db.createNamesArray(sessions);
    }

    // return session (a DocumentSnapshot) if it exists, undefined if it doesnt
    async fetchRef(name) {
        const sessionsRef = this.db.activeClubRef.collection("Sessions")
        const snapshot = await sessionsRef.where("name", "==", name).get();
        if (snapshot.size === 0) {
            return undefined;
        } else {
            return snapshot.docs[0].ref;
        }
    }

    // return array of calls in a session with name, used, and timestamp
    async fetchCalls(name) {
        const sessionRef = await this.fetchRef(name);
        const snapshot = await sessionRef.collection("Calls").get();
        var sessionCalls = []
        snapshot.forEach((doc) => {
            const call = doc.data();
            sessionCalls.push(call);
        });
        return await this.db.fetchDisplayData(sessionCalls);
    }

    // return an array of all unfinished sessions
    async fetchPlans() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").where("finished", "==", false).get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        });
        return sessions;
    }

    // return an array of all plan names
    async fetchPlanNames() {
        const plans = await this.fetchPlans();
        return this.db.createNamesArray(plans);
    }

    // returns an array of all finished sessions
    async fetchFinished() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").where("finished", "==", true).get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        });
        return sessions;
    }

    // return if a session with the provided name exists
    async check(name) {
        const snapshot = await this.db.activeClubRef.collection("Sessions").where("name", "==", name).get();
        return snapshot.size === 1;
    }

}

export default SessionModel;