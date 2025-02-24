
import CourseLanding from "@/components/instructor-veiw/courses/add-new-courses/course-landing";
import CourseSettings from "@/components/instructor-veiw/courses/add-new-courses/course-setting";
import  {Button, Card}  from "@radix-ui/themes";
import * as Tabs from "@radix-ui/react-tabs";
import CourseCurriculum from "@/components/instructor-veiw/courses/add-new-courses/course-curriculum";
import { useContext, useEffect } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import { addNewCourseService, fetchInstructorCourseDetailsService } from "@/services";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { useNavigate, useParams } from "react-router-dom";


// console.log("CourseLanding:", CourseLanding);
// console.log("CourseSettings:", CourseSettings);

function AddNewCoursePage() {
  const{courseLandingFormData,courseCurriculumFormData,setCourseLandingFormData,setCourseCurriculumFormData,
    currentEditedCourseId,setCurrentEditedCourseId
  }=useContext(InstructorContext)
  const{auth} = useContext(AuthContext)
  const navigate = useNavigate()
  const params  = useParams()


  function isEmpty(value){
    if (Array.isArray(value)){
      return value.length === 0
    }
    return value === "" || value === null ||value === undefined
  }
  function validateFormData(){
    for(const key in courseLandingFormData){
      if(isEmpty(courseLandingFormData[key])){
        return false;
      }
      let hasFreepreview = false
      for(const item of courseCurriculumFormData){
        if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)){
          return false;
        }
        if(item.freePreview){
          hasFreepreview = true
        }
      }
      return hasFreepreview
    }
  }
  async function handleCreateCourse() {
    const courseFinalFormData = {
    instructorId : auth?.user?._id,
    instructorName : auth?.user?.userName,
    date: new Date(),
    ...courseLandingFormData,
    students :[],
    curriculum : courseCurriculumFormData,
    isPublished : true,  
}
const response = await addNewCourseService(courseFinalFormData)
if(response?.success){
  setCourseLandingFormData(courseLandingInitialFormData)
  setCourseCurriculumFormData(courseCurriculumInitialFormData)
  navigate(-1)
}

}
async function fetchCurrentCourseDetails(){
  const response = await fetchInstructorCourseDetailsService(currentEditedCourseId)
  console.log(response);
  
}
  useEffect(()=>{
    if(currentEditedCourseId !== null ) fetchCurrentCourseDetails ()
  },[currentEditedCourseId])

  useEffect(()=>{
    if(params) setCurrentEditedCourseId(params?.courseId)
  },[params])
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create New Course</h1>
        <Button className="text-sm tracking-wider font-bold px-8"
        disabled={!validateFormData()}
        onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card className="p-6 shadow-md">
        <div className="container mx-auto p-4">
          <Tabs.Root defaultValue="curriculum">
            <Tabs.List className="flex gap-4 border-b pb-2">
              <Tabs.Trigger value="curriculum">Curriculum</Tabs.Trigger>
              <Tabs.Trigger value="course-landing-page">
                Course Landing Page
              </Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="curriculum">
              <CourseCurriculum />
            </Tabs.Content>
            <Tabs.Content value="course-landing-page">
              <CourseLanding />
            </Tabs.Content>
            <Tabs.Content value="settings">
              <CourseSettings />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;