import axiosInstance from "@/api/axiosInstance"


export async function registerService(formData){
    const {data} = await axiosInstance.post('/auth/register',{
            ...formData,
            role:'user',
        });
        return data;
    }
export async function loginService(formData){
        const {data} = await axiosInstance.post('/auth/login',formData);

        return data;
    }
    export async function checkAuthService() {
        const { data } = await axiosInstance.get("/auth/check-auth");
      
        return data;
    }
    export async function mediaUploadService(formData, onProgressCallback) {

    //   const { data } = await axiosInstance.post("/media/upload", formData, {
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //       );
    //       onProgressCallback(percentCompleted);
    //     },
    //   });

    //   return data;
    try {
        const response = await axiosInstance.post("/media/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgressCallback(percentCompleted);
          },
        });
        console.log(response);  // Log response for debugging
        return response.data;
      } catch (error) {
        console.error("Upload Error:", error.response?.data || error.message);
        throw error;
      }
    }
    export async function mediaDeleteService(id) {
    try {
      const  response  = await axiosInstance.delete(`/media/delete/${id}`);
      console.log("Delete Response:",response.data);
      return response.data;
  } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      throw error;
  }
}
export async function fetchInstructorCourseListService() {
  const {data} = await axiosInstance.get(`/instructor/course/get`)

  return data
}
export async function addNewCourseService (formData) {
  const {data} = await axiosInstance.post(`/instructor/course/add`,formData)

  return data
}
export async function fetchInstructorCourseDetailsService(id) {
  const {data} = await axiosInstance.get(`/instructor/course/get/details/${id}`)

  return data
}
export async function updateCourseByIdService(id,formData) {
  const {data} = await axiosInstance.put(`/instructor/course/update/${id}`,formData)

  return data;
}
