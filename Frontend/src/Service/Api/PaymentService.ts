import axios from "./Axios/Useraxios";

export const PaymentService = {
  createCheckoutSession: async () => {
    const response = await axios.post("/payment/create-checkout-session");
    return response.data;
  },
};
