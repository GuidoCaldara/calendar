import React, { useState, useEffect } from "react";
import BookingForm from "./BookingForm";

import moment from "moment";
const Calendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [bookingInfo, setBookingInfo] = useState();

  const users = [
    {
      id: 1,
    },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

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
            {users.map((user) => (
              <div key={user.id} className="userRow">
                {calendar.map((week) =>
                  week.days.map((day, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setBookingInfo({ user: user.id, date: day.format() })
                      }
                      className={`dayBox ${
                        day.format("M") % 2 === 0 ? "white" : "gray"
                      }`}
                    >
                      <span>
                        {day.format("MMM")} {day.format("D")}
                      </span>
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
