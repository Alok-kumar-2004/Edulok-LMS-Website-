import { Link } from "react-router-dom";
import CommonForm from "@/components/common-form";
import * as Tabs from "@radix-ui/react-tabs";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { Box, Card, Flex, Text, Heading } from "@radix-ui/themes";

function Auth() {
  const [activeTab, setActiveTab] = useState('signin');
  const {
    signInFormData, setSignInFormData,
    signUpFormData, setSignUpFormData, handleRegisterUser, handleLoginUser
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (signInFormData &&
      signInFormData.userEmail !== "" && signInFormData.password !== "");
  }

  function handleTabChangeAfterLogin(event){
    event.preventDefault();
    handleRegisterUser(event).then(()=>{
      setActiveTab('signin')
    })    
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white shadow-sm">
        <Link to={"/"} className="flex items-center justify-center group">
          <AcademicCapIcon className="h-8 w-8 mr-3 text-indigo-600" />
          <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edulok
          </span>
        </Link>
      </header>
      
      <div className="flex items-center justify-center flex-1 p-4">
        <Flex direction="column" gap="4" className="w-full max-w-md">
          <Tabs.Root
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleTabChange}
            className="w-full"
          >
            <Tabs.List className="flex w-full mb-6">
              <Tabs.Trigger 
                value="signin"
                className={`flex-1 py-3 text-center font-medium transition-all border-b-2 ${
                  activeTab === 'signin' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sign In
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="signup"
                className={`flex-1 py-3 text-center font-medium transition-all border-b-2 ${
                  activeTab === 'signup' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sign Up
              </Tabs.Trigger>
            </Tabs.List>
            
            <Box className="p-1">
              <Tabs.Content value="signin" className="rounded-lg">
                <Card className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
                  <Flex direction="column" gap="4">
                    <Heading size="5" className="text-gray-800">Sign in to your account</Heading>
                    <Text size="2" className="text-gray-500">
                      Enter your email and password to access your account
                    </Text>
                    <CommonForm
                      formControls={signInFormControls}
                      buttonText="Sign In"
                      formData={signInFormData}
                      setFormData={setSignInFormData}
                      isButtonDisabled={!checkIfSignInFormIsValid()}
                      handleSubmit={handleLoginUser}
              
                    />
                  </Flex>
                </Card>
              </Tabs.Content>
              
              <Tabs.Content value="signup" className="rounded-lg">
                <Card className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
                  <Flex direction="column" gap="4">
                    <Heading size="5" className="text-gray-800">Create a new account</Heading>
                    <Text size="2" className="text-gray-500">
                      Enter your details to get started
                    </Text>
                    <CommonForm
                      formControls={signUpFormControls}
                      buttonText="Sign Up"
                      formData={signUpFormData}
                      setFormData={setSignUpFormData}
                      isButtonDisabled={!checkIfSignUpFormIsValid()}
                      handleSubmit={handleTabChangeAfterLogin}
                    />
                  </Flex>
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