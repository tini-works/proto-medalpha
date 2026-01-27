
import React from 'react';
import { Doctor } from '../types';
import { doctors } from '../constants';

interface RecommendationsScreenProps {
    onSelectDoctor: (doctor: Doctor) => void;
    onNavigateBack: () => void;
}

const DoctorCard: React.FC<{doctor: Doctor, onSelect: () => void, isTopMatch?: boolean}> = ({ doctor, onSelect, isTopMatch }) => {
    return (
        <div className="relative group">
            {isTopMatch && (
                 <div className="absolute -top-3 left-4 z-10 bg-[#121617] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">stars</span> Top Match
                </div>
            )}
            <div onClick={onSelect} className="flex flex-col cursor-pointer rounded-2xl bg-card-light shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-transform active:scale-[0.99] duration-200">
                <div className="flex p-4 gap-4">
                    <div className="relative w-24 h-24 shrink-0">
                        <div className="w-full h-full rounded-xl bg-center bg-cover bg-no-repeat shadow-inner" style={{backgroundImage: `url("${doctor.image}")`}}></div>
                        <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                            <div className={`flex items-center justify-center size-8 rounded-full font-bold text-xs ring-2 ring-white ${doctor.isOutOfNetwork ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                {doctor.match}%
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                        <div>
                            <h3 className="text-[#121617] text-lg font-bold leading-tight">{doctor.name}</h3>
                            <p className="text-secondary-text text-sm font-medium">{doctor.specialty} • {doctor.locationName}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-secondary-text">
                                <span className="material-symbols-outlined text-[14px]">location_on</span> {doctor.distance} km away
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {doctor.isCovered && !doctor.isOutOfNetwork && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Covered
                                </span>
                            )}
                             {doctor.isOutOfNetwork && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">error</span> Out of Network
                                </span>
                            )}
                            {doctor.hasFastBooking && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span> Fast Booking
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-gray-100"></div>
                <div className="flex items-center justify-between p-4 bg-gray-50/50">
                    <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-secondary-text font-semibold">Next Available</span>
                        <div className={`flex items-center gap-1.5 mt-0.5 text-sm font-bold ${doctor.isOutOfNetwork ? 'text-orange-600' : 'text-[#121617]'}`}>
                           <span className={`material-symbols-outlined text-[18px] ${doctor.isOutOfNetwork ? 'text-orange-600' : 'text-primary'}`}>{doctor.isOutOfNetwork ? 'emergency' : 'calendar_clock' }</span>
                            {doctor.nextAvailable}
                        </div>
                    </div>
                    <button className="flex items-center justify-center px-5 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-all">
                        More Slots
                    </button>
                </div>
            </div>
        </div>
    )
}


const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({ onSelectDoctor, onNavigateBack }) => {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
            <header className="sticky top-0 z-20 flex items-center bg-background-light/95 backdrop-blur-md p-4 pb-2 justify-between">
                <button onClick={onNavigateBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[#121617]">arrow_back</span>
                </button>
                <h2 className="text-[#121617] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Step 1: Recommendations</h2>
                <div className="size-10"></div>
            </header>

            <div className="px-4 py-2 sticky top-[60px] z-10 bg-background-light">
                <div className="flex w-full items-start rounded-xl bg-white shadow-sm border border-transparent focus-within:border-primary/50 transition-all p-3 gap-2">
                    <div className="text-primary mt-0.5">
                        <span className="material-symbols-outlined icon-filled">auto_awesome</span>
                    </div>
                    <p className="flex w-full min-w-0 flex-1 bg-transparent text-base font-medium text-[#121617] leading-relaxed">I need a cardiologist near Berlin who takes public insurance</p>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold whitespace-nowrap border border-primary/20">
                        <span className="material-symbols-outlined text-[18px]">location_on</span> Berlin +10km
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-secondary-text text-sm font-medium whitespace-nowrap">
                        <span className="material-symbols-outlined text-[18px]">credit_card</span> Public Insurance
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-secondary-text text-sm font-medium whitespace-nowrap">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span> This Week
                    </button>
                </div>
            </div>

            <main className="flex-1 flex flex-col gap-6 p-4 pt-2">
                <div className="flex items-baseline justify-between pt-2">
                    <h2 className="text-[#121617] tracking-tight text-2xl font-bold leading-tight">Recommendation</h2>
                    <span className="text-secondary-text text-sm font-medium">3 highly relevant</span>
                </div>
                
                <DoctorCard doctor={doctors[0]} onSelect={() => onSelectDoctor(doctors[0])} isTopMatch />
                <DoctorCard doctor={doctors[1]} onSelect={() => onSelectDoctor(doctors[1])} />
                <DoctorCard doctor={doctors[2]} onSelect={() => onSelectDoctor(doctors[2])} />
                
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-[#121617]">Why these recommendations?</p>
                        <p className="text-xs text-secondary-text leading-relaxed">
                            These doctors match your location, accept public insurance, and specialize in cardiovascular health. Rankings prioritize earlier availability.
                        </p>
                    </div>
                </div>
                <div className="h-8"></div>
            </main>
        </div>
    );
};

export default RecommendationsScreen;
