import { sampleClassRef, db } from "../db";

// AllCalls Database functions
export async function fetchAllCalls() {
    const snapshot = await sampleClassRef.collection("AllCalls").get();
    const allCalls = [];
    snapshot.forEach(((doc) => {
        allCalls.push(doc.data().displayData);
    }));
    return allCalls;
}

export async function updateAllCalls(calls) {
    var batch = db.batch();
    var snapshot = await sampleClassRef.collection("AllCalls").get();
    snapshot.docs.forEach((callDoc) => {
        const prev = callDoc.data();
        const call = calls.find((callIterator) => (callIterator.displayData.name === prev.displayData.name));
        if (call) {
            var uses = prev.uses || [];
            uses = call.everUsed ? uses.concat(call.uses) : uses;
            batch.update(callDoc.ref, { everUsed: (call.everUsed || prev.everUsed), uses: uses, displayData: call.displayData });
        }
    });
    batch.commit();
}

export async function fetchCall(name) {
    const snapshot = await sampleClassRef.collection("AllCalls").where("displayData.name", "==", name).get();
    return snapshot.docs[0].data();
}

// Collection Database functions
// return collection (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function findCollection(name) {
    const collectionsRef = sampleClassRef.collection("Collections")
    const snapshot = await collectionsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0];
    }
}

export async function fetchCollectionRef(name) {
    const collection = await findCollection(name);
    return collection ? collection.ref : undefined;
}

export async function fetchCollectionNames() {
    const snapshot = await sampleClassRef.collection("Collections").get();
    var collectionNames = [];
    snapshot.forEach(((doc) => {
        collectionNames.push(doc.data().name);
    }));
    return collectionNames;
}

export async function fetchCollectionCalls(name) {
    const collectionRef = await fetchCollectionRef(name);
    const snapshot = await collectionRef.collection("Calls").get();
    var collectionCalls = []
    snapshot.forEach(((doc) => {
        const call = doc.data().displayData;
        collectionCalls.push(call);
    }));
    return collectionCalls;
}

export async function setCollection(name, calls) {
    var collection = await fetchCollectionRef(name);
    if (collection) {
        var batch = db.batch();
        var snapshot = await collection.collection("Calls").get();
        snapshot.docs.forEach((callDoc) => {
            const call = calls.find((callIterator) => (callIterator.displayData.name === callDoc.data().displayData.name));
            batch.update(callDoc.ref, { used: call.used, timestamp: call.timestamp });
        });
        batch.commit();
    } else {
        const newCollection = sampleClassRef.collection("Collections").doc();
        newCollection.set({ name: name });
        calls.forEach((call) => newCollection.collection("Calls").add(call));
    }
}