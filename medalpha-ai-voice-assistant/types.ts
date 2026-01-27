
export enum Screen {
    VoiceAssistant,
    Recommendations,
    DoctorProfile,
    ConfirmBooking,
}

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    locationName: string;
    distance: number;
    rating: number;
    reviews: number;
    match: number;
    image: string;
    isCovered: boolean;
    isOutOfNetwork?: boolean;
    hasFastBooking: boolean;
    nextAvailable: string;
    nextAvailableShort: string;
}
