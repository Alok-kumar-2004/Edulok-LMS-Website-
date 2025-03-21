import MediaProgressbar from "@/components/media-progress-bar";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from "@/services";
import { Label } from "@radix-ui/react-label";
import { Button, Card, Switch,Text} from "@radix-ui/themes";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const bulkUploadref = useRef(null)
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }
  function handleCourseTitleChange(event, currentIndex) {
    let copycourseCurriculumFormData = [...courseCurriculumFormData];
    console.log(copycourseCurriculumFormData);
    copycourseCurriculumFormData[currentIndex] = {
      ...copycourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(copycourseCurriculumFormData);
  }
  function handleFreepreviewChange(currentValue, currentIndex) {
    let copycourseCurriculumFormData = [...courseCurriculumFormData];
    copycourseCurriculumFormData[currentIndex] = {
      ...copycourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(copycourseCurriculumFormData);
  }
  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let copycourseCurriculumFormData = [...courseCurriculumFormData];
          copycourseCurriculumFormData[currentIndex] = {
            ...copycourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(copycourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
        console.log(response, "response");
      } catch (error) {
        console.log(error);
      }
    }
  }
  function isCourseCurriculumFormDataValid(){
    return courseCurriculumFormData.every(item =>{
      return item && typeof item === 'object' &&
      item.title.trim()!==''&&
      item.videoUrl.trim()!==''
    })
  }
  async function handleReplaceVideo(currentIndex){
    try {
      let copycourseCurriculumFormData = [...courseCurriculumFormData];
      const getCurrentVideoPublicId = copycourseCurriculumFormData[currentIndex].public_id;
      
      const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId);

      if (deleteCurrentMediaResponse?.success) {
          copycourseCurriculumFormData[currentIndex] = {
              ...copycourseCurriculumFormData[currentIndex],
              videoUrl: "",
              public_id: "",
          };
          setCourseCurriculumFormData(copycourseCurriculumFormData);
      } else {
          console.error("Failed to delete video");
      }
  } catch (error) {
      console.error("Error replacing video:", error);
  }
}
function handleOpenBulkUpload(){
  bulkUploadref.current?.click()
}
function areAllCourseCurriculumFormDataObjectEmpty(arr){
  return arr.every((obj)=>{
    return Object.entries(obj).every(([key,value])=>{
      if(typeof value ==='boolean'){
        return true;
      }
      return value === ''
    })
  })
}
async function handleBulkUploadMedia(event){
  const SelectedFiles =  Array.from(event.target.files)
  const bulkFormData= new FormData()
  SelectedFiles.forEach(fileItem => bulkFormData.append('files',fileItem))
  try {
    setMediaUploadProgress(true)
    const response = await mediaBulkUploadService(
      bulkFormData,setMediaUploadProgressPercentage
    )
    console.log(response, "bulk");
    if(response?.success){
      let copycourseCurriculumFormData = areAllCourseCurriculumFormDataObjectEmpty(courseCurriculumFormData) ? [] : [...courseCurriculumFormData];
      copycourseCurriculumFormData = [
        ...copycourseCurriculumFormData, 
        ...response?.data.map((item, index) => ({
          videoUrl: item?.url,
          public_id: item?.public_id ,
          title: `Lecture ${copycourseCurriculumFormData.length + (index + 1)}`,
          freePreview: false,
        })),
      ];
      setCourseCurriculumFormData(copycourseCurriculumFormData)
      setMediaUploadProgress(false)
    }
  } catch (error) {
    console.log(error); 
  }
}
async function handleDeleteLecture(currentIndex) {
  let copycourseCurriculumFormData = [...courseCurriculumFormData]
  const getCurrentSelectedVideoPublicId = copycourseCurriculumFormData[currentIndex].public_id

  const response = await mediaDeleteService(getCurrentSelectedVideoPublicId)
  if(response?.success){
    copycourseCurriculumFormData = copycourseCurriculumFormData.filter((_,index)=>index !==currentIndex)
    setCourseCurriculumFormData(copycourseCurriculumFormData)
  }
}

  return (
    <Card className="p-6 shadow-md">
      <div className="mb-4 flex flex-row justify-between">
        <Text as="h3" size="5" weight="bold">
          Create Course Curriculum
        </Text>
        <div>
          <input
          type="file"
          ref={bulkUploadref}
          accept="video/*"
          multiple
          className="hidden"
          id="bulk-upload"
          onChange={handleBulkUploadMedia}
          />
          <Button
          htmlFor='bulk-upload'
          variant="outline"
          className="cursor-pointer"
          onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-5 mr-2"/>
            Bulk Upload
          </Button>  
        </div>
      </div>
      <Button disabled={!isCourseCurriculumFormDataValid()|| mediaUploadProgress } onClick={handleNewLecture} className="mb-4">
        Add Lecture
      </Button>
      {mediaUploadProgress ? (
        <MediaProgressbar
          isMediaUploading={mediaUploadProgress}
          progress={mediaUploadProgressPercentage}
        />
      ) : null}
      <div className="mt-4 space-y-4">
        {courseCurriculumFormData.map((curriculumItem, index) => (
          <div key={index} className="border p-5 rounded-md">
            <div className="flex gap-5 items-center">
              <Text as="h3" size="4" weight="semibold">
                Lecture {index + 1}
              </Text>
              <input
                name={`title-${index + 1}`}
                placeholder="Enter lecture title"
                className="max-w-96"
                onChange={(event) => handleCourseTitleChange(event, index)}
                value={courseCurriculumFormData[index]?.title}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={!!courseCurriculumFormData[index]?.freePreview} 
                  onCheckedChange={(value) => handleFreepreviewChange(value, index)}
                  id={`freePreview-${index + 1}`}
                />
                <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
              </div>
            </div>
            <div className="mt-6">
              {courseCurriculumFormData[index]?.videoUrl ? (
                <div className="flex gap-3">
                  <VideoPlayer
                    url={courseCurriculumFormData[index]?.videoUrl}
                    width="450px"
                    height="200px"
                  />
                  <Button onClick={()=>handleReplaceVideo(index)}> Replace Video</Button>
                  <Button onClick={()=>{handleDeleteLecture(index)}} color='red'> Delete Video</Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleSingleLectureUpload(event, index)}
                  className="mb-4"
                />
              )}
            </div>
           </div> 
         ))} 
      </div>
    </Card>
  );
}



export default CourseCurriculum;
