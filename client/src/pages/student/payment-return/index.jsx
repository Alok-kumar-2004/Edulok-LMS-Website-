import { captureAndFinalizePaymentService } from "@/services";
import { Card } from "@radix-ui/themes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    console.log("PayerID:", payerId, "PaymentID:", paymentId);

    useEffect(() => {
        if (paymentId && payerId) {
          async function capturePayment() {
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    
            const response = await captureAndFinalizePaymentService(
              paymentId,
              payerId,
              orderId
            );
    
            if (response?.success) {
              sessionStorage.removeItem("currentOrderId");
              window.location.href = "/student-courses";
            }
            console.log(response);
            
          }
    
          capturePayment();
        }
      }, [payerId, paymentId]);
    
    return (
        <Card className="p-4 max-w-md mx-auto mt-8">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg">Processing payment... Please wait</p>
        </div>
    </Card>
    );
}

export default PaypalPaymentReturnPage;