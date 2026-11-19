import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

import { loginNationalCodePassword } from 'services/user';
import { loginNationalCodePasswordFields } from 'constants/inputFields';
import { areRequiredFieldsFilled, FormChangeHandler } from 'utils/form';
import FormInput from 'components/forms/FormInput';

const initialForm = {
  national_code: '',
  password: '',
}

const requiredFields = [
    'national_code',
    'password',
]

function Login({ refetch }) {
    const [form, setForm] = useState(initialForm);
    const queryClient = useQueryClient();
    const changeHandler = FormChangeHandler(setForm);

    const { mutate } = useMutation({
        mutationFn: loginNationalCodePassword,
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries('currentUser');
        },
        onError: e => console.error(e.data),
    })

    const formHandler = e => {
        e.preventDefault();

        if (!areRequiredFieldsFilled(form, requiredFields)) {
            toast.error("لطفا فیلد ها را پر کنید", { id: 'CheckFieldsComplete' });
            return
        };

        mutate(form);
        setForm(initialForm);
    }

    return (

        <div className="panels">
            <div className="panel mt-4">
                <p className="card-subtitle">خوش آمدید!</p>
                <form onSubmit={formHandler} className='mt-4'>

                    {loginNationalCodePasswordFields.map(item => (
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
                        ورود
                    </Button>

                    <Link to="/" className="link-back-home">
                        <i className="bi bi-house-door"></i>
                        بازگشت به صفحه اصلی
                    </Link>
                </form>
            </div>
        </div>

    );
}

export default Login