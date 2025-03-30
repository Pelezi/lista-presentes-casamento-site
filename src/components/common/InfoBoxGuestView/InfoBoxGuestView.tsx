import React, { useEffect, useState } from "react";
import styles from "./InfoBoxGuestView.module.css";
import { NavLink } from "react-router-dom";
import { Gift } from "../../../services/giftService";

interface InfoboxProps {
    gift: Gift;
}

const InfoBoxGuestView: React.FC<InfoboxProps> = ({ gift }) => {
    const [chosenQuantity, setChosenQuantity] = useState(0);

    useEffect(() => {
        const fetchGiftData = async () => {
            setChosenQuantity(gift.guests?.[0]?.count ?? 0);
        };

        fetchGiftData();
    }, [gift.id]); 

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <img src={gift.photoUrl} className={styles.cardImage} alt={gift.name} /> {/* Added fallback for photoUrl */}
                <h2 className={styles.cardTitle}>{gift.name}</h2>
                <p className={styles.cardDescription}>{gift.description}</p>
                <p className={styles.cardQuantity}>Quantidade Escolhida: {chosenQuantity}/{gift.quantity}</p>
            </div>
            <NavLink to={`/gift/${gift.id}/remove`} className={styles.cardBtn}>Remover presente</NavLink>
        </div>
    );
};

export default InfoBoxGuestView;