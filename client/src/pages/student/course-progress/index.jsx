import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Button } from "@radix-ui/themes";
import Confetti from "react-confetti";
import {
  BookOpenIcon,
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  PlayIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "@/components/video-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";

function StudentVeiwCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCourseProgress, setStudentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [showCourseCompleteDailog, setShowCourseCompleteDailog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    console.log(response);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDailog(true);
          setShowConfetti(true);
          return;
        }

        if (
          !response?.data?.progress ||
          response?.data?.progress.length === 0
        ) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  function handleAutoProgressToNextLecture() {
    const curriculum = studentCourseProgress?.courseDetails?.curriculum;
    const currentIndex = curriculum.findIndex(
      (lecture) => lecture._id === currentLecture._id
    );

    if (currentIndex < curriculum.length - 1) {
      const nextLecture = curriculum[currentIndex + 1];
      setCurrentLecture(nextLecture);
    } else {
      setShowCourseCompleteDailog(true);
      setShowConfetti(true);
    }
  }

  function handleLectureSelect(lecture) {
    setCurrentLecture(lecture);
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDailog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 4000);
  }, [showConfetti]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
      handleAutoProgressToNextLecture();
    }
  }, [currentLecture]);

  function formatDate(date) {
    if (!date) return "No Date";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0f0f13] to-[#121216] text-white">
      {showConfetti && <Confetti />}

      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a20] border-b border-gray-800 shadow-md backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md shadow-lg transition-all duration-200 hover:shadow-indigo-500/30 flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="font-medium">My Courses</span>
          </Button>
          <h1 className="text-lg ml-2.5 font-bold hidden md:block text-white truncate max-w-xl">
            {studentCourseProgress?.courseDetails?.title &&
              studentCourseProgress.courseDetails.title}
          </h1>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="bg-[#252530] hover:bg-[#2c2c3a] p-2 rounded-full shadow-md transition-all duration-200"
          aria-label={isSideBarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Video Player Section */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSideBarOpen ? "lg:mr-[400px]" : ""
          }`}
        >
          <div className="bg-black relative">
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>
          <div className="p-6 bg-[#1a1a20] shadow-inner flex items-center space-x-2 text-white">
            <span className="text-white/70">
              {studentCourseProgress?.courseDetails?.instructorName}
            </span>
            <span className="text-white/50 text-sm">
              {formatDate(studentCourseProgress?.courseDetails?.date)}
            </span>
          </div>
          <span className="block text-lg font-semibold text-white bg-gray-800 px-4 py-2 rounded-md shadow-md">
            {currentLecture ? currentLecture.title : "Select a lecture"}
          </span>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[72px] right-0 bottom-0 w-[400px] bg-[#1a1a20] border-l border-gray-800 shadow-xl transition-transform duration-300 ease-in-out overflow-hidden ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Custom Tabs Header */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 h-14 flex items-center justify-center font-medium text-sm transition-all duration-200 relative
          ${
            activeTab === "content"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
              >
                <span>Course Content</span>
                {activeTab === "content" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 h-14 flex items-center justify-center font-medium text-sm transition-all duration-200 relative
          ${
            activeTab === "overview"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
              >
                <span>Overview</span>
                {activeTab === "overview" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                )}
              </button>
            </div>

            {/* Content Tab */}
            <div
              className={`flex-1 overflow-auto ${
                activeTab === "content" ? "block" : "hidden"
              }`}
            >
              <div className="p-4 space-y-2">
                {studentCourseProgress?.courseDetails?.curriculum.map(
                  (item, index) => {
                    const isViewed = studentCourseProgress?.progress?.find(
                      (progressItem) => progressItem.lectureId === item._id
                    )?.viewed;

                    return (
                      <div
                        key={item._id}
                        onClick={() => handleLectureSelect(item)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                ${
                  item._id === currentLecture?._id
                    ? "bg-indigo-600/20 border border-indigo-600/30"
                    : "hover:bg-gray-800/50 border border-transparent"
                }`}
                      >
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 flex-shrink-0
                ${
                  isViewed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-gray-700/30 text-gray-400"
                }`}
                        >
                          {isViewed ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-100 truncate">
                            {item?.title}
                          </p>
                          {item.duration && (
                            <p className="text-xs text-gray-400 mt-1">
                              {item.duration}
                            </p>
                          )}
                        </div>
                        <PlayIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Overview Tab */}
            <div
              className={`flex-1 overflow-auto ${
                activeTab === "overview" ? "block" : "hidden"
              }`}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-400" />
                  About this Course
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {studentCourseProgress?.courseDetails?.description}
                  </p>

                  {studentCourseProgress?.courseDetails?.objectives &&
                    Array.isArray(
                      studentCourseProgress?.courseDetails?.objectives
                    ) && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-white">
                          What you will learn
                        </h3>
                        <ul className="space-y-2">
                          {studentCourseProgress?.courseDetails?.objectives.map(
                            (objective, index) => (
                              <li key={index} className="flex items-start">
                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogTitle>You cannot view this page</DialogTitle>
          <DialogDescription>
            Please purchase this course to get access
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCourseCompleteDailog}
        onOpenChange={setShowCourseCompleteDailog}
      >
        {/* Background Blur Wrapper */}
        {showCourseCompleteDailog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <DialogContent className="sm:max-w-sm mx-auto text-center p-6 bg-black text-white rounded-lg shadow-lg relative">
              {/* Close Button */}
              <button
                onClick={() => setShowCourseCompleteDailog(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✖
              </button>

              <DialogTitle className="text-2xl font-bold">
                🎉 Congratulations!
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-300">
                You have successfully completed the course.
              </DialogDescription>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
                <Button
                  onClick={() => navigate("/student-courses")}
                  className="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-200 w-full sm:w-auto"
                >
                  My Courses Page
                </Button>
                <Button
                  onClick={handleRewatchCourse}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-500 w-full sm:w-auto"
                >
                  Rewatch Course
                </Button>
              </div>
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default StudentVeiwCourseProgressPage;
