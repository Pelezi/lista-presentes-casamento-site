import React, { ReactNode } from "react";
import styles from "./InfoBoxBase.module.css";

interface InfoBoxBaseProps {
    title: string;
    description: string;
    imageUrl: string;
    footer: ReactNode;
    unavailable?: boolean;
    additionalStyles?: string;
}

const InfoBoxBase: React.FC<InfoBoxBaseProps> = ({
    title,
    description,
    imageUrl,
    footer,
    unavailable = false,
    additionalStyles = "",
}) => (
    <div
        className={`${styles.card} ${unavailable ? styles.unavailable : ""} ${additionalStyles}`}
    >
        <div className={styles.cardBody}>
            <img src={imageUrl} className={styles.cardImage} alt={title} />
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDescription}>{description}</p>
        </div>
        <div className={styles.cardFooter}>{footer}</div>
    </div>
);

export default InfoBoxBase;
