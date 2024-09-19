const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
    title: { type: String, modelu: true },
    field_type: { type: String, modelu: true } // text, dropdown, image, checkbox
});

export default mongoose.model('CustomField', customFieldSchema);
