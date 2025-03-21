// // import { Button } from "@radix-ui/themes";
// import { Button } from "@radix-ui/themes";
// import FormControls from "./form-control";
// // import { ButtonIcon } from "@radix-ui/react-icons";


// function CommonForm ({handleSubmit,buttonText,formControls=[],formData,setFormData,isButtonDisabled}) {
//     return ( 
//         <form onSubmit={handleSubmit}>
//             <FormControls
//             formControls={formControls}
//             formData={formData}
//             setFormData={setFormData}
//             />
//          <Button disabled={isButtonDisabled} type="submit" 
//             className={`mt-6 p-2 w-full text-white rounded-3xl 
//                 ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
//             {buttonText || "Submit"}
//         </Button>
//         </form>
//     )    
// }

// export default CommonForm;
import { Button } from "@radix-ui/themes";
import FormControls from "./form-control";

function CommonForm({
  handleSubmit,
  buttonText = "Submit",
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button 
        disabled={isButtonDisabled} 
        type="submit"
        className={`mt-6 py-3 w-full text-white font-medium rounded-lg transition-all duration-300 shadow-sm
          ${isButtonDisabled 
            ? 'bg-gray-300 cursor-not-allowed opacity-70' 
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]'}`}
      >
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;