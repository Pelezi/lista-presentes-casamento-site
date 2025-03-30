import api from "./api";

export interface Guest {
    id: string;
    name: string;
    phone: string;
}

const formatPhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

export const login = async (guest: Guest): Promise<Guest> => {
    const formattedGuest = {
        ...guest,
        phone: formatPhone(guest.phone),
    };
    const response = await api.post<Guest>(`/guests/phone/${formattedGuest.phone}/name/${formattedGuest.name}`);
    return response.data;
}