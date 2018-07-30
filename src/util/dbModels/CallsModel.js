import { totalCalls, AllCalls } from "../calls";

class CallsModel {

    constructor(db) {
        this.db = db;
        this.AllCallsRef = db.dbRef.collection("AllCalls");
        this.totalCalls = totalCalls;
    }

    // lifecycle methods

    // add all calls to the database
    async addAllCalls() {
        Object.keys(AllCalls).forEach((category) => {
            Object.keys(AllCalls[category]).forEach((group) => {
                AllCalls[category][group].forEach((name) => {
                    this.AllCallsRef.add({
                        name: name,
                        group: parseInt(group),
                        category: category
                    })
                })
            })
        })
    }

    // accessor methods

    // return data of all calls
    async fetchAllCalls() {
        const snapshot = await this.AllCallsRef.get();
        const allCalls = [];
        snapshot.forEach((doc) => {
            allCalls.push(doc.data());
        });
        return allCalls;
    }

    // return data of all calls with a specific group
    async fetchByGroup(group) {
        const calls = [];
        const snapshot = await this.AllCallsRef.where("group", "==", group).get();
        snapshot.docs.forEach((callDoc) => {
            calls.push(callDoc.data());
        });
        return calls;
    }

    // returns all calls in a given category
    async fetchByCategory(category) {
        const calls = [];
        const snapshot = await this.AllCallsRef.where("category", "==", category).get();
        snapshot.docs.forEach((callDoc) => {
            calls.push(callDoc.data());
        });
        return calls;
    }
        
}

export default CallsModel;