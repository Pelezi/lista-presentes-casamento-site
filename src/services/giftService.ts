import api from './api';

export interface Gift {
    id: string;
    name: string;
    photoUrl?: string;
    quantity: number;
    description: string;
    guests?: Array<
        {
            count: number;
            guest:{
                id: string;
                name: string;
                phone: string;
                
            };
        }
    >;
    count?: number;
}

export const createGift = async (gift: Gift, guestId?: string): Promise<Gift> => {
    // Ensure id is removed from gift object
    const { id, ...giftWithoutId } = gift;
    const response = await api.post<Gift>(`/gifts${guestId ? `?guestId=${guestId}` : ''}`, giftWithoutId);
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

export const getGiftsByGuestId = async (id: string): Promise<Gift[]> => {
    const response = await api.get<Gift[]>(`/gifts/guest/${id}`);
    return response.data;
}

export const updateGift = async (gift: Gift, guestId?: string): Promise<Gift> => {
    const response = await api.put<Gift>(`/gifts/uuid/${gift.id}${guestId ? `?guestId=${guestId}` : ''}`, gift);
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

export const createOrUpdateGift = async (gift: Gift, guestId?: string): Promise<Gift> => {
    if (!gift.id || gift.id === '') {
        return await createGift(gift, guestId);
    } else {
        return await updateGift(gift, guestId);
    }
}

export const sendTelegramMessage = async (type: string, guest: string): Promise<void> => {
    await api.post(`/gifts/telegram/?type=${type}&guest=${guest}`);
}