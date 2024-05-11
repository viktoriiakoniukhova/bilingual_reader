const defaultValidation = (label, name, type, placeholder, readOnly = false, additionalValidations = {}, attributes = {}, required = true, multiline = false,) => {
    return (
        {
            label: label,
            name: name,
            attributes: {
                type: type,
                placeholder: placeholder,
                readOnly: readOnly,
                ...attributes,
            },
            validation: {
                required: {
                    value: required,
                    message: 'Будь ласка, заповніть поле',
                },
                maxLength: {
                    value: 100,
                    message: 'Максимальна кількість симолів: 50',
                },
                ...additionalValidations,
            },
            multiline: multiline
        }
    );
}

export const emailValidation = (label, name = "email", attributes = {}, validate = () => { }, placeholder, readOnly = false,) => {
    return defaultValidation(
        label,
        name,
        'email',
        placeholder,
        readOnly,
        {
            pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Будь ласка, введіть коректну пошту',
            },
            validate
        },
        attributes
    );
}

export const nameNotValidation = (label, name, attributes = {}, required = false, placeholder, readOnly = false,) => {
    return defaultValidation(
        label,
        name,
        "text",
        placeholder,
        readOnly,
        {},
        attributes,
        required
    );
}

export const nameValidation = (label, name = "username", attributes = {}, validate = () => { }, required = true, message = undefined, placeholder, readOnly = false,) => {
    return defaultValidation(
        label,
        name,
        "text",
        placeholder,
        readOnly,
        {
            pattern: {
                value: /^[a-zA-Z0-9_а-яА-ЯґҐєЄіІїЇҐґєЄіІїЇ]{3,}$/,
                message: message || 'Будь ласка, введіть коректний псевдонім, без спец-символів і пробілів',
            },
            validate,
        },
        attributes,
        required
    );
}

export const passwordValidation = (label, name = "password", attributes = {}, validate = () => { }, placeholder, readOnly = false, type = "password",) => {
    return defaultValidation(
        label,
        name,
        type,
        placeholder,
        readOnly,
        {
            pattern: {
                value: /^[^\s]{8,}$/,
                message: "Пароль не відповідає мінімальним вимогам захищеності"},
            validate,
        },
        attributes
    );
}

export const phoneValidation = (label, name = "phone", attributes = {}, placeholder,) => {
    return defaultValidation(
        label,
        name,
        'tel',
        placeholder,
        false,
        {
            pattern: {
                value: /^(\+?(?:[0-9] ?){6,14}[0-9])$/,
                message: 'Будь ласка, введіть коректний номер телефону',
            },
            maxLength: {
                value: 15,
                message: 'Будь ласка, введіть коректний номер телефону',
            },
        },
        attributes
    );
}

export const multilineValidation = (label, attributes = {}, name = "description", placeholder) => {
    return defaultValidation(label, name, 'text', placeholder, false, {
        maxLength: {
            value: 500,
            message: 'Максимальна кількість симолів: 500',
        },
    }, attributes, false, true);
}