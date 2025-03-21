
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/auth-context';
import InstructorProvider from './context/instructor-context/index.jsx';
import StudentProvider from './context/student-context';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Theme>
   <AuthProvider>
    <InstructorProvider>
      <StudentProvider>
        <App/>
      </StudentProvider>
    </InstructorProvider>
   </AuthProvider>
  </Theme>
  </BrowserRouter>
)
