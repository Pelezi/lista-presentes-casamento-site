import React, { useState } from "react";
import styles from "./InfoBox.module.css";
import { useNavigate } from "react-router-dom";
import { Gift } from "../../../services/giftService";
import Button from "../Button";
import { Guest } from "../../../services/authService";

interface InfoboxProps {
    gift: Gift;
    onPixSelect: (gift: Gift) => void;
    guest: Guest;
}

const formatCurrency = (value: number) => {
    const [integerPart, decimalPart] = value.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger},${decimalPart || "00"}`;
};

const InfoBox: React.FC<InfoboxProps> = ({ gift, onPixSelect, guest }) => {
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const navigate = useNavigate();

    const loadMercadoPago = (preferenceId?: string) => {
        if (!preferenceId) return;
        // sendTelegramMessage("mp", guest.name, gift.id);
        const script = document.createElement("script");
        script.src = "/web-payment-checkout.js";
        script.setAttribute("data-preference-id", preferenceId);
        script.setAttribute("data-source", "button");
        script.setAttribute("data-open", "true");
        document.body.appendChild(script);
    };

    const handlePixSelection = () => {
        onPixSelect(gift);
        setShowPaymentOptions(false);
    };

    const handleCreditOrBoletoSelection = () => {
        if (gift.value <= 0) {
            // sendTelegramMessage("mp", guest.name, gift.id);
            setShowPaymentOptions(false);
            window.open("https://link.mercadopago.com.br/pelezitech", "_blank");
            navigate("/thankyou")
        } else if (!gift.mpcode) {
            return
        } else {
            loadMercadoPago(gift.mpcode);
            setShowPaymentOptions(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <img src={`https://d2j9qme73f0lxe.cloudfront.net/${gift.fileName}`} className={styles.cardImage} alt={gift.name} /> 
                <h2 className={styles.cardTitle}>{gift.name}</h2>
                <p className={styles.cardDescription}>R$ {formatCurrency(gift.value)}</p>
            </div>
            <div className={styles.cardFooter}>
                {!showPaymentOptions && (
                    <Button onClick={() => setShowPaymentOptions(true)}>Escolher presente</Button>
                )}
                {showPaymentOptions && (
                    <>
                        <Button onClick={handlePixSelection}>Pix</Button>
                        <Button onClick={handleCreditOrBoletoSelection}>Cartão de Crédito ou Boleto</Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default InfoBox;