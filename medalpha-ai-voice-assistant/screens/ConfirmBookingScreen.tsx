
import React from 'react';
import { Doctor } from '../types';

interface ConfirmBookingScreenProps {
    doctor: Doctor;
    slot: string;
    onNavigateBack: () => void;
}

const ConfirmBookingScreen: React.FC<ConfirmBookingScreenProps> = ({ doctor, slot, onNavigateBack }) => {
    const appointmentTime = slot.split(', ')[1];

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black/40">
            <header className="flex items-center p-4 pb-2 justify-between opacity-50">
                <button onClick={onNavigateBack} className="flex size-10 items-center justify-center rounded-full bg-white/20">
                    <span className="material-symbols-outlined text-white">arrow_back</span>
                </button>
                <h2 className="text-white text-lg font-bold">Search Results</h2>
                <div className="size-10"></div>
            </header>

            <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-[20px] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="flex justify-center py-3">
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
                    <div className="mb-6">
                        <h2 className="text-[#121617] text-xl font-bold text-center">Step 3: Confirm Booking</h2>
                        <div className="flex items-center gap-2 px-6 mt-4">
                            <div className="h-1 flex-1 bg-brand-blue-500 rounded-full"></div>
                            <div className="h-1 flex-1 bg-brand-blue-500 rounded-full"></div>
                            <div className="h-1 flex-1 bg-brand-blue-500 rounded-full"></div>
                            <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>

                    <div className="flex flex-col rounded-2xl bg-card-light border border-gray-100 overflow-hidden mb-6">
                        <div className="p-4 flex gap-4 items-center">
                            <div className="relative w-16 h-16 shrink-0">
                                <div className="w-full h-full rounded-full bg-center bg-cover bg-no-repeat shadow-inner border-2 border-white" style={{backgroundImage: `url("${doctor.image}")`}}></div>
                                <div className="absolute bottom-0 right-0 bg-white p-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-brand-blue-500 text-[18px] icon-filled">verified</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[#121617] text-lg font-bold leading-tight">{doctor.name}</h3>
                                <p className="text-secondary-text text-sm font-medium">{doctor.specialty} Specialist</p>
                                <div className="flex items-center gap-1 text-xs text-secondary-text mt-1">
                                    <span className="material-symbols-outlined text-[14px]">star</span> {doctor.rating} ({doctor.reviews} reviews)
                                </div>
                            </div>
                        </div>
                        <div className="h-px w-full bg-gray-100"></div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                    <span className="material-symbols-outlined text-[20px] icon-filled">calendar_clock</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Appointment Time</p>
                                    <p className="text-[#121617] font-bold text-base leading-tight mt-0.5">Tomorrow, {appointmentTime}</p>
                                    <p className="text-[11px] text-secondary-text mt-0.5">30 min consultation</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 shrink-0">
                                    <span className="material-symbols-outlined text-[20px] icon-filled">location_on</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Location</p>
                                    <p className="text-[#121617] font-bold text-base leading-tight mt-0.5">{doctor.locationName}</p>
                                    <p className="text-[11px] text-secondary-text mt-0.5">Building A, Room 302 • {doctor.distance} km away</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-2 px-1">
                            <h3 className="text-sm font-bold text-[#121617]">Cost & Insurance</h3>
                            <span className="material-symbols-outlined text-secondary-text text-[16px]">info</span>
                        </div>
                        <div className="rounded-2xl bg-green-50/60 border border-green-100 p-4 flex gap-3 items-center">
                            <div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-green-900 font-bold text-sm">Public Insurance Covered</p>
                                <p className="text-green-800/80 text-xs mt-0.5 leading-snug">Publicly insured • No payment required now</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                        <label className="text-sm font-bold text-[#121617] ml-1">Booking for</label>
                        <button className="flex items-center justify-between w-full p-3 pl-4 rounded-xl bg-white border border-gray-200 transition-all active:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full bg-gradient-to-br from-brand-blue-500 to-blue-400 text-white flex items-center justify-center font-bold text-sm shadow-md">A</div>
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-bold text-[#121617]">Myself (Alex)</span>
                                    <span className="text-xs text-secondary-text">Primary Member</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pr-2">
                                <span className="text-xs text-brand-blue-500 font-semibold">Change</span>
                                <span className="material-symbols-outlined text-secondary-text text-[20px]">expand_more</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-start gap-2 px-2 opacity-70 mb-8">
                        <span className="material-symbols-outlined text-brand-blue-500 text-[16px] mt-0.5">auto_awesome</span>
                        <p className="text-[11px] text-secondary-text leading-relaxed">
                            This slot was recommended based on your preference for morning appointments and insurance compatibility.
                        </p>
                    </div>
                </div>
                <div className="p-4 pb-8 bg-white border-t border-gray-100">
                    <button onClick={() => alert('Booking Confirmed!')} className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-brand-blue-500 hover:bg-brand-blue-500/90 text-white text-lg font-bold shadow-lg shadow-brand-blue-500/25 transition-all active:scale-[0.98]">
                        Confirm Booking
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBookingScreen;
