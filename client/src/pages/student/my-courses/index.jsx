
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Card, Flex, Text, Heading, Button, Container, Badge, ScrollArea } from "@radix-ui/themes";
import { Clock, User, BookOpen } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList,studentViewCourseDetails,setStudentViewCourseDetails } =
    useContext(StudentContext);
  const [isLoading, setIsLoading] = useState(true);


  
  async function fetchStudentBoughtCourses() {
    try {
      setIsLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      console.log(studentViewCourseDetails);
      if (response?.success) {
        setStudentBoughtCoursesList(response?.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const handleStartWatching = (courseId) => {
    navigate(`/course-progress/${courseId}`);
  };

  return (
    <Container size="4" style={{ padding: "24px 0" }}>
      <Flex direction="column" gap="6">
        <Heading size="8" align="center" style={{ marginBottom: "16px" }}>
          My Learning Journey
        </Heading>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ height: "200px" }}>
            <Text size="5">Loading your courses...</Text>
          </Flex>
        ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <ScrollArea>
            <Flex gap="5" wrap="wrap" justify="center">
              { [...new Map(studentBoughtCoursesList.map(c=>[c.courseId,c])).values()].map(course =>
                <Card
                  key={course.id}
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  className="course-card"
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={course?.courseImage}
                      alt={course?.title}
                      style={{
                        height: "180px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Badge
                      size="2"
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Purchased
                    </Badge>
                  </div>

                  <Flex direction="column" gap="3" p="4">
                    <Heading size="4">{course?.title}</Heading>

                    <Flex gap="3">
                      <Flex align="center" gap="1">
                        <User size={16} />
                        <Text size="2" color="gray">
                          {course?.instructorName}
                        </Text>
                      </Flex>

                      <Flex align="center" gap="1">
                        <Clock size={16} />
                        <Text size="2" color="gray">
                          {course?.duration || "20m"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Text size="2" color="gray" style={{ marginBottom: "8px" }}>
                      {course?.description ||
                        "Continue your learning journey with this comprehensive course designed to enhance your skills."}
                    </Text>

                    <Flex gap="2" wrap="wrap" style={{ marginBottom: "8px" }}>
                      {(course?.category || ["Web Development"]).map(
                        (tag, i) => (
                          <Badge key={i} variant="soft" color="indigo">
                            {tag}
                          </Badge>
                        )
                      )}
                    </Flex>

                    {/* <Flex direction="column" gap="2">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="1">
                          <BookOpen size={16} />
                          <Text size="2">
                            {course?.lessonsCompleted || "0"}/
                            {course?.totalLessons || "3"} lessons
                          </Text>
                        </Flex>
                        <Text size="2" color="gray">
                          Progress: {course?.progress || "0%"}
                        </Text>
                      </Flex>

                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "#e4e4e7",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: course?.progress || "0%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #6366f1, #8b5cf6)",
                          }}
                        ></div>
                      </div>
                    </Flex> */}

                    <Button
                      size="3"
                      style={{ marginTop: "8px" }}
                      onClick={() => handleStartWatching(course?.courseId)}
                    >
                      <Flex align="center" gap="2">
                        <BookOpen size={16} />
                        <Text>Continue Learning</Text>
                      </Flex>
                    </Button>
                  </Flex>
                </Card>
              )}
            </Flex>
          </ScrollArea>
        ) : (
          <Flex
            direction="column"
            align="center"
            gap="4"
            style={{ padding: "48px 0" }}
          >
            <BookOpen size={64} opacity={0.5} />
            <Heading size="6" style={{ opacity: 0.8 }}>
              No courses found
            </Heading>
            <Text size="3" color="gray">
              Time to start your learning journey!
            </Text>
            <Button onClick={() => navigate("/courses")}>
              Explore Courses
            </Button>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}


export default StudentCoursesPage;