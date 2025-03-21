import { createContext, useState } from "react";

export const StudentContext = createContext(null)

export default function StudentProvider ({children}){
    const[studentCoursesList,setStudentCoursesList]=useState([])
    const [loadingState, setLoadingState] = useState(true);
    const[studentViewCourseDetails,setStudentViewCourseDetails] = useState(null)
    const [currentCourseDetailsId , setCurrentCourseDetailsId] = useState(null)

    const [studentBoughtCoursesList,setStudentBoughtCoursesList] = useState([])

    const[studentCourseProgress,setStudentCourseProgress] = useState({})
    return <StudentContext.Provider value={{studentCoursesList,setStudentCoursesList,
        loadingState, setLoadingState,
        studentViewCourseDetails,setStudentViewCourseDetails,
        currentCourseDetailsId , setCurrentCourseDetailsId,
        studentBoughtCoursesList,setStudentBoughtCoursesList,
        studentCourseProgress,setStudentCourseProgress
    }}>
        {children}
    </StudentContext.Provider>
}
