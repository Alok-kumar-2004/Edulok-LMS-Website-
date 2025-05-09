import { courseCategories } from '@/config';
import banner from '../../../assets/image/banner.png'
import { Button } from '@radix-ui/themes';
import { useContext, useEffect } from 'react';
import { StudentContext } from '@/context/student-context';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';

function StudentHomePage() {
    const {studentCoursesList,setStudentCoursesList} = useContext(StudentContext)
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

   async function fetchAllStudentViewCourses(){
      const response = await fetchStudentViewCourseListService();
      console.log(response);
      if (response?.success) setStudentCoursesList(response?.data);
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
    function handleNaviagteToCoursePage(categoryId) {
      console.log(categoryId);
      sessionStorage.removeItem('filters')
      const currentFilters = {
        category : [categoryId]
      }
      sessionStorage.setItem('filters',JSON.stringify(currentFilters))
      navigate('/courses')
    }

    useEffect(()=>{
      fetchAllStudentViewCourses()
    },[])
  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 ">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
          <p className="text-lg">
            Skills For Your Present and Your Future.Get Started with us.
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
            <img 
            src={banner} 
            width= {600}
            height={400}
            className='w-full h-auto rounded-lg shadow-lg'
            />
        </div>
      </section>
      <section className='py-8 px-4 lg:px-8 bg-gray-100'>
        <h2 className='text-2xl font-bold mb-6'>Course Categories</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 '>
            {
                courseCategories.map(categoryItem =>
                  <Button className='justify-start' variant='outline'
                    key={categoryItem.id}
                    onClick={()=>handleNaviagteToCoursePage(categoryItem.id)}
                    >
                      {categoryItem.label}
                  </Button>
                )
            }
        </div>
      </section>
      <section className='py-12 px-4 lg:px-8'>
        <h2 className='text-2xl font-bold mb-6'>Featured Courses </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {
            studentCoursesList && studentCoursesList.length>0 ?
            studentCoursesList.map(courseItem => 
              <div 
              key={courseItem.id}
              onClick={() => handleCourseNavigate(courseItem?._id)}
              className='border rounded-lg overflow-hidden shadow cursor-pointer'>
                <img 
                src={courseItem.image}
                width={300}
                height={150}
                className='w-full h-40 object-cover'
                />
                <div>
                  <h3 className='font-bold mb-2'>
                    {courseItem?.title}
                  </h3>
                  <p className='text-sm text-gray-700 mb-2'>
                    {courseItem.instructorName}
                  </p>
                  <p className='font-bold text-[16px]'>
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ):
            <h1>No Course found </h1>
          }
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
