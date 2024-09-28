import express from "express";
import Course from "../models/courseModel.js";
import multer from "multer";
import path from "path";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

// Multer Filter for Image Files
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed!"), false);
  }
  cb(null, true);
};

// Apply multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Add Course (POST) - Admin Only
router.post(
  "/add-course",
  auth,
  adminAuth,
  upload.single("course_thumbnail"),
  async (req, res) => {
    const {
      course_name,
      course_description,
      course_fee,
      course_duration,
      course_curriculum,
      instructor_name,
      course_thumbnail, // Add this line to get it from req.body
    } = req.body;

    try {
      const newCourse = new Course({
        course_name,
        course_description,
        course_fee,
        course_thumbnail: req.file ? req.file.path : course_thumbnail, // Use file path if uploaded, otherwise use URL from req.body
        course_duration,
        course_curriculum,
        instructor_name,
      });

      await newCourse.save();

      // Send response including course ID
      res.status(201).json({
        success: true,
        message: "Course created",
        course: {
          id: newCourse._id, // Include course ID in the response
          ...newCourse.toObject(), // Convert Mongoose document to plain object
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);



// Edit Course (PUT) - Admin Only
router.put("/update/:id", auth, adminAuth, upload.single("course_thumbnail"),
  async (req, res) => {
    const {
      course_name,
      course_description,
      course_fee,
      course_duration,
      course_curriculum,
      instructor_name,
      course_thumbnail,
    } = req.body;
    const courseId = req.params.id;

    try {
      // Find the course by ID
      let course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      // Update course details
      course.course_name = course_name || course.course_name;
      course.course_description =
        course_description || course.course_description;
      course.course_fee = course_fee || course.course_fee;
      course.course_duration = course_duration || course.course_duration;
      course.course_curriculum = course_curriculum || course.course_curriculum;
      course.instructor_name = instructor_name || course.instructor_name;

      // Handle course_thumbnail update (file or URL)
      if (req.file) {
        course.course_thumbnail = req.file.path; // Update with file path if uploaded
      } else if (course_thumbnail) {
        course.course_thumbnail = course_thumbnail; // Update with URL string if provided
      }

      course.last_updated = Date.now();

      // Save the updated course
      await course.save();
      res
        .status(200)
        .json({ success: true, message: "Course updated", course });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// Delete Course (DELETE) - Admin Only
router.delete("/delete/:id",  auth, adminAuth, async (req, res) => {
  const courseId = req.params.id;

  try {
    // Find the course by ID
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Optionally: You can remove the course_thumbnail file from the server if it was uploaded.
    // For example, using 'fs.unlink' for file deletion.
    // if (course.course_thumbnail && course.course_thumbnail.includes('uploads/')) {
    //     fs.unlink(course.course_thumbnail, (err) => {
    //         if (err) console.log(err);
    //     });
    // }

    res.status(200).json({ success: true, message: "Course deleted", course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add Module (POST) - Admin Only
router.post("/:course_id/module",  auth, adminAuth, async (req, res) => {
  const { module_name, module_description } = req.body;

  try {
    const course = await Course.findById(req.params.course_id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    course.modules.push({ module_name, module_description });
    await course.save();
    res.status(201).json({ success: true, message: "Module added ", course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Edit Module (PUT) - Admin Only
router.put("/:course_id/module/:module_id",  auth, adminAuth, async (req, res) => {
  const { module_name, module_description } = req.body;

  try {
    const course = await Course.findById(req.params.course_id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const module = course.modules.id(req.params.module_id);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    module.module_name = module_name || module.module_name;
    module.module_description = module_description || module.module_description;

    await course.save();
    res.status(200).json({ success: true, message: "Module updated", course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete Module (DELETE) - Admin Only
router.delete("/:course_id/module/:module_id",  auth, adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Find the index of the module you want to delete
    const moduleIndex = course.modules.findIndex(
      (module) => module._id == req.params.module_id
    );
    if (moduleIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    // Remove the module using splice
    course.modules.splice(moduleIndex, 1);

    // Save the course after removing the module
    await course.save();

    res.status(200).json({ success: true, message: "Module deleted", course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Fetch Course Details (Including Modules)
router.get("/:course_id", async (req, res) => {
  try {
    const courseId = req.params.course_id;

    // Find the course by ID
    const course = await Course.findById(courseId).select("-__v"); // Exclude version field if present

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Send back the course details including modules
    res.status(200).json({
      success: true,
      course: {
        course_name: course.course_name,
        course_description: course.course_description,
        course_fee: course.course_fee,
        course_thumbnail: course.course_thumbnail,
        course_duration: course.course_duration,
        course_curriculum: course.course_curriculum,
        last_updated: course.last_updated,
        instructor_name: course.instructor_name,
        modules: course.modules.map((module) => ({
          module_name: module.module_name,
          module_description: module.module_description,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
