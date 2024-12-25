import axios from "axios";
//const baseURL = process.env.REACT_APP_API_BASE_URL + "/api/customer";
const baseURL = 'https://localhost:7282/api/Customer';

const authService = {
   
    isAuthenticated: async () => {
    try {
        const response = await axios.get(`${baseURL}/current`, { withCredentials: true });
            return response.data; // returns customer data if authenticated, i only return the userId for this app
    } catch (error) {
        return null; // unauthorized
    }
    }
    
};
export default authService;