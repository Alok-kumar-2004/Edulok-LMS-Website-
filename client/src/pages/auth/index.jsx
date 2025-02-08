import { Link } from "react-router-dom";
import CommonForm from "@/components/common-form";
import * as Tabs from "@radix-ui/react-tabs";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { Box, Card, Flex } from "@radix-ui/themes";
function Auth() {
    const [activeTab,setActiveTab] = useState('signin')
    const {
      signInFormData,setSignInFormData,
        signUpFormData,setSignUpFormData
    } = useContext(AuthContext)
    function handleTabChange(value){
      setActiveTab(value)
    }
    function checkIfSignInFormIsValid(){
      return (signInFormData &&
         signInFormData.userEmail!=="" && signInFormData.password!=="")
    }
    function checkIfSignUpFormIsValid(){
      return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
      )
    }

    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link to={"/"} className="flex items-center justify-center">
            <AcademicCapIcon className="h-8 w-8 mr-4" />
            <span className="font-extrabold text-xl"> Edulok</span>
          </Link>
        </header>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Flex direction="column" gap="4" pb="3">
          <Tabs.Root
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleTabChange}
            className="w-full max-w-md"
          >
            <Tabs.List className="grid w-full grid-cols-2 border-b">
              <Tabs.Trigger value="signin" className="p-2 text-center mt-4 ">
                Sign In
              </Tabs.Trigger>
              <Tabs.Trigger value="signup" className="p-2 text-center mt-4 ">
                Sign Up
              </Tabs.Trigger>
            </Tabs.List>
            <Box pt="2">
            <Tabs.Content value="signin" className="p-6 border rounded-lg shadow-md space-y-4">
              <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Sign in to your account</h2>
              <p className="text-gray-500">Enter your email and password to access your account</p>
              <CommonForm
                formControls={signInFormControls}
                buttonText="Sign In"
                formData={signInFormData}
                setFormData={setSignInFormData}
                isButtonDisabled={!checkIfSignInFormIsValid()}
                // handleSubmit={handleLoginUser}
              />
              </Card>
            </Tabs.Content>
            
            <Tabs.Content value="signup" className="p-6 border rounded-lg shadow-md space-y-4 ">
              <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Create a new account</h2>
              <p className="text-gray-500">Enter your details to get started</p>
              <CommonForm
                formControls={signUpFormControls}
                buttonText="Sign Up"
                formData={signUpFormData}
                setFormData={setSignUpFormData}
                isButtonDisabled={!checkIfSignUpFormIsValid()}
                // handleSubmit={handleRegisterUser}
              />
              </Card>
            </Tabs.Content>
            </Box>
          </Tabs.Root>
          </Flex>
        </div>
      </div>
    );
}

export default Auth;