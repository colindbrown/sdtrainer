import { db } from "../db";
import { AllCalls } from "./calls";


// references
var activeClassRef;
const AllCallsRef = db.collection("AllCalls");
var ClassesRef;
var TemplatesRef;

// General methods

// takes an array of calls with names and returns an array of just names and groups
export async function displayData(calls) {
    const allCalls = await fetchAllCalls();
    return calls.map((call) => allCalls.find((iterator) => (call.name === iterator.name)));
}

export async function setActiveUser(user) {
    const snapshot = await db.collection("Users").where("email", "==", user.email).get();
    var activeUserId;
    if (snapshot.size > 0) {
        activeUserId = snapshot.docs[0].id;
        ClassesRef = db.collection("Users").doc(activeUserId).collection("Classes");
        TemplatesRef = db.collection("Users").doc(activeUserId).collection("Templates");
    }
}

export async function createUser(user) {
    const newUserRef = db.collection("Users").doc();
    newUserRef.set({email: user.email});
    return newUserRef;
}

// Class methods
export async function createNewClass(name) {
    const docRef = await ClassesRef.add({
        name: name,
        createdAt: Date.now()
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

// sets the active class, returns the class
export async function setActiveClass(name) {
    const snapshot = await ClassesRef.where("name", "==", name).get();
    activeClassRef = snapshot.docs[0].ref;
    return snapshot.docs[0].data();
}

// gets the data of all classes
export async function fetchClassData() {
    const snapshot = await ClassesRef.get();
    var classes = [];
    snapshot.forEach(((doc) => {
        classes.push(doc.data());
    }));
    return classes;
}

// return class (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function checkClass(name) {
    const snapshot = await ClassesRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].data();
    }
}


// AllCalls methods

// adds all calls to the database
export async function addAllCalls() {
    Object.keys(AllCalls).forEach((category) => {
        Object.keys(AllCalls[category]).forEach((group) => {
            AllCalls[category][group].forEach((name) => {
                AllCallsRef.add({
                    name: name,
                    group: parseInt(group),
                    category: category
                })
            })
        })
    })
}

// returns displayData of all calls
export async function fetchAllCalls() {
    const snapshot = await AllCallsRef.get();
    const allCalls = [];
    snapshot.forEach(((doc) => {
        allCalls.push(doc.data());
    }));
    return allCalls;
}

// returns displayData of all calls with a specific group
export async function fetchByGroup(group) {
    const calls = [];
    const snapshot = await AllCallsRef.where("group", "==", group).get();
    snapshot.docs.forEach((callDoc) => {
        calls.push(callDoc.data());
    });
    return calls;
}

// History methods

// returns name, everUsed, and uses of a single call
export async function fetchCallHistory(name) {
    const snapshot = await activeClassRef.collection("History").where("name", "==", name).get();
    return snapshot.docs[0].data();
}

// returns all calls that have either been used or never been used
export async function fetchByEverUsed(used) {
    const calls = [];
    const snapshot = await activeClassRef.collection("History").where("everUsed", "==", used).get();
    snapshot.docs.forEach((callDoc) => {
        calls.push(callDoc.data());
    });
    return calls;
}

// returns all calls that have only been used once
export async function fetchNew() {
    var calls = await fetchByEverUsed(true);
    return calls.filter((call) => (call.uses.length === 1))
}

// updates the everUsed and uses data for all provided calls
export async function updateHistory(calls) {
    var batch = db.batch();
    var snapshot = await activeClassRef.collection("History").get();
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

// Session methods

// returns an array of all session names
export async function fetchSessionNames() {
    const snapshot = await activeClassRef.collection("Sessions").get();
    var sessionNames = [];
    snapshot.forEach(((doc) => {
        sessionNames.push(doc.data().name);
    }));
    return sessionNames;
}

// returns an array of the names of all unfinished sessions
export async function fetchUnfinishedSessionNames() {
    const snapshot = await activeClassRef.collection("Sessions").where("finished", "==", false).get();
    var sessionNames = [];
    snapshot.forEach(((doc) => {
        sessionNames.push(doc.data().name);
    }));
    return sessionNames;
}

// returns an array of the names of all finished sessions
export async function fetchFinishedSessionNames() {
    const snapshot = await activeClassRef.collection("Sessions").where("finished", "==", true).get();
    var sessionNames = [];
    snapshot.forEach(((doc) => {
        sessionNames.push(doc.data().name);
    }));
    return sessionNames;
}

// return session (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function fetchSessionRef(name) {
    const sessionsRef = activeClassRef.collection("Sessions")
    const snapshot = await sessionsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].ref;
    }
}

// return array of calls in a session with name, used, and timestamp
export async function fetchSessionCalls(name) {
    const sessionRef = await fetchSessionRef(name);
    const snapshot = await sessionRef.collection("Calls").get();
    var sessionCalls = []
    snapshot.forEach(((doc) => {
        const call = doc.data();
        sessionCalls.push(call);
    }));
    return sessionCalls;
}

// creates or updates a session with the provided calls
export async function setSession(name, calls) {
    var session = await fetchSessionRef(name);
    if (session) {
        var batch = db.batch();
        var snapshot = await session.collection("Calls").get();
        snapshot.docs.forEach((callDoc) => {
            const call = calls.find((callIterator) => (callIterator.name === callDoc.data().name));
            batch.update(callDoc.ref, { used: call.used, timestamp: call.timestamp });
        });
        batch.update(session, { finished: true, finishedAt: Date.now() })
        batch.commit();
    } else {
        const newSession = activeClassRef.collection("Sessions").doc();
        newSession.set({ name: name, createdAt: Date.now(), finished: false });
        calls.forEach((call) => newSession.collection("Calls").add(call));
    }
}

// Template methods
// returns an array of all Template names
export async function fetchTemplateNames() {
    const snapshot = await TemplatesRef.get();
    var templateNames = [];
    snapshot.forEach(((doc) => {
        templateNames.push(doc.data().name);
    }));
    return templateNames;
}

// return template (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function fetchTemplateRef(name) {
    const snapshot = await TemplatesRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].ref;
    }
}

// return array of calls in a template with names
export async function fetchTemplateCalls(name) {
    const templateRef = await fetchTemplateRef(name);
    const snapshot = await templateRef.collection("Calls").get();
    var templateCalls = []
    snapshot.forEach(((doc) => {
        const call = doc.data();
        templateCalls.push(call);
    }));
    return templateCalls;
}

// creates or updates a template with the provided calls
export async function setTemplate(name, calls) {
    var template = await fetchTemplateRef(name);
    if (template) {
        // modify templates
        console.log("")
    } else {
        const newTemplate = TemplatesRef.doc();
        newTemplate.set({ name: name, createdAt: Date.now() });
        calls.forEach((call) => newTemplate.collection("Calls").add(call));
    }
}