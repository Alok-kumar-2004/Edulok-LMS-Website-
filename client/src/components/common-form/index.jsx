// import { Button } from "@radix-ui/themes";
import FormControls from "./form-control";
// import { ButtonIcon } from "@radix-ui/react-icons";


function CommonForm ({handleSubmit,buttonText,formControls=[],formData,setFormData,isButtonDisabled}) {
    return ( 
        <form onSubmit={handleSubmit}>
            <FormControls
            formControls={formControls}
            formData={formData}
            setFormData={setFormData}
            />
         <button disabled={isButtonDisabled} type="submit" 
            className={`mt-6 p-2 w-full text-white rounded-3xl 
                ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {buttonText || "Submit"}
        </button>
        </form>
    )    
}

export default CommonForm;