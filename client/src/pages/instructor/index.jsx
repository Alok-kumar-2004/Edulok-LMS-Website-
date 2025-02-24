import InstructorCourses from "@/components/instructor-veiw/courses";
import InstructorDashboard from "@/components/instructor-veiw/dashboard";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { BarChartIcon } from "@radix-ui/react-icons";
import {  Slot, Tabs } from "@radix-ui/themes";
import { LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";



function InstructorDashboardPage(){
    const {resetCredentials} = useContext(AuthContext)
    const [activeTabs,setActiveTabs] =useState('dashboard')
    const{instructorCoursesList,setInstructorCoursesList} =useContext(InstructorContext)
    useEffect(()=>{
      fetchAllCourses()
    })

    async function fetchAllCourses() {
      const response = await fetchInstructorCourseListService()
      // console.log(response);
      if(response?.success) setInstructorCoursesList(response?.data)
    }
    const menuItems =[
        {
            icon: BarChartIcon,
            label : 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard/>
        },
        {
            icon : BookOpenIcon,
            label:'Courses',
            value:'courses',
            component:<InstructorCourses listOfCourses={instructorCoursesList}/>
        },
        {
            icon: LogOut,
            label:"LogOut",
            value:"logout",
            component:null
        }
    ]
    function handleLogOut(){
        resetCredentials();
        sessionStorage.clear()
    }
    return (
      <div className="flex h-full min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Instructor Veiw</h2>
            <nav className="w-full flex flex-col space-y-2 p-2">
              {menuItems.map((menuItem) => (
                <Slot key={menuItem.value} asChild>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 
          ${
            activeTabs === menuItem.value
              ? "bg-secondary text-black shadow-md scale-105"
              : "bg-transparent text-muted-foreground hover:bg-accent hover:text-primary"
          }`}
                    onClick={() =>
                      menuItem.value === "logout"
                        ? handleLogOut()
                        : setActiveTabs(menuItem.value)
                    }
                  >
                    <menuItem.icon className="h-5 w-5 transition-all duration-200" />
                    <span>{menuItem.label}</span>
                  </button>
                </Slot>
              ))}
            </nav>
            ;
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto ">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">DashBoard</h1>
            <Tabs.Root value={activeTabs} onValueChange={setActiveTabs}>
              <Tabs.List>
                {menuItems.map((menuItem) => (
                  <Tabs.Trigger key={menuItem.value} value={menuItem.value}>
                    {menuItem.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {menuItems.map((menuItem) => (
                <Tabs.Content key={menuItem.value} value={menuItem.value}>
                  {menuItem.component !== null ? menuItem.component : null}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </main>
      </div>
    );
}
export default InstructorDashboardPage;