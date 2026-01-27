
import React, { useState, useEffect } from 'react';

interface VoiceAssistantScreenProps {
    onSend: () => void;
}

const VoiceAssistantScreen: React.FC<VoiceAssistantScreenProps> = ({ onSend }) => {
    const [transcript, setTranscript] = useState("I'm looking for a dermatol");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if(isTyping) {
            const timer = setTimeout(() => {
                setTranscript(prev => prev + '—');
                setIsTyping(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTyping]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-neutral-50 text-neutral-800">
            <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
                <div className="text-neutral-800 flex size-12 shrink-0 items-center justify-start cursor-pointer">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </div>
                <h2 className="text-neutral-800 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Voice Assistant</h2>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex size-12 cursor-pointer items-center justify-end overflow-hidden rounded-xl bg-transparent text-neutral-800 p-0">
                        <span className="material-symbols-outlined text-2xl">info</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pt-8 gap-6">
                <div className="flex items-start gap-3">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0 border border-brand-blue-500/10 shadow-sm" 
                      style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6iWP8ccqaLfcFcPjF3e-Ld9rkAlqFB-kRDNH_8PRVL1rZPdtCILFeJ8jwc0u5_9yDb9Y_XwOrbn4CSCUrDSzekS8ubDEtKotpxRMLZ18-GZDQPRG1cjZmNEHKn8QNPTp4XFWQwUXfSknQXx2L-xY3CcREc2-8h83RtOqYEFXW2g-uY4L3EeFT8PYAlluGDAqtbhcRSdiKZmwbiJzNCR42DqfEo7LR3UzkjoioPstqjhsl2s7Ic5IpGMGH2QUvbfiOux_1b2wlGlU")'}}>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                        <p className="text-brand-blue-500 text-[13px] font-semibold leading-normal">MedAlpha AI</p>
                        <div className="relative">
                            <p className="text-lg font-medium leading-relaxed flex max-w-[280px] rounded-20px rounded-tl-none px-5 py-4 bg-brand-blue-500 text-white shadow-lg">
                                How can I help you? Describe your symptoms or current health concern.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative py-8">
                    <div className="mic-pulse-2"></div>
                    <div className="mic-pulse-1"></div>
                    <button className="relative z-10 flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-blue-500 text-white shadow-[0_8px_24px_rgba(0,95,115,0.35)] transition-transform active:scale-95">
                        <span className="material-symbols-outlined !text-4xl">mic</span>
                    </button>
                    <p className="mt-8 text-brand-teal-500 font-bold tracking-widest uppercase text-xs">Listening...</p>
                </div>

                <div className="mt-auto flex flex-col gap-4 pb-8">
                    <div className="flex flex-col gap-4 rounded-20px bg-white p-6 shadow-[0_12px_40px_rgba(16,42,50,0.08)] border border-white/50">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue-500 text-sm">record_voice_over</span>
                                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.1em]">Real-time Transcript</p>
                            </div>
                            <p className="text-neutral-800 text-xl font-medium leading-relaxed h-8">
                                I'm looking for a <span className="text-brand-blue-500">{transcript.split(' ').pop()}</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-50 pt-5">
                            <button className="flex items-center justify-center rounded-xl h-10 px-4 bg-neutral-50 text-neutral-800 gap-2 text-sm font-bold active:bg-neutral-100 transition-colors">
                                <span className="material-symbols-outlined text-lg">stop</span>
                                <span>Stop</span>
                            </button>
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal-500 opacity-40"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal-500 opacity-20"></div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onSend} className="w-full h-[56px] min-h-[44px] bg-brand-blue-500 hover:bg-[#004e5e] text-white rounded-20px flex items-center justify-center gap-2 font-bold text-base shadow-lg transition-all active:scale-[0.98]">
                        <span>Send</span>
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                </div>
            </div>
            <div className="h-4 bg-transparent"></div>
        </div>
    );
};

export default VoiceAssistantScreen;
