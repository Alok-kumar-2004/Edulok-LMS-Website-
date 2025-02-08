import { Button } from "@radix-ui/themes";
import FormControls from "./form-control";


function CommonForm ({handleSubmit,buttonText,formControls=[],formData,setFormData,isButtonDisabled}) {
    return ( 
        <form onSubmit={handleSubmit}>
            <FormControls
            formControls={formControls}
            formData={formData}
            setFormData={setFormData}
            />
        <Button radius="large" color="cyan" disabled={isButtonDisabled} type="submit" className="mt-6 p-4 w-full">
            {buttonText || "Submit"}
        </Button>
        </form>
    )    
}

export default CommonForm;