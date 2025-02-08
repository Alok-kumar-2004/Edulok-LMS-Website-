export const signUpFormControls=[
    {
        name:'userName',
        label:'User name',
        placeholder: 'Enter your name',
        type : 'text',
        componentType:'input'
    },
    {
        name:'userEmail',
        label:'User Email',
        placeholder: 'Enter your user Email',
        type : 'email',
        componentType:'input'
    },
    {
        name:'password',
        label:'User password',
        placeholder: 'Enter your password',
        type : 'text',
        componentType:'password'
    },

]

export const signInFormControls=[
    {
        name:'userEmail',
        label:'User Email',
        placeholder: 'Enter your user Email',
        type : 'email',
        componentType:'input'
    },
    {
        name:'password',
        label:'User password',
        placeholder: 'Enter your password',
        type : 'text',
        componentType:'password'
    },

]

export const initialSignInFormData=[
   { 
    userEmail : '',
    password : ""
   }
]

export const initialSignUpFormData=[
    { 
     userName:"",   
     userEmail : '',
     password : "",
    }
 ]