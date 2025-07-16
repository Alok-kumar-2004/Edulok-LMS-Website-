import { Card, Text, Flex, Heading } from "@radix-ui/themes";
import { UserCircle, DollarSign, BookOpen, Calendar } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  const config = [
    {
      icon: UserCircle,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents/2,
      description: "Active enrollments",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${calculateTotalStudentsAndProfit().totalProfits.toLocaleString()}`,
      description: "Lifetime earnings",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BookOpen,
      label: "Active Courses",
      value: listOfCourses.length,
      description: "Published courses",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Calendar,
      label: "Last Updated",
      value: new Date().toLocaleDateString(),
      description: "Last updated",
      color: "bg-amber-100 text-amber-200",
    },
  ];

  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfits, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfits += course.pricing * studentCount;

        const studentSet = new Set()
        course.students.forEach(student => {
          const uniqueKey = course.title + "|" + student.studentEmail
          if(!studentSet.has(uniqueKey)){
            acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
          }
          studentSet.add(uniqueKey)
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfits: 0,
        studentList: [],
      }
    );
    
    return {
      totalProfits,
      totalStudents,
      studentList,
    };
  }
  
  return (
    <div className="space-y-6">
      <Heading size="5" className="mb-4 text-center text-gray-800 font-bold text-3xl">
        {/* Instructor Dashboard */}Instructor Name - John Doe
      </Heading>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.map((item, index) => (
          <Card key={index} className="overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-4">
              <Flex justify="between" align="start">
                <div>
                  <Text className="text-gray-600 font-medium">{item.label}</Text>
                  <div className="flex items-baseline gap-1">
                    <Text className="text-2xl font-bold mt-1">{item.value}</Text>
                  </div>
                  <Text className="text-gray-500 text-sm">{item.description}</Text>
                </div>
                <div className={`rounded-full p-2 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </Flex>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="border border-gray-200 shadow-sm">
        <div className="p-5 pb-3 flex justify-between items-center">
          <Heading size="4" className="font-bold">Students Enrolled</Heading>
          <Text size="2" className="text-gray-500">
            {calculateTotalStudentsAndProfit().totalStudents} total students
          </Text>
        </div>
        
        <div className="p-5 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Course Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Student Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculateTotalStudentsAndProfit().studentList.map(
                  (studentItem, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-100"
                    >
                      <td className="px-4 py-5 font-medium">
                        {studentItem.courseTitle}
                      </td>
                      <td className="px-4 py-5">
                        {studentItem.studentName}
                      </td>
                      <td className="px-4 py-5 text-gray-600">
                        {studentItem.studentEmail}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            
            {calculateTotalStudentsAndProfit().studentList.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students enrolled yet
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default InstructorDashboard;