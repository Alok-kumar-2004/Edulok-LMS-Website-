const express = require('express')
const{getCoursesByStudentId}=require('../../controllers/student-controller/student-course-controller')

const router = express.Router();

router.get('/get/:studentId',getCoursesByStudentId)

module.exports = router