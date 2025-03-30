import React from "react";

import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import Input from "../../components/forms/Input";
import Form from "../../components/forms/Form";
import Button from "../../components/common/Button";

import { Guest, login as loginService } from "../../services/authService";

import { useAuth } from "../../contexts/AuthContext";

import buqueLeft from "../../Assets/img/floral-header-left.png";
import buqueRight from "../../Assets/img/floral-header-right.png";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const initialValues: Guest = {
        id: "",
        name: "",
        phone: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Nome é obrigatório"),
        phone: Yup.string()
            .required("Telefone é obrigatório"),
    });

    const onSubmit = async (values: Guest) => {
        try {
            const guest = await loginService(values);
            login(guest);
            navigate('/');
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.Erro || 'Erro ao realizar login';
            alert(errorMessage);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <img className={`${styles.buque} ${styles.buquel}`} src={buqueLeft} alt="" />
            <img className={`${styles.buque} ${styles.buquer}`} src={buqueRight} alt="" />
            <div className={styles.contentBox}>
                <div className={styles.formBox}>
                    <h2>Acessar</h2>
                    <Form
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ errors, touched }) => (
                            <>
                                <div className={styles.inputBox}>
                                    <Input
                                        label="Nome"
                                        name="name"
                                        type="text"
                                        errors={errors.name}
                                        touched={touched.name}
                                        placeholder="Nome completo"
                                    />
                                </div>

                                <div className={styles.inputBox}>
                                    <Input
                                        label="Telefone"
                                        name="phone"
                                        type="text"
                                        phone
                                        errors={errors.phone}
                                        touched={touched.phone}
                                        placeholder="(xx) x xxxx-xxxx"
                                    />
                                </div>
                                <Button type="submit">Entrar</Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;