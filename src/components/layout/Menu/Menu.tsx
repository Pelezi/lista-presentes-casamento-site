import React from "react";

import { NavLink } from "react-router-dom";

import styles from "./Menu.module.css";

import { useAuth } from "../../../contexts/AuthContext";
import { FaGift, FaGears } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdLogout } from "react-icons/md";


const Menu: React.FC = ({ }) => {

    const { logout, guest } = useAuth();

    return (
        <nav className={`${styles.navigation}`}>
            <NavLink
                className={({ isActive }) => (
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                )
                }
                to="/"
                onClick={() => { { } }}
            >
                <FaGift className={styles.icon} />
            </NavLink>
            <NavLink
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
                to="/meus-presentes"
                onClick={() => { }}
            >
                <MdOutlineShoppingCart className={styles.icon} />
            </NavLink>

            {(guest?.phone === "81998625899" || guest?.phone === "81997250606") && (
                <NavLink
                    className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                    }
                    to="/admin"
                    onClick={() => { }}
                >
                    <FaGears className={styles.icon} />
                </NavLink>
            )}

            <NavLink
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
                to="/Login"
                onClick={logout}
            >
                <MdLogout className={`${styles.icon} ${styles.logout}`} />
            </NavLink>
        </nav>
    );
};

export default Menu;