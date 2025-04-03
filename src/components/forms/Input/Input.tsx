import React, { useState, useEffect } from "react";
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
    mask?: "phone" | "BRL";
};

const Input: React.FC<InputProps> = ({ label, name, type = "text", as, errors, touched, children, className, hidden, readonly, hiddenLabel, placeholder, mask }) => {
    const { isSubmitting, setFieldValue, values } = useFormikContext<any>();
    const [value, setValue] = useState("");

    // Initialize the value state when editing a gift
    useEffect(() => {
        if (mask === "BRL" && values[name]) {
            const rawValue = values[name].replace(/\D/g, ""); // Remove non-numeric characters
            const formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(parseFloat(rawValue) / 100);
            setValue(formattedValue);
        } else if (values[name]) {
            setValue(values[name]);
        }
    }, [values, name, mask]);

    // Define the mask based on the type
    const inputMask = mask === "phone" 
        ? "(99) 9 9999-9999" 
        : undefined;

    // Handle right-to-left filling for BRL
    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        const formattedValue = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(parseFloat(rawValue) / 100); // Format as BRL currency
        setValue(formattedValue);
        setFieldValue(name, formattedValue); // Update Formik field value
    };

    return (
        <fieldset className={`${styles.formGroup} ${hidden && styles.hidden}`}>
            <label htmlFor={name} className={`${styles.label} ${hiddenLabel && styles.hidden}`}>
                {label}:
            </label>
            {mask === "BRL" ? (
                <input
                    name={name}
                    type="text"
                    value={value}
                    onChange={handleMoneyChange}
                    readOnly={readonly || isSubmitting}
                    className={`${className ? className : styles.input} ${touched && errors && styles.error}`}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                />
            ) : (
                <Field
                    name={name}
                    type={type}
                    as={mask ? InputMask : as ? as : undefined}
                    mask={inputMask}
                    readOnly={readonly || isSubmitting}
                    className={`${className ? className : styles.input} ${touched && errors && styles.error}`}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                >
                    {children}
                </Field>
            )}
            <ErrorMessage name={name} component="div" className={styles.errorMsg} />
        </fieldset>
    );
};

export default Input;