import { Dropdown } from "react-bootstrap"

function DropdownInput({ list, value, fieldName, changeHandler, defaultName }) {
    return (
        <Dropdown className='w-100'>
            <Dropdown.Toggle variant="light" className='w-100 fw-light form-control'>
                {list.find(item => item.value == value)?.label || defaultName}
            </Dropdown.Toggle>
            <Dropdown.Menu className='w-100'>
                {list.map(item => (
                    <Dropdown.Item key={item.value} onClick={() => changeHandler(fieldName, item.value)}>{item.label}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default DropdownInput