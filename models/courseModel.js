import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    module_name: { type: String, required: true },
    module_description: { type: String, default: '' }  // Optional
});

const courseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    course_description: { type: String, required: true },
    course_fee: { type: Number, required: true },
    course_thumbnail: { type: String },  // URL or file path
    course_duration: { type: String, required: true },  // e.g., weeks or months
    course_curriculum: { type: String, required: true },
    last_updated: { type: Date, default: Date.now },
    instructor_name: { type: String, required: true },
    modules: [moduleSchema]
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
