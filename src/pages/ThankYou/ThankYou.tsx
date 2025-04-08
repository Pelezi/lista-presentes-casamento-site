import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sendTelegramMessage } from "../../services/giftService";
import TextArea from ".././../components/forms/Textarea";
import Form from "../../components/forms/Form";
import Button from "../../components/common/Button";

import * as Yup from "yup";

import { Bounce, toast, ToastContainer } from "react-toastify";

import styles from "./ThankYou.module.css";
import { useAuth } from "../../contexts/AuthContext";

const ThankYou = () => {
    const { guest } = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const giftId = queryParams.get("giftId");

    const handleSubmit = (values: { message: string }) => {
        if (type && giftId) {
            sendTelegramMessage('custom', guest.name, giftId, values.message);
            toast.success('Mensagem enviada com sucesso!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error("Erro ao enviar mensagem.");
        }
    };

    useEffect(() => {
        if (type && giftId) {
            sendTelegramMessage(type, guest.name, giftId);
        }
    }, []);

    const validationSchema = Yup.object().shape({
        message: Yup.string()
            .required("Mensagem é obrigatória"),
    });

    return (
        <div className={styles.contentBox}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className={styles.formBox}>
                <h2>Obrigado por nos abençoarem tanto ❤</h2>
                <Form
                    initialValues={{ message: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <>
                            <div className={styles.inputBox}>
                                <TextArea
                                    label="Mensagem"
                                    name="message"
                                    errors={errors.message}
                                    touched={touched.message}
                                    placeholder="Escreva sua mensagem aqui"
                                />
                            </div>
                            <Button type="submit">Enviar Mensagem</Button>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default ThankYou;