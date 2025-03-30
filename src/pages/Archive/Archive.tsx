import React from "react";

import styles from "./Archive.module.css";

import buqueLeft from "../../Assets/img/floral-header-left.png";
import buqueRight from "../../Assets/img/floral-header-right.png";

const Login = () => {

    return (
        <div className={styles.loginWrapper}>
            <img className={`${styles.buque} ${styles.buquel}`} src={buqueLeft} alt="" />
            <img className={`${styles.buque} ${styles.buquer}`} src={buqueRight} alt="" />
            <div className={styles.contentBox}>
                <div className={styles.formBox}>
                    <h2>Obrigado por nos abençoarem tanto ❤</h2>
                </div>
            </div>
        </div>
    );
};

export default Login;