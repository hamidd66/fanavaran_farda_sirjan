import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

import { loginNationalCodePassword } from 'services/user';
import { loginNationalCodePasswordFields } from 'constants/inputFields';

function Login({ refetch }) {
    const [form, setForm] = useState({ national_code: "", password: "" });
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: loginNationalCodePassword,
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries('currentUser');
        },
        onError: e => console.log(e.data),
    })

    const formHandler = e => {
        e.preventDefault();

        if (!form.national_code || !form.password) {
            toast.error("لطفا فیلد ها را پر کنید", { id: 'CheckFieldsComplete' });
            return
        };

        mutate(form);
        setForm({ national_code: "", password: "" });
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    return (

        <div className="panels">
            <div className="panel mt-4">
                <p className="card-subtitle">خوش آمدید!</p>
                <form onSubmit={formHandler} className='mt-4'>

                    {loginNationalCodePasswordFields.map(item => (
                        <div key={item.name} className="form-group">
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