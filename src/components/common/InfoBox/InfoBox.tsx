import React, { useEffect, useState } from "react";
import styles from "./InfoBox.module.css";
import { NavLink } from "react-router-dom";
import { Gift } from "../../../services/giftService";

interface InfoboxProps {
    gift: Gift;
}

const InfoBox: React.FC<InfoboxProps> = ({ gift }) => {
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    useEffect(() => {
        const fetchGiftData = async () => {
            setIsUnavailable((gift.count ?? 0) >= gift.quantity);
            setAvailableQuantity(gift.quantity - (gift.count ?? 0));
        };

        fetchGiftData();
    }, [gift.id]);

    return (
        <div className={`${styles.card} ${isUnavailable ? styles.unavailable : ''}`}>
            <div className={styles.cardBody}>
                <img src={gift.photoUrl} className={styles.cardImage} alt={gift.name} /> {/* Added fallback for photoUrl */}
                <h2 className={styles.cardTitle}>{gift.name}</h2>
                <p className={styles.cardDescription}>{gift.description}</p>
            </div>
            <div className={styles.cardFooter}>
                <p className={styles.cardQuantity}>Quantidade Disponível: {availableQuantity}/{gift.quantity}</p>
                <NavLink to={`/gift/${gift.id}`} className={styles.cardBtn}>Escolher presente</NavLink>
            </div>
        </div>
    );
};

export default InfoBox;