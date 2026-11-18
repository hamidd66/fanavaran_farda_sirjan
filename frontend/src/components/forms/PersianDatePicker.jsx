import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import opacity from "react-element-popper/animations/opacity";
import transition from "react-element-popper/animations/transition";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DateObject from "react-date-object";

import { weekDays } from 'constants/datePicker';
import "./persianDatePicker.css"

function PersianDatePicker({ changeHandler, value, fieldName, placeholder }) {
    const PickerDate = DatePicker.default;

    return (
        <PickerDate
            value={value ? new DateObject({ date: value, calendar: gregorian }).convert(persian, persian_fa) : ""}
            onChange={date => changeHandler(fieldName, date ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD") : "")}
            calendar={persian}
            locale={persian_fa}
            weekDays={weekDays}
            animations={[opacity(), transition({ from: 35, duration: 500 })]}
            calendarPosition="bottom-center"
            format="YYYY/MM/DD"
            inputClass="form-control w-100"
            placeholder={placeholder}
            highlightToday={false}
        />
    )
}

export default PersianDatePicker