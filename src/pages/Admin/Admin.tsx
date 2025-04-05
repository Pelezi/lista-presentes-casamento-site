import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Admin.module.css";

import InfoBoxAdminView from "../../components/common/InfoBoxAdminView";

import { Gift, getGifts } from "../../services/giftService";

import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";

import { Bounce, toast, ToastContainer } from "react-toastify";

const Home = () => {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
    const [isFiltered, setIsFiltered] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchGifts = async () => {
        try {
            const response = await getGifts();
            setGifts(response);
            setFilteredGifts(response);
        } catch (error) {
            throw new Error("Error fetching gifts: " + error);
        }
    }

    const filterGifts = () => {
        if (isFiltered) {
            setFilteredGifts(gifts);
        } else {
            setFilteredGifts(gifts.filter(gift => !gift.mpcode || !gift.fileName));
        }
        setIsFiltered(!isFiltered);
    }

    useEffect(() => {
        fetchGifts();
    }, []);


    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            // Clear the state to prevent duplicate toasts
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    return (
        <>
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
                    {isFiltered ? <FaFilterCircleXmark /> : <FaFilter />}
                </button>
            </main>
        </>
    )
};

export default Home;