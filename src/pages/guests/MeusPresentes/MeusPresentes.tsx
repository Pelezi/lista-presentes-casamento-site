import React, { useEffect, useState } from "react";

import styles from "./MeusPresentes.module.css";

import Title from "../../../components/common/Title";
import InfoBoxGuestView from "../../../components/common/InfoBoxGuestView";

import { Gift, getGiftsByGuestId, sendTelegramMessage } from "../../../services/giftService";
import { useAuth } from "../../../contexts/AuthContext";


const MeusPresentes = () => {
    const { guest } = useAuth();
    const [gifts, setGifts] = useState<Gift[]>([]);


    const fetchGifts = async () => {
        try {
            const response = await getGiftsByGuestId(guest.id);
            setGifts(response);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchGifts();
    }, []);


    return (
        <main className={styles.container}>
            <Title className={styles.title}>Seus Presentes Escolhidos</Title>
            <div className={styles.section}>
                {gifts.map((gift) => (
                    <InfoBoxGuestView
                        key={gift.id}
                        gift={gift}
                    />
                ))}
            </div>
        </main>
    )
};

export default MeusPresentes;