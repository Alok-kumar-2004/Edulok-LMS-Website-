import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { deleteCourseByIdService } from "@/services";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { AlertDialog, Button, Card, Table } from "@radix-ui/themes";
import { TrashIcon } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {setCourseCurriculumFormData,setCourseLandingFormData,setCurrentEditedCourseId} = useContext(InstructorContext)
  const [isDeleting,setIsDeleting] =useState(false)
  const [courseToDelete,setCourseToDelete] = useState(null)

  const handleDeleteCourse = async () => 
    { 
      if(!courseToDelete) return

      setIsDeleting(true)

    try {
      const response = await deleteCourseByIdService(courseToDelete._id);
      
      if (response?.success) {
        toast.success(response?.message || `Successfully deleted ${courseToDelete.title}`);
        
      } else {
        toast.error(response.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Course deletion error:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
    }
  }
  return (
    // <Card className="p-6 shadow-md">
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-3xl font-extrabold">All Courses</h2>
    //     <Button
    //       onClick={() =>{
    //         setCurrentEditedCourseId(null)
    //         navigate("/instructor/create-new-course")
    //         setCourseCurriculumFormData(courseCurriculumInitialFormData)
    //         setCourseLandingFormData(courseLandingInitialFormData)
    //       }}
    //       className="px-6 py-3"
    //     >
    //       Create New Course
    //     </Button>
    //   </div>
    //   <div className="overflow-x-auto">
    //     <Table.Root>
    //       <Table.Header>
    //         <Table.Row>
    //           <Table.ColumnHeaderCell>Course</Table.ColumnHeaderCell>
    //           <Table.ColumnHeaderCell>Students</Table.ColumnHeaderCell>
    //           <Table.ColumnHeaderCell>Revenue</Table.ColumnHeaderCell>
    //           <Table.ColumnHeaderCell className="text-right">
    //             Actions
    //           </Table.ColumnHeaderCell>
    //         </Table.Row>
    //       </Table.Header>
    //       <Table.Body>
    //         {listOfCourses && listOfCourses.length > 0
    //           ? listOfCourses.map((courses) => (
    //               <Table.Row key={courses?.id}>
    //                 <Table.Cell className="font-medium">
    //                   {courses?.title}
    //                 </Table.Cell>
    //                 <Table.Cell>{courses?.students?.length}</Table.Cell>
    //                 <Table.Cell>{courses?.students?.length*courses?.pricing}</Table.Cell>
    //                 <Table.Cell className="text-right">
    //                   <Button onClick={()=>{
    //                    navigate(`/instructor/edit-course/${courses?._id}`)
    //                   }}variant="ghost" size="sm">
    //                     <Pencil1Icon className="h-6 w-6" />
    //                   </Button>
    //                   <Button variant="ghost" size="sm">
    //                     <TrashIcon className="h-6 w-6" />
    //                   </Button>
    //                 </Table.Cell>
    //               </Table.Row>
    //             ))
    //           : null}
    //       </Table.Body>
    //     </Table.Root>
    //   </div>
    // </Card>
    <Card className="p-6 shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-extrabold">All Courses</h2>
      <Button
        onClick={() =>{
          setCurrentEditedCourseId(null)
          navigate("/instructor/create-new-course")
          setCourseCurriculumFormData(courseCurriculumInitialFormData)
          setCourseLandingFormData(courseLandingInitialFormData)
        }}
        className="px-6 py-3"
      >
        Create New Course
      </Button>
    </div>
    <div className="overflow-x-auto">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Course</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Students</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Revenue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-right">
              Actions
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listOfCourses && listOfCourses.length > 0
            ? listOfCourses.map((course) => (
                <Table.Row key={course?._id}>
                  <Table.Cell className="font-medium">
                    {course?.title}
                  </Table.Cell>
                  <Table.Cell>{course?.students?.length}</Table.Cell>
                  <Table.Cell>{course?.students?.length * course?.pricing}</Table.Cell>
                  <Table.Cell className="text-right">
                    <Button onClick={() => {
                      navigate(`/instructor/edit-course/${course?._id}`)
                    }} variant="ghost" size="sm">
                      <Pencil1Icon className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCourseToDelete(course)}
                      disabled={isDeleting}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table.Root>
    </div>
    
    {/* Delete Confirmation Dialog */}
    <AlertDialog.Root open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete Course</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          All student enrollments and progress for this course will be removed.
        </AlertDialog.Description>
        <div className="flex justify-end gap-3 mt-4">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button 
              variant="solid" 
              color="red" 
              onClick={handleDeleteCourse} 
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </Card>
  );
}

export default InstructorCourses;
