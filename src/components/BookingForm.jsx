import React, { useState, useEffect } from "react";
import moment from "moment";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

const BookingForm = ({ hideBookingForm, bookingInfo, createBooking }) => {
  const { user, date } = bookingInfo;
  const [bookingDate, setBookingDate] = useState({});

  const handleChange = (newDate) => {
    if (newDate[1]) {
      setBookingDate({
        from: moment(newDate[0]).format("YYYY-MM-DD"),
        to: moment(newDate[1]).format("YYYY-MM-DD"),
      });
    }
  };

  const confirmBooking = () => {
    createBooking(user, bookingDate);
    hideBookingForm();
  };

  return (
    <div className="formBackground">
      <div className="form">
        <p>Book user {user}</p>
        <p>
          From {bookingDate.from} to {bookingDate.to}
        </p>
        <Flatpickr
          data-enable-time
          value={date}
          options={{ minDate: moment(), mode: "range", enableTime: false }}
          onChange={handleChange}
        />

        <button onClick={confirmBooking}>Close</button>
      </div>
    </div>
  );
};

export default BookingForm;
