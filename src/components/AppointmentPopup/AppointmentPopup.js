import React from 'react';
import DatePicker from "react-datepicker";
import { formatDate } from "../../utils/helper";  // Adjust the path if needed


const AppointmentPopup = ({ appointment, handleUpdate, handleDelete, handleClosePopup }) => {
  return (
    <>
      <div className="popup-overlay" onClick={handleClosePopup}></div>
      <div className="popup">
        <h3>Appointment Details</h3><br />
        <p><strong>Name:</strong> {appointment.fullName}</p>
        <p><strong>Created at:</strong> {formatDate(appointment.createDate)}</p>
        <div className="date-update-section">
          <label htmlFor="appointmentTime"><strong>Appointment Time:</strong></label>
          <DatePicker
            id="appointmentTime"
            selected={new Date(appointment.appointmentTime)}
            onChange={(date) => {
              handleUpdate({ ...appointment, appointmentTime: date.toISOString() });
            }}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>
        {appointment.customerId === parseInt(localStorage.getItem("userId")) && (
          <>
            <br />
            <button className="btn btn-primary" onClick={() => handleUpdate(appointment)}>
              Update
            </button>
            <button className="btn btn-primary" onClick={() => handleDelete(appointment.appointmentId)}>
              Delete
            </button>
          </>
        )}
        <button className="btn btn-primary" onClick={handleClosePopup}>Close</button>
      </div>
    </>
  );
};

export default AppointmentPopup;