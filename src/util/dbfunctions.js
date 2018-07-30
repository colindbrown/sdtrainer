import { dbRef } from "../db";
import CallsModel from "./dbModels/CallsModel";
import UserModel from "./dbModels/UserModel";
import HistoryModel from "./dbModels/HistoryModel";
import ClubModel from "./dbModels/ClubModel";
import SessionModel from "./dbModels/SessionModel";
import TemplatesModel from "./dbModels/TemplatesModel";

class Database {
    constructor(dbRef) {
        this.dbRef = dbRef;
        this.calls = new CallsModel(this);
        this.users = new UserModel(this);
        this.history = new HistoryModel(this);
        this.clubs = new ClubModel(this);
        this.sessions = new SessionModel(this);
        this.templates = new TemplatesModel(this);
    }

    // return an array of just names from the provided array
    createNamesArray(array) {
        var namesArray = [];
        array.forEach((element) => {
            namesArray.push(element.name);
        });
        return namesArray;
    }

    // takes an array with names and return an array of calls with all relevant data
    async fetchDisplayData(calls) {
        const allCalls = await this.calls.fetchAll();
        var history = [];
        var sessions = [];
        if (this.activeClubRef) {
            history = await this.history.fetchAll();
            sessions = await this.sessions.fetchAll();
        }

        var callsData = [];
        calls.forEach((call) => {
            var callData = allCalls.find((iterator) => (call.name === iterator.name))
            const callHistory = history.find((iterator) => (call.name === iterator.name));
            if (this.activeClubRef) {
                callData.uses = callHistory.uses.length;
                if (callData.uses) {
                    const session = sessions.find((sessionIterator) => (sessionIterator.name === callHistory.uses[callHistory.uses.length-1]));
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

}

const db = new Database(dbRef);

export { db }; 