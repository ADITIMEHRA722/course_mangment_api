// import mongoose from "mongoose";



// const userSchema = new mongoose.Schema({
//     first_name: { type: String, modelu: true },
//     last_name: { type: String, modelu: true },
//     email: { type: String, modelu: true, unique: true },
//     mobile_number: { type: String, modelu: false },
//     age: { type: Number, modelu: false },
//     dob: { type: Date, modelu: false },
//     address: {
//         country: { type: String, modelu: false },
//         state: { type: String, modelu: false },
//         pincode: { type: String, modelu: false }
//     },
//     highest_education: { type: String, modelu: false },
//     current_job: { type: String, modelu: false },
//     profile_picture: { type: String, modelu: false },
//     custom_fields: { type: Object, modelu: false }
// });

// export default mongoose.model('User', userSchema);


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     first_name: { type: String, required: true },  // Changed 'modelu' to 'required'
//     last_name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },    // Added password field for authentication
//     mobile_number: { type: String, required: false },  // Optional field
//     age: { type: Number, required: false },
//     dob: { type: Date, required: false },
//     address: {
//         country: { type: String, required: false },
//         state: { type: String, required: false },
//         pincode: { type: String, required: false }
//     },
//     highest_education: { type: String, required: false },
//     current_job: { type: String, required: false },
//     profile_picture: { type: String, required: false },
//     custom_fields: { type: Object, required: false },
//     role: { type: String, enum: ['admin', 'user'], default: 'user' }  // Role with enum values
// });

// const User = mongoose.model('User', userSchema);

// export default User;



import mongoose from 'mongoose';

// // Schema for Custom Fields added by admin
// const customFieldSchema = new mongoose.Schema({
//     title: { type: String, required: true },     // Custom field name
//     field_type: { type: mongoose.Schema.Types.Mixed, required: true  } // text, dropdown, image, checkbox, etc.
// });



// Schema for User with added fields and custom fields
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile_number: { type: String, required: false },
    age: { type: Number, required: false },
    dob: { type: String, required: false },
    address: {
        country: { type: String, required: false },
        state: { type: String, required: false },
        pincode: { type: String, required: false }
    },
    highest_education: { type: String, required: false },
    current_job: { type: String, required: false },
    profile_picture: { type: String, required: false },
    token: { type: String } ,
    custom_fields: [{
        title: { type: String, required: false },   // Field Name of Custom Field
        field_type: { type: mongoose.Schema.Types.Mixed, required: false } // Field Value can be string, number, etc.
    }],
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export const User = mongoose.model('User', userSchema);
//export const CustomField = mongoose.model('CustomField', customFieldSchema);

