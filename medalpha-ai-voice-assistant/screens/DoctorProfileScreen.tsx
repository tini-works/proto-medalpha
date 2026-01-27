
import React, { useState } from 'react';
import { Doctor } from '../types';

interface DoctorProfileScreenProps {
    doctor: Doctor;
    onSelectSlot: (doctor: Doctor, slot: string) => void;
    onNavigateBack: () => void;
}

const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ doctor, onSelectSlot, onNavigateBack }) => {
    const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
    
    const timeSlots = ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:45 PM', '04:15 PM', '05:00 PM'];
    
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
            <header className="sticky top-0 z-30 flex items-center bg-background-light/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-transparent">
                <button onClick={onNavigateBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 group">
                    <span className="material-symbols-outlined text-neutral-800 group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                </button>
                <h2 className="text-neutral-800 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Step 2: Doctor Profile</h2>
                <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
                    <span className="material-symbols-outlined text-neutral-800">favorite</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
                <div className="px-5 pt-6 pb-4 flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                         <div className="size-24 rounded-2xl bg-center bg-cover bg-no-repeat shadow-inner" style={{backgroundImage: `url("${doctor.image}")`}}></div>
                        <div className="absolute -bottom-2 -right-1 bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg border-2 border-white flex items-center gap-0.5 whitespace-nowrap">
                            <span className="material-symbols-outlined text-[10px] icon-filled">stars</span> {doctor.match}% Match
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-xl font-extrabold text-neutral-800">{doctor.name}</h1>
                        <p className="text-secondary-text text-sm font-semibold mb-3">{doctor.specialty} • {doctor.locationName}</p>
                        <div className="flex items-center gap-4">
                            {/* Stats */}
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1 text-neutral-800 font-bold text-sm">
                                    <span className="material-symbols-outlined icon-filled text-yellow-400 text-[14px]">star</span> {doctor.rating}
                                </div>
                                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Rating</span>
                            </div>
                            <div className="w-px h-6 bg-gray-200"></div>
                            <div className="flex flex-col items-start">
                                <div className="text-neutral-800 font-bold text-sm">15</div>
                                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Years Exp</span>
                            </div>
                             <div className="w-px h-6 bg-gray-200"></div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1 text-neutral-800 font-bold text-sm">
                                    {doctor.distance}<span className="text-[10px] font-medium opacity-60">km</span>
                                </div>
                                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider">Distance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-4">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue-500 icon-filled">auto_awesome</span>
                                <h3 className="text-sm font-bold text-brand-blue-500 uppercase tracking-wide group-hover:underline">Why this fits your search</h3>
                            </div>
                            <span className="material-symbols-outlined text-brand-blue-500 text-sm font-bold">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-8">
                     {/* Calendar and Slots */}
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-neutral-800">October 2023</h3>
                        <div className="flex gap-1">
                            <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-secondary-text"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                            <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-secondary-text"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
                        </div>
                    </div>
                     <div className="bg-card-light rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-7 mb-2 text-center text-xs font-medium text-secondary-text">
                           <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 text-center text-sm font-medium">
                            <span className="text-gray-300">25</span><span className="text-gray-300">26</span><span className="text-gray-300">27</span><span className="text-gray-300">28</span><span className="text-gray-300">29</span><span className="text-gray-300">30</span><span className="text-neutral-800">1</span>
                            <span className="text-neutral-800">2</span><span className="text-neutral-800">3</span><span className="text-neutral-800">4</span><span className="text-neutral-800">5</span><span className="text-neutral-800">6</span><span className="text-secondary-text/50">7</span><span className="text-secondary-text/50">8</span>
                            <span className="text-neutral-800">9</span><span className="text-neutral-800">10</span><span className="text-neutral-800">11</span><span className="text-neutral-800">12</span>
                            <div className="relative flex items-center justify-center">
                                <span className="relative z-10 text-white">13</span>
                                <div className="absolute size-8 bg-brand-blue-500 rounded-full shadow-md shadow-brand-blue-500/30"></div>
                                <div className="absolute -bottom-1 size-1 bg-white rounded-full z-20"></div>
                            </div>
                            <span className="text-neutral-800">14</span><span className="text-secondary-text/50">15</span><span className="text-neutral-800">16</span><span className="text-neutral-800">17</span><span className="text-neutral-800">18</span><span className="text-neutral-800">19</span><span className="text-neutral-800">20</span><span className="text-secondary-text/50">21</span><span className="text-secondary-text/50">22</span>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-neutral-800">Available Slots (Tomorrow)</h4>
                        <span className="text-xs text-secondary-text">Berlin Time (CET)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map(slot => (
                             <button 
                                key={slot}
                                onClick={() => slot !== '03:45 PM' && setSelectedSlot(slot)}
                                className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-colors ${
                                    slot === selectedSlot 
                                        ? 'relative bg-brand-blue-500 text-white font-bold shadow-lg shadow-brand-blue-500/25 ring-2 ring-offset-2 ring-brand-blue-500' 
                                        : slot === '03:45 PM' 
                                            ? 'border border-gray-200 text-gray-300 line-through cursor-not-allowed bg-gray-50'
                                            : 'border border-gray-200 text-neutral-800 hover:border-brand-blue-500/50'
                                }`}
                             >
                                {slot}
                                {slot === '10:00 AM' && (
                                     <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-white text-brand-blue-500 text-[9px] uppercase tracking-wider font-bold rounded shadow-sm border border-brand-blue-500/20 whitespace-nowrap">Best Fit</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-8"></div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40">
                <div className="max-w-md mx-auto relative">
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-light via-background-light to-transparent -z-10 pointer-events-none"></div>
                    <div className="bg-card-light p-4 m-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col">
                                <span className="text-xs text-secondary-text font-medium">Selected Slot</span>
                                <span className="text-neutral-800 font-bold">Tomorrow, {selectedSlot}</span>
                            </div>
                            <span className="text-brand-blue-500 font-bold text-lg">€0 <span className="text-xs font-normal text-secondary-text line-through">€80</span></span>
                        </div>
                        <button onClick={() => onSelectSlot(doctor, `Tomorrow, ${selectedSlot}`)} className="w-full h-12 flex items-center justify-center gap-2 bg-brand-blue-500 hover:bg-brand-blue-500/90 text-white rounded-xl font-bold shadow-lg shadow-brand-blue-500/25 transition-all active:scale-[0.98]">
                            Select this Slot
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileScreen;
