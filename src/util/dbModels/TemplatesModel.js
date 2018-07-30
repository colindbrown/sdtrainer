class TemplatesModel {

    constructor(db) {
        this.db = db;
    }

    // lifecycle methods

    // create a template with the provided calls
    async create(name, calls) {
        const newTemplate = this.db.TemplatesRef.doc();
        newTemplate.set({ name: name, createdAt: Date.now() });
        for (var i = 0; i < calls.length; i++) {
            const ref = await newTemplate.collection("Calls").add(calls[i]);
            ref.update({position: i});
        }
    }

    // delete template
    async delete(name) {
        const templateRef = await this.fetchRef(name);
        const snapshot = await templateRef.collection("Calls").get();
        snapshot.docs.forEach((doc) => doc.ref.delete());
        templateRef.delete();
    }

    // accessor methods

    // return all templates
    async fetchAll() {
        const snapshot = await this.db.TemplatesRef.get();
        var templates = [];
        snapshot.forEach(((doc) => {
            templates.push(doc.data());
        }));
        return templates;
    }

    // returns an array of all template names
    async fetchNames() {
        const templates = await this.fetchAll();
        return this.db.createNamesArray(templates);
    }

    // return template (a DocumentSnapshot) if it exists, undefined if it doesnt
    async fetchRef(name) {
        const snapshot = await this.db.TemplatesRef.where("name", "==", name).get();
        if (snapshot.size === 0) {
            return undefined;
        } else {
            return snapshot.docs[0].ref;
        }
    }

    // return array of calls in a template with names
    async fetchCalls(name) {
        const templateRef = await this.fetchRef(name);
        const snapshot = await templateRef.collection("Calls").get();
        var templateCalls = []
        snapshot.forEach((doc) => {
            const call = doc.data();
            templateCalls.push(call);
        });
        return await this.db.fetchDisplayData(templateCalls);
    }

    // return if a template with the provided name exists
    async check(name) {
        const snapshot = await this.db.TemplatesRef.where("name", "==", name).get();
        return snapshot.size === 1;
    }

}

export default TemplatesModel;