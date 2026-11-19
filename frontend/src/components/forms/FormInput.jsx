import DropdownInput from "./DropdownInput"
import ImagePicker from "./ImagePicker"
import PersianDatePicker from "./PersianDatePicker"
import "./formInput.css"

function FormInput({ label, name, type = "text", value = "", moreClasses = "", placeholder = "", changeHandler, list = [] }) {
    if (type === "file") return (
        <ImagePicker image={value} changeHandler={changeHandler} />
    )
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={name}>
                {label}
            </label>
            <div className="input-wrap">
                {!["date", "list"].includes(type) && (
                    <input
                        id={name}
                        type={type}
                        name={name}
                        className={`form-control${moreClasses ? " " + moreClasses : ""}`}
                        placeholder={placeholder}
                        value={value}
                        onChange={changeHandler}
                    />
                )}
                {type === "date" && (
                    <PersianDatePicker
                        changeHandler={changeHandler}
                        value={value}
                        fieldName={name}
                        placeholder={placeholder}
                    />
                )}
                {type === "list" && (
                    <DropdownInput
                        list={list}
                        fieldName={name}
                        value={value}
                        changeHandler={changeHandler}
                        defaultName={placeholder}
                    />
                )}
            </div>
        </div>
    )
}

export default FormInput