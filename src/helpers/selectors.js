export function getAppointmentsForDay(state, day) {
  const days = state.days.filter((d) => d.name === day);
  let appointment = [];

  if (days.length) {
    appointment = days[0].appointments.map((x) => state.appointments[x]);
  }

  return appointment;
}

export function getInterviewersForDay(state, day) {
  const days = state.days.map((d) => d.name);
  const currentDay = state.days.filter((d) => d.name === day);

  if (!days || days.indexOf(day) === -1) {
    return [];
  }
  const interviewers = currentDay[0].interviewers.map(
    (idNum) => state.interviewers[idNum]
  );
  return interviewers;
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
