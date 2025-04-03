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
        let crc = 0xFFFF; 
        const polynomial = 0x1021; 
    
        for (let i = 0; i < input.length; i++) {
            crc ^= input.charCodeAt(i) << 8; 
            for (let j = 0; j < 8; j++) { 
                if (crc & 0x8000) { 
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
                crc &= 0xFFFF; 
            }
        }
    
        return crc.toString(16).toUpperCase().padStart(4, '0'); 
    }

    const handlePixSelect = (gift: Gift) => {
        try {
            const value = gift.value.replace("R$ ", "").replace(",", ".");
            const valueLength = value.length.toString().padStart(2, '0'); // Ensure length is always two characters
            const message = `Presente de ${guest.name} ${gift.name}`;
            const maxLength = 40;
            const truncatedMessage = message.length > maxLength ? message.substring(0, maxLength) : message;
            const formattedqrcode = `00020126${47 + truncatedMessage.length}0014br.gov.bcb.pix0121abcsandro@hotmail.com02${truncatedMessage.length}${truncatedMessage}52040000530398654${valueLength}${value}5802BR5924Alessandro Cardoso da Co6008Brasilia62230519daqr6688136475516746304`
            const crc = crc16CCITTFalse(formattedqrcode);
            const formattedqrcodeWithCRC = formattedqrcode + crc;
            console.log("Formatted QR Code:", formattedqrcodeWithCRC);
            setQrCode(formattedqrcodeWithCRC);
            setSelectedGift(gift);
            setShowPixModal(true);
            sendTelegramMessage("pix", guest.name, gift.id);
        } catch (error) {
            console.log(error);
        }
    };

    const closePixModal = () => {
        setShowPixModal(false);
        setSelectedGift(null);
        navigate("/thankyou");
    };

    const handleCopyQrCode = () => {
        navigator.clipboard.writeText(QrCode || "").then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        });
    };

    const handleDismissClick = () => {
        const dialogueElement = document.querySelector(`.${styles.dialogueBalloon}`);
        if (dialogueElement) {
            dialogueElement.classList.add(styles.fadeOut);
            setTimeout(() => {
                        setShowDialogue1(false);
                        dialogueElement.classList.remove(styles.fadeOut);
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
                        Você terá opção de enviar o dinheiro via pix, cartão ou boleto</p>
                    <button className={styles.dismissButton} onClick={() => handleDismissClick()}>Entendi</button>
                </div>
            )}
            <Title className={styles.title}>Bem-vindo a minha Lista de Presentes</Title>
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
                            size={256}
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