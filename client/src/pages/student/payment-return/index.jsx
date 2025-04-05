import { captureAndFinalizePaymentService } from "@/services";
import { Card } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// function PaypalPaymentReturnPage() {
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const paymentId = params.get("paymentId");
//     const payerId = params.get("PayerID");

//     console.log("PayerID:", payerId, "PaymentID:", paymentId);

//     useEffect(() => {
//         if (paymentId && payerId) {
//           async function capturePayment() {
//             const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    
//             const response = await captureAndFinalizePaymentService(
//               paymentId,
//               payerId,
//               orderId
//             );
    
//             if (response?.success) {
//               sessionStorage.removeItem("currentOrderId");
//               window.location.href = "/student-courses";
//             }
//             console.log(response);
            
//           }
    
//           capturePayment();
//         }
//       }, [payerId, paymentId]);
    
//     return (
//         <Card className="p-4 max-w-md mx-auto mt-8">
//         <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
//             <p className="text-lg">Processing payment... Please wait</p>
//         </div>
//     </Card>
//     );
// }

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, message: "Processing payment... Please wait" });
  
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const paymentId = params.get("paymentId");
      const payerId = params.get("PayerID");

      console.log("PayerID:", payerId, "PaymentID:", paymentId);

      if (paymentId && payerId) {
          async function capturePayment() {
              try {
                  const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
                  
                  if (!orderId) {
                      setStatus({ 
                          loading: false, 
                          message: "Error: Order information not found. Please try again or contact support." 
                      });
                      return;
                  }
                  
                  const response = await captureAndFinalizePaymentService(
                      paymentId,
                      payerId,
                      orderId
                  );
                  
                  if (response?.success) {
                      sessionStorage.removeItem("currentOrderId");
                      setStatus({ loading: false, message: "Payment successful! Redirecting..." });
                      setTimeout(() => navigate("/student-courses"), 2000);
                  } else {
                      setStatus({ 
                          loading: false, 
                          message: "Payment processing failed. Please contact support." 
                      });
                  }
              } catch (error) {
                  console.error("Payment error:", error);
                  setStatus({ 
                      loading: false, 
                      message: "An error occurred while processing your payment. Please contact support." 
                  });
              }
          }
          
          capturePayment();
      } else {
          setStatus({ 
              loading: false, 
              message: "Invalid payment information. Please try again or contact support." 
          });
      }
  }, [location.search, navigate]);
  
  return (
      <Card className="p-4 max-w-md mx-auto mt-8">
          <div className="text-center">
              {status.loading && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              )}
              <p className="text-lg">{status.message}</p>
          </div>
      </Card>
  );
}

export default PaypalPaymentReturnPage;