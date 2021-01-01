import React, { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const Calendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [bookingInfo, setBookingInfo] = useState();
  const [newBooking, setNewBooking] = useState(true);
  const [users, setUsers] = useState([
    {
      id: 1,
      bookings: [
        {
          from: "2021-01-1",
          to: "2021-01-3",
        },
        {
          from: "2021-01-17",
          to: "2021-01-19",
        },
        {
          from: "2021-03-17",
          to: "2021-03-19",
        },
      ],
      off: [
        {
          from: "2021-01-10",
          to: "2021-01-11",
        },
        {
          from: "2021-01-15",
          to: "2021-01-15",
        },
      ],
    },
    { id: 2, bookings: [], off: [] },
    { id: 3, bookings: [], off: [] },
    { id: 4, bookings: [], off: [] },
    { id: 5, bookings: [], off: [] },
    { id: 6, bookings: [], off: [] },
    { id: 7, bookings: [], off: [] },
  ]);

  const createBooking = (user, bookingDate) => {
    const updatedUser = users.find((u) => u.id === user);
    updatedUser.bookings.push({ from: bookingDate.from, to: bookingDate.to });
    const filtered = users.filter((u) => u.id !== user);
    setUsers([...filtered, updatedUser]);
  };
  const unavailable = (user, day, type) => {
    let notAvailable = false;
    const ranges = users
      .find((u) => u.id === user.id)
      [`${type}`].map((booking) => {
        const start = moment(booking.from, "YYYY-MM-DD");
        const end = moment(booking.to, "YYYY-MM-DD");
        return moment.range(start, end);
      });
    ranges.forEach((range) => {
      const strfDay = day.format("YYYY-MM-DD");
      if (range.contains(moment(strfDay))) {
        notAvailable = true;
      }
    });
    return notAvailable;
  };

  const checkAvailability = (user, day) => {
    if (!user || !day) return;
    if (unavailable(user, day, "bookings")) {
      return "booked";
    } else if (unavailable(user, day, "off")) {
      return "off";
    }
    return "free";
  };
  console.log(users);
  const addDays = () => {
    let final = [];
    const startWeek = moment().add(monthOffset, "M").startOf("month").week();
    const endWeek = moment().add(monthOffset, "M").endOf("month").week();
    for (var week = startWeek; week < endWeek; week++) {
      final.push({
        week,
        days: Array(7)
          .fill(0)
          .map((n, i) =>
            moment()
              .week(week)
              .startOf("week")
              .clone()
              .add(n + i, "day")
          ),
      });
    }
    return final;
  };

  useEffect(() => {
    setCalendar((prev) => [...prev, ...addDays()]);
  }, [monthOffset]);

  const handleScroll = (e) => {
    if (
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft <=
      e.currentTarget.offsetWidth
    ) {
      setMonthOffset((prev) => prev + 1);
    }
  };

  return (
    <>
      {bookingInfo ? (
        <BookingForm
          createBooking={createBooking}
          bookingInfo={bookingInfo}
          hideBookingForm={() => setBookingInfo()}
        />
      ) : null}
      <div className="container" onScroll={handleScroll}>
        <div className="calendarWrapper">
          <div className="calendarHeader">
            {calendar.map((week, index) => (
              <div key={index} className="weekWrapper">
                <div>Week {week.week}</div>
              </div>
            ))}
          </div>
          <div className="daysWrapper">
            {users
              .sort((a, b) => a.id - b.id)
              .map((user) => (
                <div key={user.id} id={newBooking} className="userRow">
                  {calendar.map((week) =>
                    week.days.map((day, i) => (
                      <div className="dayWrapper">
                        <div
                          className={`bookedField ${checkAvailability(
                            user,
                            day
                          )}`}
                        ></div>
                        <div
                          key={i}
                          onClick={() => {
                            console.log(user.id);
                            setBookingInfo({
                              user: user.id,
                              date: day.format(),
                            });
                          }}
                          className={`dayBox ${
                            day.format("M") % 2 === 0 ? "white" : "gray"
                          }`}
                        >
                          <span>
                            {day.format("MMM")} {day.format("D")}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
