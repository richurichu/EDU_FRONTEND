import React from 'react'
import { useRef,useEffect } from 'react';
import useApi from '../../Axios_instance/axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function PayPalComponent({ course,refresh,setmodal,paymodal}) {
    const courseCopy = { ...course };
    const coursePrice = courseCopy.price;
    console.log(coursePrice,'=====================================')

    
    const coursePriceRef = useRef(courseCopy.price);
    console.log(courseCopy.id)
    console.log(courseCopy.price)
    const api  = useApi()
   
    

    const handlePaymentComplete = async (details) => {
        console.log(coursePrice,'888888888888888888888888888888888888')
        console.log(details.id,'77777777777777777777777777777777777')
        try {
            const response = await api.post('courses-about/handle_payment/', {
                orderId: details.id,
                courseId: courseCopy.id
            });
            if (response.data.success) {

                refresh()
                setmodal(false)
                paymodal(true)
                console.log('payment successfull')
            } else {
                // Handle failure logic
            }
        } catch (error) {
            console.error("Error handling payment:", error);
        }
    };

    return (
        <>
           
            <PayPalScriptProvider options={{ "client-id": "AbCASLvwWw6V1PZsqomXD4svWf3mQNYlnn8R_CLlfOy8XjqLef6q4btUj99KkXRnv7bh3bHiVH4Shblj" }}>
                <PayPalButtons 
                
                
                
                    createOrder={(data, actions) => {
                        console.log(coursePriceRef.current,'--------------------------------------------------------')
                        
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: coursePriceRef.current,
                                    currency_code: 'USD'
                                }
                            }]
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(details => {
                            console.log(details,'=========================-++++++++++++++++++++++++++++')
                            handlePaymentComplete(details);
                        });
                    }}
                />
            </PayPalScriptProvider>
        </>
    );
}


export default PayPalComponent

