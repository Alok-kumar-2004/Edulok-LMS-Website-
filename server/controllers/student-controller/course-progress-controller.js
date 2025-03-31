
const CourseProgress = require('../../models/CourseProgress')
const Course = require('../../models/Course')
const StudentCourses = require('../../models/StudentCourses');

const currentLectureAsVeiwed = async(req,res)=>{
    try {
        const {userId,courseId,lectureId}=  req.body
        let progress = await CourseProgress.findOne({userId,courseId})

        if(!progress){
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress : [
                    {
                        lectureId,
                        viewed:true,
                        dateViewed : new Date()
                    }
                ]
            })

            await progress.save()
        }else{
            const lecturesProgress = progress.lecturesProgress.find((item) => item.lectureId === lectureId)

            if(lecturesProgress){
                lecturesProgress.viewed = true;
                lecturesProgress.dateViewed = new Date()
            }else{
                progress.lecturesProgress.push({
                    lectureId,
                    viewed:true,
                    dateViewed : new Date()
                })
            }
            await progress.save()
        }
        const course = await Course.findById(courseId)

        if(!course){
            res.status(404).json({
                success:false,
                message:"Some Error Occured"
            })
        }
        const allLecturesViewed = progress.lecturesProgress.length === course.curriculum.length && progress.lecturesProgress.every(item => item.viewed);

        if(allLecturesViewed){
            progress.completed = true,
            progress.completionDate = new Date()

            await progress.save()

            res.status(200).json({
                success : true,
                message : "Lecture marked as Viewed",
                data : progress
            })
        }
        
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
                    isPurchased: true,
                    // completed : true
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

        const {userId,courseId} = req.body;

        const progress =await CourseProgress.findOne ({userId,courseId})

        if(!progress){
            return res.status(400).json({
                success : true,
                message : 'Progress not Found'
            })
        }

        progress.lecturesProgress=[]
        progress.completed = false,
        progress.completionDate = null;

        await progress.save();

        res.status(200).json({
            success : true,
            message : "Course Progress has been reset.",
            data : progress
        })
        
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