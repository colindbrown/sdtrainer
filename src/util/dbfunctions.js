import { db } from "../db";
import { totalCalls, AllCalls } from "./calls";


// references
var activeClubRef;
const AllCallsRef = db.collection("AllCalls");
var ClubsRef;
var TemplatesRef;

// General methods

// takes an array of calls with names and returns an array of just names and groups
export async function displayData(calls) {
    const allCalls = await fetchAllCalls();
    var history = [];
    var sessions = [];
    if (activeClubRef) {
        const historySnapshot = await activeClubRef.collection("History").get();
        historySnapshot.forEach(((doc) => {
            history.push(doc.data());
        }));
        sessions = await fetchAllSessions();
    }

    var callsData = [];
    calls.forEach((call) => {
        var callData = allCalls.find((iterator) => (call.name === iterator.name))
        const callHistory = history.find((iterator) => (call.name === iterator.name));
        if (activeClubRef) {
            callData.uses = callHistory.uses.length;
            if (callData.uses) {
                const session = sessions.find((sessionIterator) => (sessionIterator.id === callHistory.uses[callHistory.uses.length-1]));
                callData.lastUsed = session.finishedAt;
            } else {
                callData.lastUsed = 0;
            }
        } else {
            callData.uses = 0;
            callData.lastUsed = 0;
        }
        callsData.push(callData);
    })
    return callsData;
}

export function namesArray(array) {
    var namesArray = [];
    array.forEach((element) => {
        namesArray.push(element.name);
    });
    return namesArray;
}

export async function setActiveUser(user) {
    const snapshot = await db.collection("Users").where("email", "==", user.email).get();
    var activeUserId;
    if (snapshot.size > 0) {
        activeUserId = snapshot.docs[0].id;
        ClubsRef = db.collection("Users").doc(activeUserId).collection("Clubs");
        TemplatesRef = db.collection("Users").doc(activeUserId).collection("Templates");
    }
}

export async function createUser(user) {
    const newUserRef = db.collection("Users").doc();
    newUserRef.set({
        email: user.email
    });
    return newUserRef;
}

// Club methods
export async function createNewClub(name) {
    const docRef = await ClubsRef.add({
        name: name,
        createdAt: Date.now(),
        sessions: 0,
        taught: 0
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

// sets the active club, returns the club
export async function setActiveClub(name) {
    const snapshot = await ClubsRef.where("name", "==", name).get();
    activeClubRef = snapshot.docs[0].ref;
    return snapshot.docs[0].data();
}

// gets the data of all clubs
export async function fetchClubData() {
    const snapshot = await ClubsRef.get();
    var clubs = [];
    snapshot.forEach((doc) => {
        clubs.push(doc.data());
    });
    return clubs;
}

// returns the data of the active club
export async function getActiveClub() {
    const snapshot = await activeClubRef.get();
    return snapshot.data();
}

// return class (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function checkClub(name) {
    const snapshot = await ClubsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].data();
    }
}

// deletes a club
export async function deleteClub(name) {
    const snapshot = await ClubsRef.where("name", "==", name).get();
    if (snapshot.size === 1) {
        snapshot.docs[0].ref.delete();
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
    snapshot.forEach((doc) => {
        allCalls.push(doc.data());
    });
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

// returns all calls in a given category
export async function fetchByCategory(category) {
    const calls = [];
    const snapshot = await AllCallsRef.where("category", "==", category).get();
    snapshot.docs.forEach((callDoc) => {
        calls.push(callDoc.data());
    });
    return calls;
}

// History methods

// returns name, everUsed, and uses of a single call
export async function fetchCallHistory(name) {
    const snapshot = await activeClubRef.collection("History").where("name", "==", name).get();
    return snapshot.docs[0].data();
}

// returns all calls that have either been used or never been used
export async function fetchByEverUsed(used) {
    const calls = [];
    const snapshot = await activeClubRef.collection("History").where("everUsed", "==", used).get();
    snapshot.docs.forEach((callDoc) => {
        calls.push(callDoc.data());
    });
    return calls;
}

// returns all calls that have only been used once
export async function fetchNew() {
    var snapshot = await activeClubRef.get();
    return snapshot.data().newCalls;
}

// updates the everUsed and uses data for all provided calls
export async function updateHistory(sessionName, calls) {
    var batch = db.batch();
    var snapshot = await activeClubRef.collection("History").get();
    const session = await fetchSessionData(sessionName);
    var newCalls = [];
    snapshot.docs.forEach((callDoc) => {
        const prev = callDoc.data();
        const call = calls.find((callIterator) => (callIterator.name === prev.name));
        if (call) {
            if (!prev.everUsed && call.everUsed) {
                newCalls.push(call);
            }
            const uses = call.everUsed ? prev.uses.concat([session.id]) : prev.uses;
            batch.update(callDoc.ref, {
                everUsed: (call.everUsed || prev.everUsed),
                uses: uses,
                name: call.name
            });
        }
    });
    batch.commit();
    activeClubRef.get().then((clubSnapshot) => {
        activeClubRef.update({ newCalls: newCalls, taught: clubSnapshot.data().taught + newCalls.length });
    })
}

// Session methods

// returns an array of all session names
export async function fetchSessionNames() {
    const snapshot = await activeClubRef.collection("Sessions").get();
    var sessionNames = [];
    snapshot.forEach((doc) => {
        sessionNames.push(doc.data().name);
    });
    return sessionNames;
}

// returns an array of all unfinished sessions
export async function fetchUnfinishedSessions() {
    const snapshot = await activeClubRef.collection("Sessions").where("finished", "==", false).get();
    var sessions = [];
    snapshot.forEach((doc) => {
        sessions.push(doc.data());
    });
    return sessions;
}

// returns an array of all finished sessions
export async function fetchfinishedSessions() {
    const snapshot = await activeClubRef.collection("Sessions").where("finished", "==", true).get();
    var sessions = [];
    snapshot.forEach((doc) => {
        sessions.push(doc.data());
    });
    return sessions;
}

// returns an array of the names of all unfinished sessions
export async function fetchUnfinishedSessionNames() {
    const snapshot = await activeClubRef.collection("Sessions").where("finished", "==", false).get();
    var sessionNames = [];
    snapshot.forEach((doc) => {
        sessionNames.push(doc.data().name);
    });
    return sessionNames;
}

// returns an array of the names of all finished sessions
export async function fetchFinishedSessionNames() {
    const snapshot = await activeClubRef.collection("Sessions").where("finished", "==", true).get();
    var sessionNames = [];
    snapshot.forEach((doc) => {
        sessionNames.push(doc.data().name);
    });
return sessionNames;
}

// return session (a DocumentSnapshot) if it exists, undefined if it doesnt
export async function fetchSessionRef(name) {
    const sessionsRef = activeClubRef.collection("Sessions")
    const snapshot = await sessionsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].ref;
    }
}

// return session data for a specific session
export async function fetchSessionData(name) {
    const sessionsRef = activeClubRef.collection("Sessions")
    const snapshot = await sessionsRef.where("name", "==", name).get();
    if (snapshot.size === 0) {
        return undefined;
    } else {
        return snapshot.docs[0].data();
    }
}

// return session data for a specific session
export async function fetchAllSessions(name) {
    const sessionsRef = activeClubRef.collection("Sessions")
    const snapshot = await sessionsRef.get();
    var sessions = [];
    snapshot.forEach((doc) => {
        sessions.push(doc.data());
    })
    return sessions;
}

// return array of calls in a session with name, used, and timestamp
export async function fetchSessionCalls(name) {
    const sessionRef = await fetchSessionRef(name);
    const snapshot = await sessionRef.collection("Calls").get();
    var sessionCalls = []
    snapshot.forEach((doc) => {
        const call = doc.data();
        sessionCalls.push(call);
    });
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
        const newSession = activeClubRef.collection("Sessions").doc();
        const activeClub = await getActiveClub();
        newSession.set({ name: name, createdAt: Date.now(), finished: false, id: activeClub.sessions });
        activeClubRef.update({sessions: (activeClub.sessions + 1)});
        for (var i = 0; i < calls.length; i++) {
            const ref = await newSession.collection("Calls").add(calls[i]);
            ref.update({position: i});
        }
    }
}

// deletes a session
export async function deleteSession(name) {
    const ref = await fetchSessionRef(name);
    activeClubRef.collection("Sessions").doc(ref.id).delete();
}

// Template methods
// returns an array of all Template names
export async function fetchTemplateNames() {
    const snapshot = await TemplatesRef.get();
    var templateNames = [];
    snapshot.forEach((doc) => {
        templateNames.push(doc.data().name);
    });
    return templateNames;
}

export async function fetchTemplates() {
    const snapshot = await TemplatesRef.get();
    var templates = [];
    snapshot.forEach(((doc) => {
        templates.push(doc.data());
    }));
    return templates;
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
    snapshot.forEach((doc) => {
        const call = doc.data();
        templateCalls.push(call);
    });
    return templateCalls;
}

// creates or updates a template with the provided calls
export async function setTemplate(name, calls) {
    var template = await fetchTemplateRef(name);
    if (template) {
        // modify templates
    } else {
        const newTemplate = TemplatesRef.doc();
        newTemplate.set({ name: name, createdAt: Date.now() });
        for (var i = 0; i < calls.length; i++) {
            const ref = await newTemplate.collection("Calls").add(calls[i]);
            ref.update({position: i});
        }
    }
}

// delete template
export async function deleteTemplate(name) {
    const templateRef = await fetchTemplateRef(name);
    TemplatesRef.doc(templateRef.id).delete();
}

export { totalCalls };