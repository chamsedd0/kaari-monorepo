import CalendarComponentBaseModel from "../../../styles/constructed/calendar/calendar-base-model-style";
import UpIcon from '../../../skeletons/icons/arrow-down.svg'


const CalendarComponent = () => {

  return (
    <CalendarComponentBaseModel>
      <div className="chosen-date">05.01.2025</div>

      <div className="control-date">
        <div className="month-select">
            <span>Month</span>
            <div className="controls">
                <button className="up">
                    <img src={UpIcon} alt="" />
                </button>
                <button className="down">
                    <img src={UpIcon} alt="" />
                </button>
            </div>
        </div>
        <div className="year-select">
            <span>Year</span>
            <div className="controls">
                <button className="up">
                    <img src={UpIcon} alt="" />
                </button>
                <button className="down">
                    <img src={UpIcon} alt="" />
                </button>
            </div>
        </div>
      </div>

      <div className="calendar">
        <div className="days-enum">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="day">
              {day}
            </div>
          ))}
        </div>

        <div className="day-numbers">
          {[...Array(31)].map((_, i) => (
            <div key={i} className="day-number-box">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </CalendarComponentBaseModel>
  );
};

export default CalendarComponent;
