import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

import { registerStudent } from 'services/user';
import { registerStudentFields } from 'constants/inputFields';
import PersianDatePicker from 'components/forms/PersianDatePicker';
import DropdownInput from 'components/forms/DropdownInput';
import ImagePicker from 'components/forms/ImagePicker';

function Register({ refetch }) {
  const [form, setForm] = useState({
    avatar: null,
    username: '',
    national_code: '',
    phone: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    father_name: '',
    birth_date: '',
    gender: '',
    address: '',
    bio: '',
    field_of_study: '',
    education_level: '',
    referral_source: '',
    parent_phone: '',
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries('currentUser');
    },
    onError: e => console.log(e.data),
  })

  const formHandler = e => {
    e.preventDefault();

    if (!form.national_code || !form.phone || !form.password || !form.first_name || !form.last_name || !form.father_name || !form.birth_date || !form.gender || !form.address || !form.education_level || !form.referral_source || !form.parent_phone) {
      toast.error("لطفا فیلد ها را پر کنید", { id: 'CheckFieldsComplete' });
      return
    };

    const formDataObject = { ...form };
    delete formDataObject.avatar;

    const formData = new FormData();
    formData.append("data", JSON.stringify(formDataObject));

    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    mutate(formData);
  }

  const changeHandler = (event, value) => {
    if (event?.target?.name == "avatar") {
      const file = event.target.files?.[0];
      if (file) setForm({ ...form, [event.target.name]: file });
      return
    }
    if (value !== undefined) {
      setForm(prevForm => ({ ...prevForm, [event]: value }));
      return;
    }
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <div className="panels">
      <div className="panel mt-4">
        <p className="card-subtitle">جهت ثبت نام لطفا با دقت اطلاعات خود را وارد کنید</p>
        <form onSubmit={formHandler} className='mt-4'>

          {registerStudentFields.map(item => (
            <div key={item.name}>

              {item.name == "avatar" && (
                <ImagePicker image={form.avatar} changeHandler={changeHandler} />
              )}

              {!["file", "date", "list"].includes(item.type) && (
                <div className="form-group">
                  <label className="form-label" htmlFor={item.name}>
                    {item.label}
                  </label>
                  <div className="input-wrap">
                    <input
                      id={item.name}
                      type={item.type}
                      name={item.name}
                      className={`form-control ${item.moreClasses}`}
                      placeholder={item.placeholder}
                      value={form[item.name]}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              )}

              {item.type == "date" && (
                <div className="form-group">
                  <label className="form-label">
                    {item.label}
                  </label>
                  <div className="input-wrap">
                    <PersianDatePicker
                      changeHandler={changeHandler}
                      value={form[item.name]}
                      fieldName={item.name}
                      placeholder={item.placeholder}
                    />
                  </div>
                </div>
              )}

              {item.type == "list" && (
                <div className="form-group">
                  <label className="form-label">
                    {item.label}
                  </label>
                  <div className='input-wrap'>
                    <DropdownInput
                      list={item.list}
                      fieldName="gender"
                      value={form.gender}
                      changeHandler={changeHandler}
                      defaultName={item.placeholder}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button type="submit" className="btn-main">
            ورود
          </Button>

          <Link to="/" className="link-back-home">
            بازگشت به صفحه اصلی
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Register