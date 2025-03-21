import { AuthContext } from "@/context/auth-context";
import { Button } from "@radix-ui/themes";
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";


function StudentViewCommonHeader() {
    const navigate = useNavigate()
    const {resetCredentials} = useContext(AuthContext)
    function handleLogOut() {
        resetCredentials();
        sessionStorage.clear();
      }
    return ( 
        <div className="flex items-center justify-between p-4 border-b relative">
            <div className="flex items-center space-x-4">
                <Link to='/home'className="flex items-center hover:text-black">
                <GraduationCap className="h-8 w-8 mr-4 hover:text-black"/>
                <span className="font-extrabold md:text-xl text-[14px]">Edulok
                </span>
                </Link>
                <div className="flex items-center space-x-2">
                    <Button  variant='ghost'
                    className="text-[14px] md:text-[16px] font-medium"
                    onClick={()=>{location.pathname.includes('/courses') ? null : 
                        navigate('/courses')
                    }}
                    >
                        Explore Courses
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div onClick={()=>navigate('/student-courses')}className="flex gap-4 items-center">
                    <div className="flex cursor-pointer items-center gap-3">
                    <span className="text-[14px] md:text-[16px] font-medium"> My Courses </span>
                    <TvMinimalPlay className="w-8 h-8 cursor-pointer"/>
                    </div>
                    <Button onClick={handleLogOut}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
     );
}

export default StudentViewCommonHeader;