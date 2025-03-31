
const express =require('express')
const{ currentLectureAsVeiwed,
    getCurrentCourseProgress,resetCurrentCourseProgress} = require('../../controllers/student-controller/course-progress-controller')

const router = express.Router()

router.get('/get/:userId/:courseId',getCurrentCourseProgress)
router.post('/mark-lecture-viewed',currentLectureAsVeiwed)
router.post('/reset-progress',resetCurrentCourseProgress)


module.exports = router