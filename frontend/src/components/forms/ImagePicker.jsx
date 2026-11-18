import { FaRegCircleUser, FaUpload } from "react-icons/fa6"
import "./imagePicker.css"

function ImagePicker({ image, changeHandler }) {
    return (
        <div className="admin-avatar-upload-section mt-2 mb-4">
            <div className="admin-avatar-preview-box">
                {image instanceof File ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" className="admin-avatar-preview-img" />
                ) : (
                    <FaRegCircleUser fontSize="28px" color="#94a3b8" />
                )}
            </div>
            <div className="admin-avatar-upload-actions">
                <label className="admin-btn-secondary admin-avatar-upload-btn">
                    <FaUpload fontSize="15px" />
                    انتخاب تصویر
                    <input type="file" accept="image/*" name='avatar' onChange={changeHandler} style={{ display: 'none' }} />
                </label>
                <span className="admin-avatar-hint">فرمت‌های JPG، PNG (حداکثر ۲ مگابایت)</span>
            </div>
        </div>
    )
}

export default ImagePicker