import CourseLanding from "@/components/instructor-veiw/courses/add-new-courses/course-landing";
import CourseSettings from "@/components/instructor-veiw/courses/add-new-courses/course-setting";
import { Button, Card } from "@radix-ui/themes";
import * as Tabs from "@radix-ui/react-tabs";
import CourseCurriculum from "@/components/instructor-veiw/courses/add-new-courses/course-curriculum";
import { useContext, useEffect } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData, courseCurriculumFormData, setCourseLandingFormData, setCourseCurriculumFormData,
    currentEditedCourseId, setCurrentEditedCourseId
  } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
      let hasFreepreview = false;
      for (const item of courseCurriculumFormData) {
        if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
          return false;
        }
        if (item.freePreview) {
          hasFreepreview = true;
        }
      }
      return hasFreepreview;
    }
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };
    const response = currentEditedCourseId !== null ? await updateCourseByIdService(currentEditedCourseId,courseFinalFormData) :  
    await addNewCourseService(courseFinalFormData);
    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null)
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
    const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
      acc[key] = response?.data[key] || courseLandingInitialFormData[key];
      return acc;
    }, {});
    console.log(setCourseFormData, response?.data, 'setCourseFromData');
    setCourseLandingFormData(setCourseFormData);
    setCourseCurriculumFormData(response?.data?.curriculum);
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {currentEditedCourseId ? "Edit Course" : "Create New Course"}
        </h1>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2 rounded-md transition-colors shadow-md"
          disabled={!validateFormData()}
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      
      <Card className="p-6 shadow-lg border border-gray-100 rounded-xl bg-white">
        <div className="container mx-auto">
          <Tabs.Root defaultValue="curriculum">
            <Tabs.List className="flex gap-4 border-b border-gray-200 mb-6">
              <Tabs.Trigger 
                value="curriculum"
                className="px-4 py-3 text-gray-600 font-medium border-b-2 border-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600 hover:text-indigo-500 transition-all"
              >
                Curriculum
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="course-landing-page"
                className="px-4 py-3 text-gray-600 font-medium border-b-2 border-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600 hover:text-indigo-500 transition-all"
              >
                Course Landing Page
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="settings"
                className="px-4 py-3 text-gray-600 font-medium border-b-2 border-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600 hover:text-indigo-500 transition-all"
              >
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            
            <div className="mt-4 space-y-6">
              <Tabs.Content value="curriculum" className="p-2">
                <CourseCurriculum />
              </Tabs.Content>
              <Tabs.Content value="course-landing-page" className="p-2">
                <CourseLanding />
              </Tabs.Content>
              <Tabs.Content value="settings" className="p-2">
                <CourseSettings />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;