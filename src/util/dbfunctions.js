import { db } from "../db";


// references
const sampleClassRef = db.collection("Users").doc("updated").collection("Classes").doc("p7EqFLm39vsfTUaKZLtm")
const AllCallsRef = db.collection("AllCalls");

// General methods

// takes an array of calls with names and returns an array of just names and groups
export async function displayData(calls) {
    const allCalls = await fetchAllCalls();
    return calls.map((call) => allCalls.find((iterator) => (call.name === iterator.name)));
}

// Class methods
export async function createNewClass(name) {
    const docRef = await db.collection("Users").doc("updated").collection("Classes").add({
        name: name
    })
    const allCalls = await fetchAllCalls();
    allCalls.forEach((call) => {
        docRef.collection("History").add({
            name: call.name,
            everUsed: false,
            uses: []
        })
    })
}

// AllCalls methods

// returns displayData of all calls
export async function fetchAllCalls() {
    const snapshot = await AllCallsRef.get();
    const allCalls = [];
    snapshot.forEach(((doc) => {
        allCalls.push(doc.data());
    }));
    return allCalls;
}

// History methods

// returns name, everUsed, and uses of a single call
export async function fetchCallHistory(name) {
    const snapshot = await sampleClassRef.collection("History").where("name", "==", name).get();
    return snapshot.docs[0].data();
}

// returns all calls that have either been used or never been used
export async function fetchByEverUsed(used) {
    const calls = [];
    const snapshot = await sampleClassRef.collection("History").where("everUsed", "==", used).get();
    snapshot.docs.forEach((callDoc) => {
        calls.push(callDoc.data());
    });
    return calls;
}

// updates the everUsed and uses data for all provided calls
export async function updateHistory(calls) {
    var batch = db.batch();
    var snapshot = await sampleClassRef.collection("History").get();
    snapshot.docs.forEach((callDoc) => {
        const prev = callDoc.data();
        const call = calls.find((callIterator) => (callIterator.name === prev.name));
        if (call) {
            const uses = call.everUsed ? prev.uses.concat(call.uses) : prev.uses;
            batch.update(callDoc.ref, { everUsed: (call.everUsed || prev.everUsed), uses: uses, name: call.name });
        }
    });
    batch.commit();
}

// Collection methods

// returns an array of all collection names
export async function fetchCollectionNames() {
    const snapshot = await sampleClassRef.collection("Collections").get();
    var collectionNames = [];
    snapshot.forEach(((doc) => {
        collectionNames.push(doc.data().name);
    }));
    return collectionNames;
}

// return collection (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function fetchCollectionRef(name) {
    const collectionsRef = sampleClassRef.collection("Collections")
    const snapshot = await collectionsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].ref;
    }
}

// return array of calls in a collection with name, used, and timestamp
export async function fetchCollectionCalls(name) {
    const collectionRef = await fetchCollectionRef(name);
    const snapshot = await collectionRef.collection("Calls").get();
    var collectionCalls = []
    snapshot.forEach(((doc) => {
        const call = doc.data();
        collectionCalls.push(call);
    }));
    return collectionCalls;
}

// creates or updates a collection with the provided calls
export async function setCollection(name, calls) {
    var collection = await fetchCollectionRef(name);
    if (collection) {
        var batch = db.batch();
        var snapshot = await collection.collection("Calls").get();
        snapshot.docs.forEach((callDoc) => {
            const call = calls.find((callIterator) => (callIterator.name === callDoc.data().name));
            batch.update(callDoc.ref, { used: call.used, timestamp: call.timestamp });
        });
        batch.commit();
    } else {
        const newCollection = sampleClassRef.collection("Collections").doc();
        newCollection.set({ name: name });
        calls.forEach((call) => newCollection.collection("Calls").add(call));
    }
}