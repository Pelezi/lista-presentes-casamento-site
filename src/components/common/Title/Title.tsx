import React from "react";

import styles from "./Title.module.css";

interface TitleProps {
    className?: string;
    children: React.ReactNode;
}

const title: React.FC<TitleProps> = ({ className=styles.title, children }) => {
    return <h1 className={className}>{children}</h1>;
};

export default title;