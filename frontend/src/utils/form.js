export const FormChangeHandler = setForm => (eventOrName, value) => {
    if (typeof eventOrName === 'string') {
        if (!eventOrName.trim()) return;
        setForm(prev => ({ ...prev, [eventOrName]: value }));
        return;
    }

    const target = eventOrName?.currentTarget ?? eventOrName?.target;
    if (!target?.name) return;

    let newValue;
    switch (target.type) {
        case 'file':
            newValue = target.multiple ? Array.from(target.files ?? []) : target.files?.[0] ?? null;
            break;

        case 'checkbox':
            newValue = target.checked;
            break;

        default:
            if (target.tagName === 'SELECT' && target.multiple) {
                newValue = Array.from(target.selectedOptions, option => option.value);
            } else {
                newValue = target.value;
            }
    }

    setForm(prev => ({ ...prev, [target.name]: newValue }));
};

export const areRequiredFieldsFilled = (form, requiredFields) => {
    return requiredFields.every(
        field => String(form[field] ?? '').trim() !== ''
    );
};
