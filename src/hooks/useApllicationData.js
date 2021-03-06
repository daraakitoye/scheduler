import { useState, useEffect } from "react";
import axios from "axios";

export default function useAplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

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

  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        if (!state.appointments[id].interview) {
          state.days.map((day) => {
            if (day.appointments.includes(id)) {
              day.spots--;
              return day;
            } else {
              return day;
            }
          });
        }

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
      .then(() => {
        if (state.appointments[id].interview) {
          state.days.map((day) => {
            if (day.appointments.includes(id)) {
              day.spots++;
              return day;
            } else {
              return day;
            }
          });
        }

        setState({
          ...state,
          appointments,
        });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
