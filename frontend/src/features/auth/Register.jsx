import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

import { registerStudent } from 'services/user';
import { registerStudentFields } from 'constants/inputFields';
import FormInput from 'components/forms/FormInput';
import { FormChangeHandler, areRequiredFieldsFilled } from 'utils/form';

const initialForm = {
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
}

const requiredFields = [
    'national_code',
    'phone',
    'password',
    'first_name',
    'last_name',
    'father_name',
    'birth_date',
    'gender',
    'address',
    'education_level',
    'referral_source',
    'parent_phone',
];

function Register({ refetch }) {
    const [form, setForm] = useState(initialForm);
    const changeHandler = FormChangeHandler(setForm);
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: registerStudent,
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries({
                queryKey: ['currentUser']
            });
        },
        onError: e => console.error(e.data),
    })

    const formHandler = e => {
        e.preventDefault();

        if (!areRequiredFieldsFilled(form, requiredFields)) {
            toast.error("لطفا فیلد ها را پر کنید", { id: 'CheckFieldsComplete' });
            return
        };

        const { avatar, ...studentData } = form;

        const formData = new FormData();
        formData.append("data", JSON.stringify(studentData));

        if (avatar)
            formData.append("avatar", avatar);

        mutate(formData);
    }

    return (
        <div className="panels">
            <div className="panel mt-4">
                <p className="card-subtitle">جهت ثبت نام لطفا با دقت اطلاعات خود را وارد کنید</p>
                <form onSubmit={formHandler} className='mt-4'>

                    {registerStudentFields.map(item => (
                        <div key={item.name}>
                            <FormInput
                                label={item.label}
                                type={item.type}
                                name={item.name}
                                value={form[item.name]}
                                changeHandler={changeHandler}
                                moreClasses={item.moreClasses}
                                placeholder={item.placeholder}
                                list={item.list}
                            />
                        </div>
                    ))}

                    <Button type="submit" className="btn-main">
                        ثبت نام
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