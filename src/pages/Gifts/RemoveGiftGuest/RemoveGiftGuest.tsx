import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Gift, getGiftsById, removeGiftFromGuest } from "../../../services/giftService";
import styles from "./RemoveGiftGuest.module.css";
import Button from "../../../components/common/Button";
import Input from "../../../components/forms/Input";
import { useAuth } from "../../../contexts/AuthContext";
import * as Yup from "yup";
import Form from "../../../components/forms/Form";

const RemoveGiftGuest: React.FC = () => {
    const navigate = useNavigate();
    
    const { id } = useParams();
    const { guest } = useAuth();
    const [gift, setGift] = useState<Gift>({} as Gift);
    const [chosenQuantity, setChosenQuantity] = useState(0);

    const fetchGift = async () => {
        try {
            const gift = await getGiftsById(String(id));
            setGift(gift);

            const userCount = gift.guests?.find(g => g.guest.id === guest.id)?.count || 0;
            setChosenQuantity(userCount);
        } catch (error) {
            console.log('Erro ao buscar presente', error);
        }
    };

    useEffect(() => {
        fetchGift();
    }, []);

    const initialValues = {
        quantity: 1,
    };

    const validationSchema = Yup.object().shape({
        quantity: Yup.number()
            .min(1, "Quantidade mínima é 1")
            .max(chosenQuantity, `Quantidade máxima é ${chosenQuantity}`)
            .required("Quantidade é obrigatória"),
    });

    const handleRemoveGift = async (values: { quantity: number }) => {
        try {
            for (let i = 0; i < values.quantity; i++) {
                await removeGiftFromGuest(gift.id, guest.id);
            }
            alert("Presente removido com sucesso!");
            fetchGift();
            navigate("/meus-presentes");
        } catch (error) {
            console.log("Erro ao remover presente", error);
            alert("Erro ao remover presente. Tente novamente.");
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.reserveSection}>
                <Form
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleRemoveGift}
                >
                    {({ errors, touched }) => (
                        <>
                            <h1>{gift.name}</h1>
                            <img src={gift.photoUrl} alt={gift.name} className={styles.giftImage} />
                            <p>{gift.description}</p>
                            <p>Quantidade escolhida: {chosenQuantity}/{gift.quantity}</p>
                            <div className={styles.inputBox}>
                                <Input
                                    label="Quantidade"
                                    name="quantity"
                                    type="number"
                                    errors={errors.quantity}
                                    touched={touched.quantity}
                                />
                            </div>
                            <Button deleteButton type="submit">Remover</Button>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default RemoveGiftGuest;