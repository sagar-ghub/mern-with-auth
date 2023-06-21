const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      required: true,
      trim: true,
    },
    courseFee: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    courseImage: {
      type: String,
      required: true,
      trim: true,
    },
    //TODO

    courseVideo: {
      type: String,
      required: true,
      trim: true,
    },
    courseStatus: {
      type: String,
      required: true,
      trim: true,
    },
    courseCategory: {
      type: String,
      required: true,
      trim: true,
    },
    courseSubCategory: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Course = new mongoose.model("Course", courseSchema);

module.exports = Course;
