const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, modelu: true },
    last_name: { type: String, modelu: true },
    email: { type: String, modelu: true, unique: true },
    mobile_number: { type: String, modelu: false },
    age: { type: Number, modelu: false },
    dob: { type: Date, modelu: false },
    address: {
        country: { type: String, modelu: false },
        state: { type: String, modelu: false },
        pincode: { type: String, modelu: false }
    },
    highest_education: { type: String, modelu: false },
    current_job: { type: String, modelu: false },
    profile_picture: { type: String, modelu: false },
    custom_fields: { type: Object, modelu: false }
});

export default mongoose.model('User', userSchema);
