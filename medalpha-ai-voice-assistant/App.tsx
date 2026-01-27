
import React, { useState, useCallback } from 'react';
import { Screen, Doctor } from './types';
import VoiceAssistantScreen from './screens/VoiceAssistantScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import ConfirmBookingScreen from './screens/ConfirmBookingScreen';
import { doctors } from './constants';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.VoiceAssistant);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(doctors[0]);
    const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow, 10:00 AM');

    const navigateTo = useCallback((screen: Screen) => {
        setCurrentScreen(screen);
        window.scrollTo(0, 0);
    }, []);

    const handleSelectDoctor = useCallback((doctor: Doctor) => {
        setSelectedDoctor(doctor);
        navigateTo(Screen.DoctorProfile);
    }, [navigateTo]);

    const handleSelectSlot = useCallback((doctor: Doctor, slot: string) => {
        setSelectedDoctor(doctor);
        setSelectedSlot(slot);
        navigateTo(Screen.ConfirmBooking);
    }, [navigateTo]);

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.VoiceAssistant:
                return <VoiceAssistantScreen onSend={() => navigateTo(Screen.Recommendations)} />;
            case Screen.Recommendations:
                return <RecommendationsScreen onSelectDoctor={handleSelectDoctor} onNavigateBack={() => navigateTo(Screen.VoiceAssistant)} />;
            case Screen.DoctorProfile:
                if (selectedDoctor) {
                    return <DoctorProfileScreen doctor={selectedDoctor} onSelectSlot={handleSelectSlot} onNavigateBack={() => navigateTo(Screen.Recommendations)} />;
                }
                return null;
            case Screen.ConfirmBooking:
                if (selectedDoctor && selectedSlot) {
                    return <ConfirmBookingScreen doctor={selectedDoctor} slot={selectedSlot} onNavigateBack={() => navigateTo(Screen.DoctorProfile)} />;
                }
                return null;
            default:
                return <VoiceAssistantScreen onSend={() => navigateTo(Screen.Recommendations)} />;
        }
    };

    return <div className="max-w-md mx-auto bg-background-light shadow-2xl min-h-screen">{renderScreen()}</div>;
};

export default App;
