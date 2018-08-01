import { callCount, AllCalls } from "../calls";

class CallsModel {

    constructor(db) {
        this.db = db;
        this.AllCallsRef = db.dbRef.collection("AllCalls");
        this.count = callCount;
    }

    // lifecycle methods

    // add all calls to the database
    async addAll() {
        Object.keys(AllCalls).forEach((category) => {
            Object.keys(AllCalls[category]).forEach((group) => {
                AllCalls[category][group].forEach((name) => {
                    this.AllCallsRef.add({
                        name: name,
                        group: parseInt(group, 10),
                        category: category
                    })
                })
            })
        })
    }

    // accessor methods

    // return display data of all calls
    async fetchAll() {
        const snapshot = await this.AllCallsRef.get();
        const allCalls = [];
        snapshot.forEach((doc) => {
            allCalls.push(doc.data());
        });
        return await this.db.fetchDisplayData(allCalls);
    }

    // return AllCalls data of calls (name, group, category)
    async fetchData() {
        const snapshot = await this.AllCallsRef.get();
        const allCalls = [];
        snapshot.forEach((doc) => {
            allCalls.push(doc.data());
        });
        return allCalls;
    }

    // return just names of all the calls
    async fetchNames() {
        const calls = await this.fetchData();
        return this.db.createNamesArray(calls);
    }

    // return data of all calls with a specific group
    async fetchByGroup(group) {
        const calls = [];
        const snapshot = await this.AllCallsRef.where("group", "==", group).get();
        snapshot.docs.forEach((callDoc) => {
            calls.push(callDoc.data());
        });
        return await this.db.fetchDisplayData(calls);
    }

    // return all calls in a given category
    async fetchByCategory(category) {
        const calls = [];
        const snapshot = await this.AllCallsRef.where("category", "==", category).get();
        snapshot.docs.forEach((callDoc) => {
            calls.push(callDoc.data());
        });
        return await this.db.fetchDisplayData(calls);
    }
        
}

export default CallsModel;