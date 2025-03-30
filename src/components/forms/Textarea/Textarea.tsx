import React from 'react';

import styles from './Textarea.module.css';

import Input, { InputProps } from '../Input';

interface TextareaProps extends InputProps {}

const Textarea: React.FC<TextareaProps> = ({ label, name, as="textarea", errors, touched }) => {
    return (
        <Input 
            label={label}
            name={name}
            as={as}
            errors={errors}
            touched={touched}
            className={styles.textarea}
        />
    );
};

export default Textarea;