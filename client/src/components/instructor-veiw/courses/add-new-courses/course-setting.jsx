import { Button, Card, Text } from "@radix-ui/themes";
import { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import MediaProgressbar from "@/components/media-progress-bar";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        console.log(response);
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div>
      <Card className="p-6 shadow-md">
        <div className="mb-4">
          <Text as="h2" size="5" weight="bold">
            Course Settings
          </Text>
        </div>

        <Card>
          {mediaUploadProgress && (
            <div className="mb-4">
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </div>
          )}
          {courseLandingFormData?.image ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={courseLandingFormData.image}
                alt="Uploaded Course Image"
                className="w-96 h-auto object-cover rounded-lg shadow-md"
              />
              <Button variant="outline" className="mt-2">
                Change Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label
                htmlFor="course-image"
                className="text-sm font-medium text-gray-700"
              >
                Upload Course Image
              </label>
              <label
                htmlFor="course-image"
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white text-gray-600 hover:bg-gray-100 transition"
              >
                Choose File
                <input
                  onChange={handleImageUploadChange}
                  id="course-image"
                  type="file"
                  accept="image/*"
                  className="hidden "
                />
              </label>
            </div>
          )}
        </Card>
      </Card>
    </div>
  );
}

export default CourseSettings;
