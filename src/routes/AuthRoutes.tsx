import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import Layout from '../components/layout';

import { useAuth } from "../contexts/AuthContext";

import Home from '../pages/home';
import Admin from '../pages/Admin';


import ManipularGift from "../pages/Gifts/ManipularGift";

import Bio from "../pages/Bio";

import ThankYou from "../pages/ThankYou";

const AuthRoutes: React.FC = () => {
    const { authenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Carregando...</p>
    }

    if (!authenticated) {
        return <Navigate to="/login" />
    }


    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/gifts/cadastrar" element={<ManipularGift />} />
                <Route path="/gifts/editar" element={<ManipularGift />} />

                <Route path="/admin" element={<Admin />} />

                <Route path="/bio" element={<Bio />} />

                <Route path="/thankyou" element={<ThankYou />} />

            </Routes>
        </Layout>
    )
}

export default AuthRoutes;