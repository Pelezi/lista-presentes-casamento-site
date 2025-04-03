import api from './api';

export interface Gift {
    id: string;
    name: string;
    fileName?: string | null;
    value: string;
    mpcode?: string | null;
}

export const createGift = async (formData: FormData, guestId?: string): Promise<Gift> => {

    formData.delete('id');
    const response = await api.post<Gift>(
        `/gifts${guestId ? `?guestId=${guestId}` : ''}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

export const getGifts = async (): Promise<Gift[]> => {
    const response = await api.get<Gift[]>('/gifts');
    return response.data;
}

export const getGiftsById = async (id: string): Promise<Gift> => {
    const response = await api.get<Gift>(`/gifts/info/${id}`);
    return response.data;
}

export const updateGift = async (formData: FormData, guestId?: string): Promise<Gift> => {
    const response = await api.put<Gift>(
        `/gifts/${formData.get("id")}${guestId ? `?guestId=${guestId}` : ''}`, 
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

export const deleteGift = async (id: string, guestId?: string ): Promise<Gift> => {
    const response = await api.delete<Gift>(`/gifts/uuid/${id}${guestId ? `?guestId=${guestId}` : ''}`);
    return response.data;
}

export const addGiftToGuest = async (giftId: string, guestId: string): Promise<Gift> => {
    const response = await api.post<Gift>(`/gifts/${giftId}/guest/${guestId}`);
    return response.data;
}

export const removeGiftFromGuest = async (giftId: string, guestId: string): Promise<Gift> => {
    const response = await api.delete<Gift>(`/gifts/${giftId}/guest/${guestId}`);
    return response.data;
}

export const createOrUpdateGift = async (formData: FormData, guestId?: string): Promise<Gift> => {
    if (!formData.get('id')) {
        return await createGift(formData, guestId);
    } else {
        return await updateGift(formData, guestId);
    }
}

export const sendTelegramMessage = async (type: string, guest: string, gift?: string): Promise<void> => {
    await api.post(`/gifts/telegram/?type=${type}&guest=${guest}&gift=${gift}`);
}