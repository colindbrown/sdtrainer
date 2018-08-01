class SessionModel {
    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create session with the provided calls
    async create(name, calls) {
        const newSession = this.db.activeClubRef.collection("Sessions").doc();
        newSession.set({ name: name, createdAt: Date.now(), finished: false, count: calls.length });
        for (var i = 0; i < calls.length; i++) {
            const ref = await newSession.collection("Calls").add(calls[i]);
            ref.update({position: i});
        }
    }

    // edit session with new calls
    async edit(name, calls) {
        const session = await this.fetchRef(name);
        session.update({ count: calls.length });
        const snapshot = await session.collection("Calls").get();
        snapshot.docs.forEach((doc) => doc.ref.delete());
        for (var i = 0; i < calls.length; i++) {
            const ref = await session.collection("Calls").add(calls[i]);
            ref.update({position: i});
        }
    }

    // finish a session
    async finish(name, calls) {
        const session = await this.fetchRef(name);
        var batch = this.db.dbRef.batch();
        var snapshot = await session.collection("Calls").get();
        var used = 0;
        snapshot.docs.forEach((callDoc) => {
            const call = calls.find((callIterator) => (callIterator.name === callDoc.data().name));
            if (call.used) {
                used++;
            }
            batch.update(callDoc.ref, {
                used: call.used,
                timestamp: call.timestamp
            });
        });
        batch.update(session, {
            finished: true,
            finishedAt: Date.now(),
            used: used
        });
        const club = await this.db.activeClubRef.get();
        batch.update(this.db.activeClubRef, {
            sessions: club.data().sessions + 1
        })
        batch.commit();
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
        const sessionExists = snapshot.size === 1;
        const finished = sessionExists ? snapshot.docs[0].data().finished : undefined;
        return {sessionExists, finished};
    }

}

export default SessionModel;