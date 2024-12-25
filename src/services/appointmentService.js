import axios from "axios";

//const baseURL = process.env.REACT_APP_API_BASE_URL + "/api/appointments"; // Change to appointments endpoint
const baseURL = 'https://localhost:7282/api/Appointment';

const appointmentService = {
    
  
  getAppointments: async () => {

    try {
      const response = await axios.get(`${baseURL}/GetAppointments`, { withCredentials: true });
      return response.data;
       
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  addAppointment: async (appointmentData) => {
    try {
        const response = await axios.put(`${baseURL}/AddAppointment`, appointmentData, {
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

  
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await axios.delete(`${baseURL}/${appointmentId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  
  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      const response = await axios.post(`${baseURL}/update/`, appointmentData, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default appointmentService;
