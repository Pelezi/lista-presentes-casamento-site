import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Admin.module.css";

import InfoBoxAdminView from "../../components/common/InfoBoxAdminView";

import { Gift, getGifts } from "../../services/giftService";

import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";

const Home = () => {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const navigate = useNavigate();

    const fetchGifts = async () => {
        try {
            const response = await getGifts();
            setGifts(response);
            setFilteredGifts(response);
        } catch (error) {
            console.log(error);
        }
    }

    const filterGifts = () => {
        if (isFiltered) {
            setFilteredGifts(gifts);
        } else {
            setFilteredGifts(gifts.filter(gift => gift.count && gift.count > 0));
        }
        setIsFiltered(!isFiltered);
    }

    useEffect(() => {
        fetchGifts();
    }, []);

    return (
        <main className={styles.container}>
            <div className={styles.section}>
                {filteredGifts.map((gift) => (
                    <InfoBoxAdminView
                        key={gift.id}
                        gift={gift}
                        fetchGifts={fetchGifts}
                    />
                ))}
            </div>
            <button className={styles.addButton} onClick={() => navigate("/gifts/cadastrar")}>
                +
            </button>
            <button className={styles.filterButton} onClick={filterGifts}>
                {isFiltered ? <FaFilterCircleXmark/> : <FaFilter/>}
            </button>
        </main>
    )
};

export default Home;