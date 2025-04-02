import React, { useEffect, useState } from "react";
import styles from "./InfoBox.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Gift, sendTelegramMessage } from "../../../services/giftService";
import Button from "../Button";
import { Guest } from "../../../services/authService";

interface InfoboxProps {
    gift: Gift;
    onPixSelect: (gift: Gift) => void;
    guest: Guest;
}

const InfoBox: React.FC<InfoboxProps> = ({ gift, onPixSelect, guest }) => {
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadMercadoPago = (preferenceId?: string) => {
        if (!preferenceId) return;
        const script = document.createElement("script");
        script.src = "/web-payment-checkout.js";
        script.setAttribute("data-preference-id", preferenceId);
        script.setAttribute("data-source", "button");
        script.setAttribute("data-open", "true");
        document.body.appendChild(script);
    };

    const handlePixSelection = () => {
        setSelectedPayment("pix");
        onPixSelect(gift);
    };

    const handleCreditOrBoletoSelection = () => {
        setSelectedPayment("creditOrBoleto");
        loadMercadoPago(gift.mpcode);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <img src={`https://d2j9qme73f0lxe.cloudfront.net/${gift.fileName}`} className={styles.cardImage} alt={gift.name} /> 
                <h2 className={styles.cardTitle}>{gift.name}</h2>
                <p className={styles.cardDescription}>{gift.value}</p>
            </div>
            <div className={styles.cardFooter}>
                {!showPaymentOptions && (
                    <Button onClick={() => setShowPaymentOptions(true)}>Escolher presente</Button>
                )}
                {showPaymentOptions && !selectedPayment && (
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