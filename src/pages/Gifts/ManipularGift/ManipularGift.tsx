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
        value: "",
        mpcode: "",
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required("Campo obrigatório"),
        value: Yup.string().required("Campo obrigatório"),
        mpcode: Yup.string(),
        fileName: Yup.string(),
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);

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
            const image = new Image();
            image.src = URL.createObjectURL(selectedImage);

            image.onload = async () => {
                const scaleX = image.naturalWidth / 100;
                const scaleY = image.naturalHeight / 100;

                const normalizedCroppedAreaPixels = {
                    x: croppedAreaPixels.x * scaleX,
                    y: croppedAreaPixels.y * scaleY,
                    width: croppedAreaPixels.width * scaleX,
                    height: croppedAreaPixels.height * scaleY,
                };

                console.log("Normalized Cropped Area Pixels:", normalizedCroppedAreaPixels);

                const croppedImageBlob = await getCroppedImg(
                    URL.createObjectURL(selectedImage),
                    normalizedCroppedAreaPixels
                );
                const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
                setCroppedImage(croppedImageUrl);
                setCroppedImageFile(croppedImageBlob as File);
                setImagePreview(null);
            };
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
            const { ...filteredValues } = values;
            const formData = new FormData();
            formData.append("id", filteredValues.id);
            formData.append("name", filteredValues.name);
            formData.append("value", filteredValues.value);
            if (filteredValues.mpcode) {
                formData.append("mpcode", filteredValues.mpcode);
            }
            if (croppedImageFile) {
                formData.append("photo", croppedImageFile as Blob);
            }
            await createOrUpdateGift(formData, guest.id);
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
                        label="Valor"
                        name="value"
                        mask="BRL"
                        placeholder="R$ 0,00"
                        errors={errors.value}
                        touched={touched.value}
                    />
                    <Input
                        label="Código do Mercado Pago"
                        name="mpcode"
                        errors={errors.mpcode}
                        touched={touched.mpcode}
                    />
                    <Input
                        label="nome do arquivo"
                        name="fileName"
                        hidden
                        errors={errors.fileName}
                        touched={touched.fileName}
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
                                        aspect={1 / 1}
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