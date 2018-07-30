class HistoryModel {

    constructor(db) {
        this.db = db;
    }

    // updates the everUsed and uses data for all provided calls
    async update(sessionName, calls) {
        var batch = this.db.dbRef.batch();
        var snapshot = await this.db.activeClubRef.collection("History").get();
        const sessionRef = await this.db.sessions.fetchRef(sessionName);
        const session = await sessionRef.get()
        var newCalls = [];
        snapshot.docs.forEach((callDoc) => {
            const prev = callDoc.data();
            const call = calls.find((callIterator) => (callIterator.name === prev.name));
            if (call) {
                if (!prev.everUsed && call.everUsed) {
                    newCalls.push(call);
                }
                const uses = call.everUsed ? prev.uses.concat([session.data().name]) : prev.uses;
                batch.update(callDoc.ref, {
                    everUsed: (call.everUsed || prev.everUsed),
                    uses: uses,
                    name: call.name
                });
            }
        });
        batch.commit();
        this.db.activeClubRef.get().then((clubSnapshot) => {
            this.db.activeClubRef.update({ newCalls: newCalls, taught: clubSnapshot.data().taught + newCalls.length });
        })
    }

    // returns history of all calls
    async fetchAll() {
        const historySnapshot = await this.db.activeClubRef.collection("History").get();
        var history = [];
        historySnapshot.forEach(((doc) => {
            history.push(doc.data());
        }));
        return history;
    }

    // returns name, everUsed, and uses of a single call
    async fetchCall(name) {
        const snapshot = await this.db.activeClubRef.collection("History").where("name", "==", name).get();
        return snapshot.docs[0].data();
    }

    // returns all calls that have either been used or never been used
    async fetchByEverUsed(used) {
        const calls = [];
        const snapshot = await this.db.activeClubRef.collection("History").where("everUsed", "==", used).get();
        snapshot.docs.forEach((callDoc) => {
            calls.push(callDoc.data());
        });
        return await this.db.fetchDisplayData(calls);
    }

    // returns all calls that have only been used once
    async fetchNew() {
        var snapshot = await this.db.activeClubRef.get();
        return await this.db.fetchDisplayData(snapshot.data().newCalls);
    }

}

export default HistoryModel;