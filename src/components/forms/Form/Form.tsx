import React, { useState } from "react";

import { Formik, FormikHelpers, FormikProps, FormikValues, Form as FormikForm } from "formik";
import * as Yup from "yup";

import styles from "./Form.module.css";

interface FormProps<T> {
    initialValues: T;
    validationSchema: Yup.ObjectSchema<Omit<Partial<T>, "id">>;
    onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
    children: (FormikProps: FormikProps<T>) => React.ReactNode;
    enableReinitialize?: boolean;
}

const Form = <T extends FormikValues>({ initialValues, validationSchema, onSubmit, children }: FormProps<T>) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: T, formikHelpers: FormikHelpers<T>) => {
        setSubmitting(true);
        await onSubmit(values, formikHelpers);
        setSubmitting(false);
    };

    return (
        <div className={styles.formWrapper}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <>
                        <FormikForm className={submitting ? styles.submitting : ""}>
                            {children(formikProps)}
                        </FormikForm>
                        {submitting && <div className={styles.loading}>Carregando...</div>}
                    </>
                )}
            </Formik>
        </div>
    );
};

export default Form;