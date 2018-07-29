class SessionModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create or update a session with the provided calls
    async setSession(name, calls) {
        var session = await this.fetchSessionRef(name);
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
            newSession.set({ name: name, createdAt: Date.now(), finished: false, id: activeClub.data().sessions });
            this.db.activeClubRef.update({sessions: (activeClub.data().sessions + 1)});
            for (var i = 0; i < calls.length; i++) {
                const ref = await newSession.collection("Calls").add(calls[i]);
                ref.update({position: i});
            }
        }
    }

    // delete a session
    async deleteSession(name) {
        const ref = await this.fetchSessionRef(name);
        this.db.activeClubRef.collection("Sessions").doc(ref.id).delete();
    }

    // accessor methods

    // return session data for a specific session
    async fetchSessions() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        })
        return sessions;
    }

    // return session (a DocumentSnapshot) if it exists, undefined if it doesnt
    async fetchSessionRef(name) {
        const sessionsRef = this.db.activeClubRef.collection("Sessions")
        const snapshot = await sessionsRef.where("name", "==", name).get();
        if (snapshot.size === 0) {
            return undefined;
        } else {
            return snapshot.docs[0].ref;
        }
    }

    // return array of calls in a session with name, used, and timestamp
    async fetchSessionCalls(name) {
        const sessionRef = await this.fetchSessionRef(name);
        const snapshot = await sessionRef.collection("Calls").get();
        var sessionCalls = []
        snapshot.forEach((doc) => {
            const call = doc.data();
            sessionCalls.push(call);
        });
        return sessionCalls;
    }

    // return an array of all unfinished sessions
    async fetchUnfinishedSessions() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").where("finished", "==", false).get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        });
        return sessions;
    }

    // returns an array of all finished sessions
    async fetchfinishedSessions() {
        const snapshot = await this.db.activeClubRef.collection("Sessions").where("finished", "==", true).get();
        var sessions = [];
        snapshot.forEach((doc) => {
            sessions.push(doc.data());
        });
        return sessions;
    }

}

export default SessionModel;