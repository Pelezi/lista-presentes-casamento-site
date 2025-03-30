import React, { useEffect, useState } from "react";

import styles from "./Home.module.css";

import Title from "../../components/common/Title";
import InfoBox from "../../components/common/InfoBox";

import { Gift, getGifts, sendTelegramMessage } from "../../services/giftService";

import { useAuth } from "../../contexts/AuthContext";

import tardis from "../../Assets/img/Small TARDIS.png";
import { useNavigate } from "react-router-dom";

import { MdOutlineShoppingCart } from "react-icons/md";


const Home = () => {
    const { guest } = useAuth();
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [showDialogue1, setShowDialogue1] = useState(true);
    const [showDialogue2, setShowDialogue2] = useState(false);
    const [showDialogue3, setShowDialogue3] = useState(false);
    const [showDialogue4, setShowDialogue4] = useState(false);
    const [showDialogue5, setShowDialogue5] = useState(false);

    const navigate = useNavigate();

    const fetchGifts = async () => {
        try {
            const response = await getGifts();
            setGifts(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleScroll = () => {
        const isBottom = (window.innerHeight * 1) + window.scrollY >= document.documentElement.scrollHeight / 2;
        setIsScrolledToBottom(isBottom);
    };

    useEffect(() => {
        fetchGifts();
        window.addEventListener("scroll", handleScroll);

        const hasVisited = localStorage.getItem("hasVisited");
        if (!hasVisited) {
            setShowDialogue1(true);
            localStorage.setItem("hasVisited", "true");
        } else {
            setShowDialogue1(false);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleBioButtonClick = () => {
        try {
            sendTelegramMessage("bio", guest.name);
            setTimeout(() => {
                navigate("/bio");
            }, 400);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDismissClick = (dialogueNumber: number) => {
        const dialogueElement = document.querySelector(`.${styles.dialogueBalloon}`);
        if (dialogueElement) {
            dialogueElement.classList.add(styles.fadeOut);
            setTimeout(() => {
                switch (dialogueNumber) {
                    case 1:
                        setShowDialogue1(false);
                        dialogueElement.classList.remove(styles.fadeOut);
                        setShowDialogue2(true);
                        break;
                    case 2:
                        setShowDialogue2(false);
                        dialogueElement.classList.remove(styles.fadeOut);
                        setShowDialogue3(true);
                        break;
                    case 3:
                        setShowDialogue3(false);
                        dialogueElement.classList.remove(styles.fadeOut);
                        setShowDialogue4(true);
                        break;
                    case 4:
                        setShowDialogue4(false);
                        dialogueElement.classList.remove(styles.fadeOut);
                        setShowDialogue5(true);
                        break;
                    case 5:
                        setShowDialogue5(false);
                        dialogueElement.classList.remove(styles.fadeOut);
                        break;
                    default:
                        break;
                }
            }, 500);
        }
    };

    return (
        <main className={styles.container}>
            {showDialogue1 && (
                <div className={styles.dialogueBalloon}>
                    <p>Para escolher um presente, clique no botão 'Escolher Presente' abaixo do item desejado.
                    </p>
                    <p>
                        Assim que você escolher, ele ficará indisponível para os outros convidados, evitando repetições. 😊</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick(1)}>Entendi</button>
                </div>
            )}
            {showDialogue2 && (
                <div className={styles.dialogueBalloon}>
                    <p>Na aba {<MdOutlineShoppingCart />}, você pode ver os itens que escolheu.
                    </p>
                    <p>
                        Se mudar de ideia, é possível remover um presente para liberar a escolha para outras convidadas.</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick(2)}>Entendi</button>
                </div>
            )}
            {showDialogue3 && (
                <div className={styles.dialogueBalloon}>
                    <p>Este site não é uma loja online!
                    </p>
                    <p>
                        É apenas uma lista de sugestões de presentes para evitar repetições e para que você possa ficar livre para escolher, sem estar presa a um presente específico.
                    </p>
                    <p>
                        Depois de escolher seu presente, você pode comprá-lo na loja de sua preferência e trazê-lo para o chá de cozinha.
                    </p>
                    <p>
                        O valor e local de compra ficam totalmente a seu critério!</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick(3)}>Entendi</button>
                </div>
            )}
            {showDialogue4 && (
                <div className={styles.dialogueBalloon}>
                    <p>As imagens dos presentes são apenas ilustrativas. Não se preocupe em comprar exatamente o que aparece na foto! 😄</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick(4)}>Entendi</button>
                </div>
            )}
            {showDialogue5 && (
                <div className={styles.dialogueBalloon}>
                    <p>Não se sinta obrigada a trazer um presente. Sua presença é mais importante pra mim do que qualquer presente! 💖</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick(5)}>Entendi</button>
                </div>
            )}
            <Title className={styles.title}>Bem-vinda a minha Lista de Presentes</Title>
            <div className={styles.section}>
                {gifts.map((gift) => (
                    <InfoBox
                        key={gift.id}
                        gift={gift}
                    />
                ))}
            </div>
            <img
                className={`${styles.bioButton} ${isScrolledToBottom ? styles.bioButtonVisible : ""}`}
                src={tardis}
                alt=""
                onClick={handleBioButtonClick}
            />
        </main>
    )
};

export default Home;