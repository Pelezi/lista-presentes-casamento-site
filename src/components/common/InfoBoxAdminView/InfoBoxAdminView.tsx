import React, { useEffect, useState } from "react";
import styles from "./InfoBoxAdminView.module.css";
import { useNavigate } from "react-router-dom";
import { Gift, deleteGift, getGiftsById } from "../../../services/giftService";

import Button from "../Button";
import { useAuth } from "../../../contexts/AuthContext";

interface InfoboxProps {
    gift: Gift;
    fetchGifts?: () => void;
}

const InfoBoxAdminView: React.FC<InfoboxProps> = ({ gift, fetchGifts }) => {
    const navigate = useNavigate();
    const { guest } = useAuth();

    const [giftInfo, setGiftInfo] = useState<Gift>();

    const fetchGiftData = async () => {
        const info = await getGiftsById(gift.id);
        setGiftInfo(info);
    };

    useEffect(() => {
        fetchGiftData();
    }, [gift.id]);

    const handleEdit = (gift: Gift) => {
        navigate("/gifts/editar", { state: gift });
    }

    const handleDelete = async (gift: Gift) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja apagar este presente?");
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteGift(gift.id, guest?.id);
            if (fetchGifts) fetchGifts();
            alert("Presente removido com sucesso!");
        } catch (error) {
            console.log("Erro ao remover gift", error);
            alert("Erro ao remover gift. Tente novamente.");
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <img src={`https://d2j9qme73f0lxe.cloudfront.net/${gift.fileName}`} className={styles.cardImage} alt={gift.name} /> {/* Added fallback for photoUrl */}
                <h2 className={styles.cardTitle}>{gift.name}</h2>
                <p className={styles.cardDescription}>{gift.value}</p>
            </div>
            <div>
                <Button onClick={() => handleEdit(gift)}>Editar presente</Button>
                <Button deleteButton onClick={() => handleDelete(gift)} >Remover presente</Button>
            </div>
        </div>
    );
};

export default InfoBoxAdminView;