import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { createPaymentService, fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Dialog, Flex, Grid, Skeleton, Text } from "@radix-ui/themes";
import { Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {  useLocation, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const {auth} = useContext(AuthContext)
  const { id } = useParams();
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
    const location = useLocation()
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const[approvalurl,setApprovalurl] = useState('')
  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId,
    );
    console.log(response);

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }
  function handleSetFreePreview(getCurrentVideoInfo){
    console.log(getCurrentVideoInfo);
    
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }
   async function handleCreatePayment(){
    const paymentPayLoad = {
      userId : auth?.user?._id,
      userName : auth?.user?.userName,
      userEmail : auth?.user?.userEmail,
      orderStatus : 'pending',
      paymentMethod : 'PayPal',
      paymentStatus : 'initiated',
      orderDate : new Date(),
      paymentId : '',
      payerId : '',
      instructorId : studentViewCourseDetails?.instructorId,
      instructorName : studentViewCourseDetails?.instructorName,
      courseImage : studentViewCourseDetails?.image,
      courseTitle : studentViewCourseDetails?.title,
      courseId :studentViewCourseDetails?._id,
      coursePricing : studentViewCourseDetails?.pricing,
    }
    console.log(paymentPayLoad);
    const response = await createPaymentService(paymentPayLoad)

    if(response.success){
      sessionStorage.setItem('currentOrderId',JSON.stringify(response?.data?.orderId))
      setApprovalurl(response?.data?.approveUrl)
    }
  }
  useEffect(()=>{
    if(displayCurrentVideoFreePreview){
      setShowFreePreviewDialog(true)
    }
  },[displayCurrentVideoFreePreview])
  useEffect(() => {
    console.log(currentCourseDetailsId);
    if (currentCourseDetailsId !== null) {
      fetchStudentViewCourseDetails();
    }
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(()=>{
    if(!location.pathname.includes('course/details')){
      setStudentViewCourseDetails(null),
      setCurrentCourseDetailsId(null)

    }
  },[location.pathname])

  if (loadingState) {
    return <Skeleton />;
  }
  if(approvalurl !== ''){
    window.location.href = approvalurl
  }

  const getIndexOffFreePreview =  studentViewCourseDetails !== null ? 
  studentViewCourseDetails?.curriculum?.findIndex(item => item.freePreview)
  : -1
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl text-gray-200 mb-6">
          {studentViewCourseDetails?.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
          <span className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
            <span className="font-medium mr-1">By:</span>{" "}
            {studentViewCourseDetails?.instructorName}
          </span>
          <span className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
            <span className="font-medium mr-1">Created:</span>{" "}
            {studentViewCourseDetails?.date.split("T")[0]}
          </span>
          <span className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
            <span className="font-medium mr-1">Enrollment:</span>
            {studentViewCourseDetails?.students.length}
            {studentViewCourseDetails?.students.length <= 1
              ? " Student"
              : " Students"}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Box mb="8">
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Box p="5" pb="3" className="border-b border-gray-100">
                <Text as="div" size="5" weight="bold" className="text-gray-800">
                  What you ll learn
                </Text>
              </Box>

              <Box p="5">
                <Grid columns={{ initial: "1", md: "2" }} gap="4">
                  {studentViewCourseDetails?.objectives
                    .split("#")
                    .map((objective, index) => (
                      <Flex key={index} gap="3" align="start">
                        <Box className="text-emerald-500 flex-shrink-0">
                          <CheckCircledIcon width="20" height="20" />
                        </Box>
                        <Text size="2" className="text-gray-600">
                          {objective}
                        </Text>
                      </Flex>
                    ))}
                </Grid>
              </Box>
            </Card>
          </Box>
          <Card className="mb-8 border rounded-lg p-4">
            <div className="text-lg font-semibold mb-2">Course Description</div>
            <div>{studentViewCourseDetails?.description}</div>
          </Card>

          <Card className="mb-8 border rounded-lg p-4">
            <div className="text-lg font-semibold mb-2">Course Curriculum</div>
            <div>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </div>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">

            <div className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                url={ getIndexOffFreePreview !== -1 ?
                  studentViewCourseDetails?.curriculum[getIndexOffFreePreview].videoUrl :
                null
                }
                width="450px"
                height="200px"
                />
              </div>
            </div>

            <div className="mb-4 ">
              <span className="text-3xl font-bold">${studentViewCourseDetails?.pricing}</span>
               <button onClick = {handleCreatePayment}className="w-full mt-4 text-white text-lg border-y-slate-800 rounded-2xl p-1.5 bg-blue-600 ">
                Buy Now
               </button>
            </div>
          </Card>

        </aside>
      </div>
      <Dialog.Root 
      open={showFreePreviewDialog} 
      onOpenChange={(open) => {
        if (!open) {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }
      }}
    >
      <Dialog.Content className="w-[800px]">
        <Dialog.Title>Course Preview</Dialog.Title>
        
        <Flex direction="column" gap="4">
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>

          <Flex direction="column" gap="2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <Text 
                  key={index}
                  as="p"
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => handleSetFreePreview(filteredItem)}
                >
                  {filteredItem?.title}
                </Text>
              ))}
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
