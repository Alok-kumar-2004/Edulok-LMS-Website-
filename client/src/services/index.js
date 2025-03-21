import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
}
export async function loginService(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/login", formData);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
      data: null,
    };
  }
}
export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");
    return data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Authentication check failed",
      data: null,
    };
  }
}
export async function mediaUploadService(formData, onProgressCallback) {
  try {
    const response = await axiosInstance.post("/media/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    });
    console.log(response); // Log response for debugging
    return response.data;
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    throw error;
  }
}
export async function mediaDeleteService(id) {
  try {
    const response = await axiosInstance.delete(`/media/delete/${id}`);
    console.log("Delete Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Error:", error.response?.data || error.message);
    throw error;
  }
}
export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}
export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}
export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}
export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  try {
    const response = await axiosInstance.post("/media/bulk-upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    console.error("Bulk Upload Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );
  return data;
}

export async function checkCoursePurchaseInfoService(courseId,studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );
  return data;
}


export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}
export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  try {
    const { data } = await axiosInstance.post(`/student/order/capture`, {
      paymentId,
      payerId,
      orderId,
    });
    return data;
  } catch (error) {
    console.error(
      "Payment capture error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function fetchStudentBoughtCoursesService(studentId){
  const {data} = await axiosInstance.get(`student/Courses-bought/get/${studentId}`)

  return data
}

export async function getCurrentCourseProgressService(userId,courseId) {
  const {data} = await axiosInstance.get(`/student/course-progress/get/${userId}/${courseId}`)

  return data
}