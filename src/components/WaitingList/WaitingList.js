import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import './WaitingList.scss';
import appointmentService from "../../services/appointmentService";
import autoService from "../../services/authService";
import {formatDate} from "../../utils/helper";
import AppointmentPopup from '../AppointmentPopup/AppointmentPopup'; 
//import { useAuth } from '../../context/authProvider';

const WaitingList = () => {
  //const { userId } = useAuth();
 
  //const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); 
 
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showAppointmentForm, setShowAppointmentForm] = useState(false); 
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  
  
   const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments(); // Fetch appointments
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };


  useEffect(() => {
    
// Check if user is authenticated
      const checkAuthentication = async () => {
      try {       
          const id = await autoService.isAuthenticated();
          if (id) {       
            localStorage.setItem('userId', id);   
            setShowFilters(true);     
          }else
          {
            navigate('/Login');
          }

      } catch (error) {        
        localStorage.removeItem('userId');        
      }
    };

    checkAuthentication(); 
    fetchAppointments();

  }, [navigate]);



  const handleAddAppointmentClick = () => {
    setShowAppointmentForm(true);
  };

  const handleCloseAppointmentForm = () => {
    setShowAppointmentForm(false);  // Close when x click
    setError('');  // clear errors
  };

  const handleSaveAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and a time.');
      return;
    }
  
    
    const appointmentTime = new Date(`${selectedDate}T${selectedTime}:00`);
       
    if (isNaN(appointmentTime)) {
      setError('Invalid date or time. Please try again.');
      return;
    }
  
    const currentTime = new Date();
    const timeDifferenceInHours = (appointmentTime - currentTime) / (1000 * 60 * 60); // Convert difference to hours
  
    if (timeDifferenceInHours < 5) {
      setError('Appointment must be at least 5 hours from now.');
      return;
    }
  
    try {
      //to do: validate availability
      //const availabilityResponse = await appointmentService.checkAppointmentConflict(appointmentTime);       
     
      await appointmentService.addAppointment({
        customerId: localStorage.getItem('userId'),
        appointmentTime: appointmentTime.toISOString(), 
      });
  
      alert('Appointment saved successfully!');
      setShowAppointmentForm(false);  
      fetchAppointments();  
  
    } catch (error) {
      
      setError('There was an error.');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentService.deleteAppointment(appointmentId);
        setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
        setFilteredAppointments(filteredAppointments.filter(app => app.appointmentId !== appointmentId));
        setShowPopup(false);
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleUpdate = async (updatedAppointment) => {
    try {
      
      await appointmentService.updateAppointment(
        updatedAppointment.appointmentId,
        updatedAppointment
      );
      
      fetchAppointments();
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handlePopupOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedAppointment(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterData(e.target.value, startDate, endDate);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterData(searchTerm, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterData(searchTerm, startDate, date);
  };

  const filterData = (name, start, end) => {
    const normalizeDate = (date) => {
     
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return normalizedDate;
    };
  
    let filtered = appointments.filter((appointment) => {
      const arrivalDate = normalizeDate(appointment.appointmentTime); 
      const startDate = start ? normalizeDate(start) : null; 
      const endDate = end ? normalizeDate(end) : null; 
        
      const isNameMatch = appointment.fullName && appointment.fullName.toLowerCase().includes(name.toLowerCase());
          
      const isDateInRange =
        (!startDate || arrivalDate >= startDate) && 
        (!endDate || arrivalDate <= endDate);      
  
      return isNameMatch && isDateInRange;
    });  
   
    setFilteredAppointments(filtered);
  };

  return (
    <div>
      {/* Add Appointment Button */}
      <div className="add-appointment">
        <div>
        <button
          className="btn btn-primary"
          style={{ float: 'left', marginRight: '20px' }}
          onClick={handleAddAppointmentClick}
        >
          Add Appointment
        </button>
        </div>

      {/* New Appointment Form */}
      {showAppointmentForm && (
        <div className="add-container" >
          <div className="row">
            <div className="col-12">
              
              <button 
                className="btn btn-danger" 
                style={{ float: 'right', marginBottom: '10px',backgroundColor:'#3e3e43',border:'none' }} 
                onClick={handleCloseAppointmentForm}
              > X </button>
              
              <input
                type="date"
                className="form-control mb-2"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              {/* Time Picker */}
              <select style={{minWidth:'140px'}}
                className="form-control mb-2"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option key="0" value="">Select Time</option>
                {[...Array(52)].map((_, index) => {
                  const hour = Math.floor(index / 4) + 8; // 8:00 to 19:45
                  const minute = (index % 4) * 15;
                  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
             
              <button className="btn btn-success" style={{height:'min-content',float:'right'}} onClick={handleSaveAppointment}>
                Save
              </button>              
            </div>
          </div>
        </div>
      )}        
        
        {error && <div className="text-danger mt-2">{error}</div>}
     </div>
      {/* filters */}
      
      <div className="filters">       
         <div className="filter-input">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div><FaCalendarAlt className="calendar-icon" /></div>
        <div className="filter-input datepicker-container">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select Start Date"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div><FaCalendarAlt className="calendar-icon" /></div>
        <div className="filter-input datepicker-container">
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Select End Date"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
     {/* filters end */}

      <div className="table-container">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Appoitment Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.fullName}</td>
                <td>{formatDate(appointment.appointmentTime)}</td>
                <td>
                  <button style={{fontSize:'12px',backgroundColor:' #484646',border:'none'}} className="btn btn-primary" onClick={() => handlePopupOpen(appointment)}>View</button>
                  {appointment.customerId === localStorage.getItem("userId") && localStorage.getItem("userId") != null && (
                    <>
                      <button onClick={() => handleDelete(appointment.appointmentId)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      {showPopup && selectedAppointment && (
        <>
        <AppointmentPopup
          appointment={selectedAppointment}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleClosePopup={handlePopupClose}
        />
        </>
      )}
     
    </div>
  );
};

export default WaitingList;
