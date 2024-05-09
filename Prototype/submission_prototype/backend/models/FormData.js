const mongoose = require('mongoose');

class UserSchema extends mongoose.Schema {
    constructor() {
        super({
            name: String,
            email: String,
            password: String
        });
    }
}

class UserModel {
    constructor() {
        this.model = mongoose.model('patients', new UserSchema());
    }

    findByEmail(email) {
        return this.model.findOne({ email });
    }

    createPatient(data) {
        return this.model.create(data);
    }
}

module.exports = new UserModel();
