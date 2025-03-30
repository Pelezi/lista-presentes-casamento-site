import React, { useState, useCallback } from "react";

import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

import Form from "../../../components/forms/Form";
import Input from "../../../components/forms/Input/Input";
import Button from "../../../components/common/Button";
import Title from "../../../components/common/Title";
import { Gift, createOrUpdateGift } from "../../../services/giftService";
import styles from "./ManipularGift.module.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage";
import Textarea from "../../../components/forms/Textarea";
import { useAuth } from "../../../contexts/AuthContext";

const ManipularGift: React.FC = () => {

    const navigate = useNavigate();
    const gift = useLocation().state as Gift;
    const { guest } = useAuth();

    type Area = {
        width: number;
        height: number;
        x: number;
        y: number;
    };

    const initialValues: Gift = {
        id: "",
        name: "",
        photoUrl: "",
        quantity: 0,
        description: "",
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required("Campo obrigatório"),
        photoUrl: Yup.string(),
        quantity: Yup.number().required("Campo obrigatório").min(1, "Quantidade deve ser pelo menos 1"),
        description: Yup.string(),
        guests: Yup.array().of(
            Yup.object().shape({
                count: Yup.number().required(),
                guest: Yup.object().shape({
                    id: Yup.string().required(),
                    name: Yup.string().required(),
                    phone: Yup.string().required(),
                }).required(),
            })
        ),
        count: Yup.number(),
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onCropComplete = useCallback((croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {
        if (selectedImage && croppedAreaPixels) {
            const croppedImageBlob = await getCroppedImg(URL.createObjectURL(selectedImage), croppedAreaPixels);
            const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
            setCroppedImage(croppedImageUrl);
            setImagePreview(null);
        }
    };

    const handleImageUpload = async (): Promise<string | null> => {
        if (!croppedImage) return null;

        const response = await fetch(croppedImage);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error("Erro ao obter URL da imagem");
            }
        } catch (error) {
            console.error("Erro ao enviar imagem", error);
            alert("Erro ao enviar imagem. Tente novamente.");
            return null;
        } finally {
            setSelectedImage(null);
            setImagePreview(null);
        }
    };

    const onSubmit = async (values: Gift, { resetForm }: { resetForm: () => void }) => {
        try {
            const imageUrl = await handleImageUpload();
            console.log("imageUrl", imageUrl);
            const { guests, count, ...filteredValues } = values;
            if (imageUrl) {
                filteredValues.photoUrl = imageUrl;
            } else {
                delete filteredValues.photoUrl;
            }
            await createOrUpdateGift(filteredValues, guest.id);
            resetForm();
            navigate("/admin");
            alert("Presente salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar presente", error);
            alert("Erro ao salvar presente. Tente novamente." + error);
        }
    }

    return (
        <Form
            initialValues={gift || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched }) => (
                <>
                    {gift ? <Title>Editar Presente</Title> : <Title>Cadastrar Presente</Title>}

                    <Input
                        label="Nome"
                        name="name"
                        errors={errors.name}
                        touched={touched.name}
                    />
                    <Input
                        label="PhotoUrl"
                        name="photoUrl"
                        hidden
                        errors={errors.photoUrl}
                        touched={touched.photoUrl}
                    />
                    <Input
                        label="Quantidade"
                        name="quantity"
                        type="number"
                        errors={errors.quantity}
                        touched={touched.quantity}
                    />
                    <Textarea
                        label="Descrição"
                        name="description"
                        errors={errors.description}
                        touched={touched.description}
                    />

                    <fieldset className={styles.formGroup}>
                        <label htmlFor="Foto" className={styles.label}>
                            Foto:
                        </label>
                        <input
                            name="Foto"
                            type="file"
                            className={styles.input}
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <>
                                <div className={styles.cropContainer}>
                                    <Cropper
                                        image={imagePreview}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={4 / 3}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                    <br />
                                </div>
                                <Button green onClick={handleCropConfirm}>Confirmar Corte</Button>
                            </>
                        )}
                        {croppedImage && (
                            <div>
                                <img alt="Cropped" width={"250px"} src={croppedImage} />
                                <br />
                            </div>
                        )}
                    </fieldset>

                    <Button type="submit">Salvar</Button>
                </>
            )}
        </Form>
    );
};

export default ManipularGift;