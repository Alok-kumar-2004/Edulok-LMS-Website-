import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button, Card, Table } from "@radix-ui/themes";
import { TrashIcon } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {setCourseCurriculumFormData,setCourseLandingFormData,setCurrentEditedCourseId} = useContext(InstructorContext)
  return (
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
              ? listOfCourses.map((courses) => (
                  <Table.Row key={courses?.id}>
                    <Table.Cell className="font-medium">
                      {courses?.title}
                    </Table.Cell>
                    <Table.Cell>{courses?.students?.length}</Table.Cell>
                    <Table.Cell>{courses?.pricing}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button onClick={()=>{
                       navigate(`/instructor/edit-course/${courses?._id}`)
                      }}variant="ghost" size="sm">
                        <Pencil1Icon className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <TrashIcon className="h-6 w-6" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table.Root>
      </div>
    </Card>
  );
}

export default InstructorCourses;
