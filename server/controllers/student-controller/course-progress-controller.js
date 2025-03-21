
const CourseProgress = require('../../models/CourseProgress')
const Course = require('../../models/Course')
const StudentCourses = require('../../models/StudentCourses');

const currentLectureAsVeiwed = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured !'
        })
    }
}

const getCurrentCourseProgress = async(req,res)=>{
    try {
        const {userId,courseId} = req.params;
        const studentPurchasedCourses = await StudentCourses.findOne({userId})
        const isCurrentCoursePurchsedByCurrentUser = studentPurchasedCourses?.courses?.findIndex((item) => item.courseId === courseId)>-1 
        if(!isCurrentCoursePurchsedByCurrentUser){
            res.status(200).json({
                success:true,
                data:{
                    isPurchased : false,
                },
                message : "You need to Purchase this Course to Access it"
            })
        }
        const currentUserCourseProgress = await CourseProgress.findOne({userId,courseId})

        if(!currentUserCourseProgress||currentUserCourseProgress?.lecturesProgress?.length===0){
            const course = await Course.findById(courseId)

            if(!course){
                return res.status(404).json({
                    success : false,
                    message : 'Course not Found'
                })
            }
            return res.status(200).json({
                success : true,
                message : 'No progress found, you can start watching the course.',
                data : {
                    courseDetails : course,
                    progress : [],
                    isPurchased: true
                }
            })
        }

        const courseDetails = await Course.findById(courseId)

        res.status(200).json({
            success:true,
            data :{
                courseDetails ,
                progress : currentUserCourseProgress.lecturesProgress,
                completed : currentUserCourseProgress.completed,
                completionDate:currentUserCourseProgress.completionDate,
                isPurchased : true
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured !'
        })
    }
}

const resetCurrentCourseProgress = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured !'
        })
    }
}

module.exports={
    currentLectureAsVeiwed,
    getCurrentCourseProgress,resetCurrentCourseProgress,

}