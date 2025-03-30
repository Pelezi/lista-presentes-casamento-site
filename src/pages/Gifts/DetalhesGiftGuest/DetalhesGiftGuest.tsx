import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Gift, getGiftsById, addGiftToGuest, sendTelegramMessage } from "../../../services/giftService";
import styles from "./DetalhesGiftGuest.module.css";
import Button from "../../../components/common/Button";
import Input from "../../../components/forms/Input";
import { useAuth } from "../../../contexts/AuthContext";
import * as Yup from "yup";
import Form from "../../../components/forms/Form";

const DetalhesGift: React.FC = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { guest } = useAuth();
    const [gift, setGift] = useState<Gift>({} as Gift);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    const fetchGift = async () => {
        try {
            const gift = await getGiftsById(String(id));
            setGift(gift);
            const totalCount = gift.guests?.reduce((sum, guest) => sum + guest.count, 0) || 0;
            setAvailableQuantity(gift.quantity - totalCount);
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
            .max(availableQuantity, `Quantidade máxima é ${availableQuantity}`)
            .required("Quantidade é obrigatória"),
    });

    const handleReserveGift = async (values: { quantity: number }) => {
        try {
            if (gift.name == "Playstation 5 pro noivo") {
                alert("O noivo agradece a consideração, mas infelizmente este presente é só uma piada 😭.");
                alert("Mas se quiser dar mesmo assim o noivo aceita :)");
                sendTelegramMessage("playstation", guest.name);
                navigate("/");
            } else {
                for (let i = 0; i < values.quantity; i++) {
                    await addGiftToGuest(gift.id, guest.id);
                }
                alert("Presente escolhido com sucesso!");
                fetchGift();
                navigate("/");
            }
        } catch (error) {
            console.log("Erro ao escolher presente", error);
            alert("Erro ao escolher presente. Tente novamente.");
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.reserveSection}>
                <Form
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleReserveGift}
                >
                    {({ errors, touched }) => (
                        <>
                            <h1>{gift.name}</h1>
                            <img src={gift.photoUrl} alt={gift.name} className={styles.giftImage} />
                            <p>{gift.description}</p>
                            <p>Quantidade disponível: {availableQuantity}/{gift.quantity}</p>
                            <div className={styles.inputBox}>
                                <Input
                                    label="Quantidade"
                                    name="quantity"
                                    type="number"
                                    errors={errors.quantity}
                                    touched={touched.quantity}
                                />
                            </div>
                            <Button type="submit">Escolher</Button>
                        </>
                    )}
                </Form>
            </div>
        </div >
    );
};

export default DetalhesGift;