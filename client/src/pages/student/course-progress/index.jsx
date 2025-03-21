import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCurrentCourseProgressService } from "@/services";
import { Button } from "@radix-ui/themes";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function StudentVeiwCourseProgressPage() {
    const navigate = useNavigate()
    const {auth} = useContext(AuthContext)
    const {studentCourseProgress,setStudentCourseProgress} = useContext(StudentContext)

    const {id} = useParams()

    async function fetchCurrentCourseProgress(){
        const response = await getCurrentCourseProgressService(auth?.user?._id,id)
        console.log(response);
        

    }

    useEffect(()=>{
        fetchCurrentCourseProgress()
    },[id])
    return ( 
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            <div className="flex items-center p-4 bg-[#1c1d1f] border-b  border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button 
                    onClick={()=>navigate('/student-courses')}
                    className="text-white"
                    variant="solid"
                    size= {1}
                    color="indigo"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to My Courses Page
                    </Button>
                    <h1></h1>

                </div>

            </div>
        </div>
     );
}

export default StudentVeiwCourseProgressPage;