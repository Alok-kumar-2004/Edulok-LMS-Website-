import FormControls from "@/components/common-form/form-control";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Card } from "@radix-ui/themes";
import { useContext } from "react";


function CourseLanding() {
    const {courseLandingFormData,setCourseLandingFormData} = useContext(InstructorContext)
    return (
      <div>
        <Card className="p-6 shadow-md">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Course Landing Page</h2>
          </div>
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </Card>
      </div>
    );
}

export default CourseLanding;