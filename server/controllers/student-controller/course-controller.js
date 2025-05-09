const Course = require('../../models/Course')
const StudentCourses = require('../../models/StudentCourses')

const getAllStudentViewCourses = async (req,res) =>{
    try {
        const{category=[],
            level=[],
            primaryLanguage=[],
            sortBy= "price-lowtohigh"
         } = req.query;
        
         
        
        let filters = {};
        if(category.length){
            filters.category={$in : category.split(',')}
        }
        if(level.length){
            filters.level={$in : level.split(',')}
        }
        if(primaryLanguage.length){
            filters.primaryLanguage={$in : primaryLanguage.split(',')}
        }

        let sortParams ={}
        switch (sortBy) {
          case "price-lowtohigh":
            sortParams.pricing = 1 
            break;

          case "price-hightolow":
            sortParams.pricing = -1
            break;

          case "title-atoz":
          sortParams.title =  1
            break;

          case "title-ztoa":
            sortParams.title = -1
            break;
          
          default:
            sortParams.pricing = 1;
            break;
        }
        const courseList = await Course.find(filters).sort(sortParams)
        
        res.status(200).json({
            success:true, 
            data : courseList
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message:"Some Error Occured"
        })
    }
    
}
const getStudentViewCourseDetails = async (req,res) =>{
    try {
        const {id} =req.params;
        const courseDetails = await Course.findById(id)

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"No Course details  Found",
                data :null
            })
        }

        res.status(200).json({
            success:true, 
            data : courseDetails,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message:"Some Error Occured"
        })
    }
    
}
const checkCoursePurchaseInfo = async (req,res)=>{
    try {
      const { id, studentId } = req.params;
      const studentCourses = await StudentCourses.findOne({
        userId: studentId,
      });
      // const ifStudentAlreadyBoughtCourse = 
      //   studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
      const ifStudentAlreadyBoughtCourse = studentCourses 
      ? studentCourses.courses.findIndex((item) => item.courseId === id) > -1
      : false;
      res.status(200).json({
        success: true,
        data: ifStudentAlreadyBoughtCourse,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
}
module.exports = {getAllStudentViewCourses,getStudentViewCourseDetails,checkCoursePurchaseInfo}