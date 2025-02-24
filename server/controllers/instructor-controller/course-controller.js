const Course = require('../../models/Course')
const addNewCourse = async (req,res) => {
    try {
        const courseData = req.body
        const newlyCreatedCourse = new Course(courseData)
        const saveCourse = await newlyCreatedCourse.save();
        if(saveCourse){
            res.status(201).json({
                success : true,
                message : 'Course added Successfully',
                data : saveCourse
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured'
        })
        
    }
}
const getAllCourses = async (req,res) => {
    try {
        const coursesList = await Course.find({})
        res.status(200).json({
            success : true,
            data : coursesList
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured'
        })
        
    }
}
const  getCourseDetailsById = async (req,res) => {
    try {
        const {id} = req.params;
        const CourseDetails = await Course.findById(id) 
        if(!CourseDetails){
            res.status(404).json({
                success :false,
                message : 'Course not found !'
            })
        }
        res.status.json({
            success : true,
            data : CourseDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured'
        })
    }
}
const updateCourseById = async (req,res) => {
    try {
        const {id} = req.params
        const updatedCourseData = req.body
        const updateCourse = await Course.findByIdAndUpdate(id,updatedCourseData , {new : true} )
        if(!updateCourse){
            return res.status(404).json({
                success : false,
                message : "Course not found!",
            })
        }
        res.status(200).json({
            success : true,
            message : 'Course updated SuccessFully',
            data : updateCourse
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error Occured'
        })
        
    }
}
module.exports ={addNewCourse,getAllCourses,getCourseDetailsById,updateCourseById}