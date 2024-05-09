const mongoose = require('mongoose');

class AdminsSchema extends mongoose.Schema {
    constructor() {
        super({
            name: String,
            email: String,
            password: String
        });
    }
}

class AdminsModel {
    constructor() {
        this.model = mongoose.model('admins', new AdminsSchema());
    }

    findByEmail(email) {
        return this.model.findOne({ email });
    }
}

module.exports = new AdminsModel();
