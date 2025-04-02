import React, { useEffect, useState } from "react";

import styles from "./Home.module.css";

import Title from "../../components/common/Title";
import InfoBox from "../../components/common/InfoBox";

import { Gift, getGifts, sendTelegramMessage } from "../../services/giftService";

import { useAuth } from "../../contexts/AuthContext";

import tardis from "../../Assets/img/Small TARDIS.png";
import { useNavigate } from "react-router-dom";

import { MdOutlineShoppingCart } from "react-icons/md";
import Button from "../../components/common/Button";

import { QRCodeSVG } from "qrcode.react";

const Home = () => {
    const { guest } = useAuth();
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [showPixModal, setShowPixModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [QrCode, setQrCode] = useState<string | null>(null);
    const [showDialogue1, setShowDialogue1] = useState(true);
    const [showDialogue2, setShowDialogue2] = useState(false);
    const [showDialogue3, setShowDialogue3] = useState(false);
    const [showDialogue4, setShowDialogue4] = useState(false);
    const [showDialogue5, setShowDialogue5] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

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

    const crc16CCITTFalse = (input: string): string => {
        let crc = 0xFFFF; // Valor inicial
        const polynomial = 0x1021; // Polinômio
    
        for (let i = 0; i < input.length; i++) {
            crc ^= input.charCodeAt(i) << 8; // XOR com byte atual
            for (let j = 0; j < 8; j++) { // 8 bits por byte
                if (crc & 0x8000) { // Se o bit mais alto for 1
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
                crc &= 0xFFFF; // Manter 16 bits
            }
        }
    
        return crc.toString(16).toUpperCase().padStart(4, '0'); // Formatar como hexadecimal
    }

    const handlePixSelect = (gift: Gift) => {
        try {
            const value = gift.value.replace("R$ ", "").replace(",", ".");
            const message = `Presente de ${guest.name} ${gift.name}`;
            const maxLength = 40;
            const truncatedMessage = message.length > maxLength ? message.substring(0, maxLength) : message;
            const formattedqrcode = `00020126690014br.gov.bcb.pix0121abcsandro@hotmail.com0222${truncatedMessage}5204000053039865405${value}5802BR5924Alessandro Cardoso da Co6008Brasilia62230519daqr6688136470583956304`
            const crc = crc16CCITTFalse(formattedqrcode);
            const formattedqrcodeWithCRC = formattedqrcode + crc;
            setQrCode(formattedqrcodeWithCRC);
            setSelectedGift(gift);
            setShowPixModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    const closePixModal = () => {
        setShowPixModal(false);
        setSelectedGift(null);
        navigate("/thank-you");
    };

    const handleCopyQrCode = () => {
        navigator.clipboard.writeText(QrCode || "").then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        });
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
                        onPixSelect={handlePixSelect}
                        guest={guest}
                    />
                ))}
            </div>
            {showPixModal && selectedGift && QrCode && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>QR Code para pagamento via Pix</h2>
                        <QRCodeSVG
                            value={QrCode}
                        />
                        <Button onClick={handleCopyQrCode}>
                            Copiar código Pix
                        </Button>
                        {copySuccess && <p className={styles.copySuccess}>Código copiado com sucesso!</p>}
                        <Button onClick={closePixModal}>Fechar</Button>
                    </div>
                </div>
            )}
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