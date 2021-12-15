import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  queryByText,
  getAllByTestId,
  fireEvent,
  prettyDOM,
  queryByAltText,
  getByAltText,
} from "@testing-library/react";

import DayListItem from "components/DayListItem";
import Application from "components/Application";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<DayListItem />);
});

it("renders 'no spots remaining' when there are 0 spots", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={0} />);
  expect(getByText("no spots remaining")).toBeInTheDocument();
});

it("renders '1 spot remaining' when there is 1 spot", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={1} />);
  expect(getByText("1 spot remaining")).toBeInTheDocument();
});

it("renders '2 spots remaining' when there are 2 spots", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={2} />);
  expect(getByText("2 spots remaining")).toBeInTheDocument();
});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />);
  // 2. Wait until the text "Leopold Silvers" is displayed.
  await waitForElement(() => getByText(container, "Leopold Silvers"));
  // 3. Click the "Delete" button on the booked appointment.
  const appointment = getAllByTestId(container, "appointment").find(
    (appointment) => queryByText(appointment, "Leopold Silvers")
  );
  // 4. Check that the confirmation message is shown.
  fireEvent.click(queryByAltText(appointment, "Delete"));

  // 5. Click the "Confirm" button on the confirmation.
  fireEvent.click(queryByText(appointment, "Confirm"));
  // 6. Check that the element with the text "Deleting" is displayed.
  expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  // 7. Wait until the element with the "Add" button is displayed.
  await waitForElement(() => getByAltText(appointment, "Add"));
  // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
  // expect(
  //   getByText(appointment, "Delete this appointment?")
  // ).toBeInTheDocument();
  debug();
  console.log(prettyDOM);
});
