import React from "react";
import DayList from "./DayList";
import { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Tuesday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  let dailyAppointments = [];

  const setDay = (day) => setState({ ...state, day });
  // const setDays = (days) => setState((prev) => ({ ...prev, days }));

  useEffect(() => {
    axios.get(`http://localhost:8001/api/days`).then((response) => {
      Promise.all([
        axios.get(` http://localhost:8001/api/days`),
        axios.get(`http://localhost:8001/api/appointments`),
        axios.get(`http://localhost:8001/api/interviewers`),
      ]).then((all) => {
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      });
    });
  }, []);

  dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    console.log("***-", appointment);

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    console.log("****", appointments);

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {
        setState({
          ...state,
          appointments,
        });
      });
  }

  function cancelInterview(id) {
    const cancelled = {
      ...state.appointments[id],
      interview: { ...state.appointments[id].interview },
    };

    cancelled.interview.interviewer = null;
    cancelled.interview.student = null;

    const appointments = {
      ...state.appointments,
      [id]: cancelled,
    };

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((response) => {
        setState({
          ...state,
          appointments,
        });
      });
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map((appointment) => {
          return (
            <Appointment
              key={appointment.id}
              {...appointment}
              interview={getInterview(state, appointment.interview)}
              interviewers={interviewers}
              bookInterview={bookInterview}
              cancelInterview={cancelInterview}
            />
          );
        })}
      </section>
    </main>
  );
}
