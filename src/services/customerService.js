import axios from "axios";

//const baseURL = process.env.REACT_APP_API_BASE_URL + "/api/customer";
const baseURL = 'https://localhost:7282/api/Customer';

const customerService = {
  signUp: async (customerData) => {
    try {
        const response = await axios.put(`${baseURL}/signUp`, customerData, {
            withCredentials: true, // Include cookies if needed
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {      
      
      throw error.response ? error.response.data : error.message;
    }
        
   },

  login: async (customerData) => {
    try {
      const response = await axios.post(`${baseURL}/login`, customerData, {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
      },
      });

      const { customer } = response.data;
      
      const userDate = { userId: null, userName: '' };
      userDate.userId = customer.UserId;
      userDate.userName = customer.UserName;    

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: () => {
    // Clear on logout
    // to do: clear the cookie on server and call this function
    localStorage.removeItem("userId");   
  },
  
};

export default customerService;
