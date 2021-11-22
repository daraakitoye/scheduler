export function getAppointmentsForDay(state, day) {
  const daysArr = state.days.filter((o) => o.name === day);
  let appointment = [];

  if (daysArr.length) {
    appointment = daysArr[0].appointments.map((x) => state.appointments[x]);
  }

  return appointment;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewData = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer],
  };

  return interviewData;
}
