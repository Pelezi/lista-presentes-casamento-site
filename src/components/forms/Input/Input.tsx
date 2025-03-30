import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import InputMask from "react-input-mask";

import styles from "./Input.module.css";

export interface InputProps {
    label: string;
    name: string;
    type?: string;
    as?: string;
    errors?: string;
    touched?: boolean;
    className?: string;
    children?: React.ReactNode;
    hidden?: boolean;
    hiddenLabel?: boolean;
    readonly?: boolean;
    placeholder?: string;
    phone?: boolean;
};

const Input: React.FC<InputProps> = ({ label, name, type = "text", as, errors, touched, children, className, hidden, readonly, hiddenLabel, placeholder, phone }) => {
    const { isSubmitting } = useFormikContext();

    return (
        <fieldset className={`${styles.formGroup} ${hidden && styles.hidden}`}>
            <label htmlFor={name} className={`${styles.label} ${hiddenLabel && styles.hidden}`}>
                {label}:
            </label>
            <Field
                name={name}
                type={type}
                as={phone ? InputMask : as ? as : undefined}
                mask={phone ? "(99) 9 9999-9999" : undefined}
                readOnly={readonly || isSubmitting}
                className={`${className ? className : styles.input} ${touched && errors && styles.error}`}
                placeholder={placeholder}
                disabled={isSubmitting}
            >
                {children}
            </Field>
            <ErrorMessage name={name} component="div" className={styles.errorMsg} />
        </fieldset>
    );
};

export default Input;