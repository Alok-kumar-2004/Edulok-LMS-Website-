import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Label } from "@radix-ui/react-label";
import {  AspectRatio, Card, Checkbox, DropdownMenu, Flex, Skeleton, Text } from "@radix-ui/themes";
import { Heading } from "lucide-react";

import { useContext, useEffect, useState } from "react";
import {  useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams){
  const queryParams = []
  for(const [key,value] of Object.entries(filterParams)){
    if (Array.isArray(value) && value.length>0) {
      const paramValue = value.join(',')

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}}`)
    }
  }

  return queryParams.join('&')
}

function StudentViewCoursesPage() {
  const[searchParams,setSearchParams] = useSearchParams()
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const {studentCoursesList,setStudentCoursesList,loadingState, setLoadingState} = useContext(StudentContext)
  const navigate = useNavigate()
  const {auth} = useContext(AuthContext)



  async function fetchAllStudentViewCourses(filters,sort){
      const query = new URLSearchParams({
        ...filters,
        sortBy:sort
      })
        const response = await fetchStudentViewCourseListService(query);
        // console.log(response);

        if (response?.success) {
          setStudentCoursesList(response?.data);
          setLoadingState(false)
        }
      }

      useEffect(()=>{
        if (filters!==null && sort!==null) {
          fetchAllStudentViewCourses(filters,sort)
        }
      },[filters,sort])
      console.log(filters);

      useEffect(()=>{
        const buildQueryStringForFilters = createSearchParamsHelper(filters)
        setSearchParams(new URLSearchParams(buildQueryStringForFilters))
      },[filters])

      useEffect(()=>{
        setSort('price-lowtohigh')
        setFilters(JSON.parse(sessionStorage.getItem('filters'))|| {})
      },[])

      useEffect(()=>{
        return () =>{
          sessionStorage.removeItem('filters')
        }
      },[])
      

  function handleFilterOnChanged(getSectionId,getCurrentoption) {
    let copyFilters = {...filters}
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId)
    console.log(indexOfCurrentSection,getCurrentoption);
    if (indexOfCurrentSection===-1) {
      copyFilters={
        ...copyFilters,
        [getSectionId] : [getCurrentoption.id]
      }
    }else{
      const indexOfCurrentOptions = copyFilters[getSectionId].indexOf(getCurrentoption.id)

      if(indexOfCurrentOptions===-1){
        copyFilters[getSectionId].push(getCurrentoption.id)
      }else{
        copyFilters[getSectionId].splice(indexOfCurrentOptions,1)
      }
    }
    setFilters(copyFilters)
    sessionStorage.setItem('filters',JSON.stringify(copyFilters))
    
  }
  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId,auth?.user?._id)

    console.log(response);
    if(response?.success){
      if(response?.data){
        navigate(`/course-progress/${getCurrentCourseId}`)
      }else{
        navigate(`/course/details/${getCurrentCourseId}`)
      }
    }
    
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="filter-group">
                <div className="p-4">
                  <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                </div>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((options) => (
                    <Label
                      key={options.id}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={
                          filters && 
                          Object.keys(filters).length>0
                          && filters[keyItem]&&
                          filters[keyItem].indexOf(options.id)>-1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChanged(keyItem, options)
                        }
                      />
                      {options.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <Flex justify="end" align="center" gap="5" mb="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 text-[16px] font-medium rounded-md
                     border border-slate-200 bg-white text-slate-800
                     hover:bg-slate-50 hover:border-slate-300
                     focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-opacity-50
                     shadow-sm transition duration-200 ease-in-out"
                >
                  <ChevronUpDownIcon className="h-4 w-4 text-slate-500" />
                  <span>Sort By</span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
                align="end"
                className="w-[180px] bg-white rounded-lg shadow-lg border border-slate-200 
                   py-1.5 mt-1 z-50 animate-in fade-in-80 zoom-in-95 
                   overflow-hidden"
                sideOffset={5}
              >
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 border-b border-slate-100">
                  SORT OPTIONS
                </div>

                <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenu.RadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="relative flex items-center h-10 px-3 mx-1 my-0.5 text-sm rounded-md
                         outline-none text-slate-700 
                         data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900
                         data-[state=checked]:bg-slate-50 data-[state=checked]:font-medium
                         cursor-pointer transition-colors"
                    >
                      <div
                        className={`mr-2 h-2 w-2 rounded-full ${
                          sort === sortItem.id
                            ? "bg-blue-500"
                            : "bg-transparent border border-slate-300"
                        }`}
                      />
                      {sortItem.label}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <span className="text-sm text-gray-900 font-bold"> {
            studentCoursesList.length} Results
          </span>
          <div className="space-y-4">
            {
              studentCoursesList && studentCoursesList.length>0 ?
              studentCoursesList.map(courseItem => (
                <Card
                key={courseItem?._id}
                onClick={()=>handleCourseNavigate(courseItem?._id)}
                style={{ cursor: 'pointer' }}

              >
                <Flex gap="4" p="4">
                  <div style={{ width: '12rem', flexShrink: 0 }}>
                    <AspectRatio ratio={3/2}>
                      <img src={courseItem?.image}
                      className="w-full h-full object-cover border rounded-lg"
                      />
                    </AspectRatio>
                  </div>
                  
                  <Flex direction="column" style={{ flex: 1 }}>
                    <Heading size="4" mb="2">
                      {courseItem?.title}
                    </Heading>
                    <Text size="2" color="gray" mb="1">
                      Created By{" "}
                      <Text weight="bold" as="span">
                        {courseItem?.instructorName}
                      </Text>
                    </Text>
                    <Text size="3" color="gray" mt="3" mb="2">
                      {`${courseItem?.curriculum?.length} ${
                        courseItem?.curriculum?.length <= 1
                          ? "Lecture"
                          : "Lectures"
                      } - ${courseItem?.level.toUpperCase()} Level`}
                    </Text>
                    <Text weight="bold" size="4">
                      ${courseItem?.pricing}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            )
          ) :  loadingState ? (
            <Skeleton />
          ) : (
            <Text size="8" weight="bold">No Courses Found</Text>
          )
          }
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
