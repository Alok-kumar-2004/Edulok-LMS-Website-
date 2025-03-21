
// import { Navigate,useLocation } from "react-router-dom";
// import { Fragment } from "react";

// function RouteGuard ({authenticated,user,element}){
//     const location = useLocation();

//     console.log(authenticated);
//     console.log(user);
    
    
//     if(!authenticated && !location.pathname.includes("/auth")){
//         return <Navigate to={'/auth'}/>
//     }
//     if(authenticated && user?.role !=='instructor' && (location.pathname.includes('instructor') || location.pathname.includes('/auth'))){
//         return <Navigate to="/home"/>
//     }
//     if(authenticated && user.role==='instructor' && !location.pathname.includes('instructor')){
//         return<Navigate to= "/instructor"/>
//     }
//     return <Fragment>
//         {element}
//     </Fragment>
// }
// export default RouteGuard
import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
    const location = useLocation();

    // List of public routes that don't require authentication
    const publicRoutes = ["/auth", "/payment-return","/student-courses"];
    const isPublicRoute = publicRoutes.some(route => location.pathname.includes(route));

    // Don't redirect if it's a public route
    if (!authenticated && !isPublicRoute) {
        return <Navigate to="/auth" />;
    }

    // Handle instructor routes
    if (authenticated && user?.role !== 'instructor' && 
        (location.pathname.includes('instructor') || location.pathname.includes('/auth'))) {
        return <Navigate to="/home" />;
    }

    // Redirect instructors to their dashboard
    if (authenticated && user?.role === 'instructor' && 
        !location.pathname.includes('instructor')) {
        return <Navigate to="/instructor" />;
    }

    return (
        <Fragment>
            {element}
        </Fragment>
    );
}

export default RouteGuard;