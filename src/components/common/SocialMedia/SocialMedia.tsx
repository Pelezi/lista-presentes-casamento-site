import React from "react";

import styles from "./SocialMedia.module.css";

interface SocialMediaProps {
    name: string;
    userName: string;
    url?: string;
    image: string;
}

const socialMedia: React.FC<SocialMediaProps> = ({ name, userName, url, image }) => {
    return (
        <div className={styles.icons}>
            <img src={image} alt="" />
            <a href={url} target="_blank" className={styles.at}>
                <p>{name}</p>
                <small> {userName} </small>
            </a>
        </div>
    );
};

export default socialMedia;