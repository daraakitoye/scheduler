import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  console.log("sup", props.value);
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected ": props.selected,
    "day-list__item--full": props.spots === 0,
  });

  // const formatSpots = () => {
  //  props.spots === 1 ? <h3 className="text--light">1 spot remaining</h3>
  //  : null;
  //   props.spots === 0 ? <h3 className="text--light">no spots remaining</h3>
  //  : null;
  //  props.spots > 1 ? (<h3 className="text--light"> {props.spots} spots remaining</h3> : null
  // };

  return (
    <li className={dayClass} onClick={props.setDay} selected={props.selected}>
      <h2 className="text--regular">{props.name}</h2>
      {props.spots === 1 && <h3 className="text--light">1 spot remaining</h3>}
      {props.spots === 0 && <h3 className="text--light">no spots remaining</h3>}
      {props.spots > 1 && (
        <h3 className="text--light">{props.spots} spots remaining</h3>
      )}
    </li>
  );
}
