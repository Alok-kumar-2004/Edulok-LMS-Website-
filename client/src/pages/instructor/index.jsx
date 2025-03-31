import InstructorCourses from "@/components/instructor-veiw/courses";
import InstructorDashboard from "@/components/instructor-veiw/dashboard";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { BarChartIcon } from "@radix-ui/react-icons";
import { Slot, Tabs } from "@radix-ui/themes";
import { LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardPage() {
  const { resetCredentials } = useContext(AuthContext);
  const [activeTabs, setActiveTabs] = useState('dashboard');
  const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);
  
  useEffect(() => {
    fetchAllCourses();
  });

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }
  
  const menuItems = [
    {
      icon: BarChartIcon,
      label: 'Dashboard',
      value: 'dashboard',
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />
    },
    {
      icon: BookOpenIcon,
      label: 'Courses',
      value: 'courses',
      component: <InstructorCourses listOfCourses={instructorCoursesList} />
    },
    {
      icon: LogOut,
      label: "LogOut",
      value: "logout",
      component: null
    }
  ];
  
  function handleLogOut() {
    resetCredentials();
    sessionStorage.clear();
  }

  // console.log(instructorCoursesList);
  
  
  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block border-r border-gray-100">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Instructor View
          </h2>
          
          <nav className="w-full flex flex-col space-y-3 flex-1">
            {menuItems.map((menuItem) => (
              <Slot key={menuItem.value} asChild>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200
                    ${activeTabs === menuItem.value
                      ? "bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600"
                      : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={() =>
                    menuItem.value === "logout"
                      ? handleLogOut()
                      : setActiveTabs(menuItem.value)
                  }
                >
                  <menuItem.icon className={`h-5 w-5 ${activeTabs === menuItem.value ? 'text-indigo-600' : 'text-gray-500'}`} />
                  <span>{menuItem.label}</span>
                </button>
              </Slot>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            {activeTabs === 'dashboard' ? 'Dashboard' : 
             activeTabs === 'courses' ? 'Courses' : 'Dashboard'}
          </h1>
          
          {/* Mobile tabs - visible on smaller screens */}
          <div className="md:hidden mb-8">
            <Tabs.Root value={activeTabs} onValueChange={setActiveTabs}>
              <Tabs.List className="flex w-full bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                {menuItems.map((menuItem) => (
                  menuItem.value !== "logout" && (
                    <Tabs.Trigger 
                      key={menuItem.value} 
                      value={menuItem.value}
                      className="flex-1 py-2 px-3 text-sm font-medium rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 text-gray-600"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <menuItem.icon className="h-4 w-4" />
                        {menuItem.label}
                      </div>
                    </Tabs.Trigger>
                  )
                ))}
              </Tabs.List>
            </Tabs.Root>
          </div>
          
          {/* Content area */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            {menuItems.map((menuItem) => (
              activeTabs === menuItem.value && menuItem.component !== null && (
                <div key={menuItem.value} className="animate-fadeIn">
                  {menuItem.component}
                </div>
              )
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;