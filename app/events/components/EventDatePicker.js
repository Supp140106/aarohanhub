'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import 'react-day-picker/dist/style.css';

export default function EventDatePicker() {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('12:00');
    const [isOpen, setIsOpen] = useState(false);

    // Combine date and time for the final value.
    const combinedDate = new Date(date);
    const [hours, minutes] = time.split(':');
    combinedDate.setHours(parseInt(hours, 10));
    combinedDate.setMinutes(parseInt(minutes, 10));

    // ISO string formatted exactly for <input type="datetime-local"> or direct db insert 
    // Wait, addEvent reads raw formData.get('schedule').
    // We can just format it to standard ISO.
    const finalISOString = combinedDate.toISOString();

    return (
        <div className="relative overflow-visible">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Date & Time</label>
            
            {/* Hidden native input for the Server Action to catch */}
            <input type="hidden" name="schedule" value={finalISOString} required />
            
            {/* Custom Interactive Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-transparent border-b-2 ${isOpen ? 'border-[#00F0FF]' : 'border-white/20'} flex items-center justify-between py-3 px-2 cursor-pointer hover:border-[#00F0FF] transition-colors group`}
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-[#00F0FF]' : 'text-gray-400 group-hover:text-[#00F0FF]'} transition-colors`} />
                    <span className={`font-medium ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                        {format(combinedDate, "PPp")}
                    </span>
                </div>
            </div>

            {/* Custom Popover */}
            {isOpen && (
                <div className="absolute bottom-full mb-2 right-0 z-[999] bg-[#0a0a0a] border border-[#00F0FF]/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <style>{`
                        .rdp {
                            --rdp-cell-size: 38px;
                            --rdp-accent-color: #00F0FF;
                            --rdp-background-color: rgba(0, 240, 255, 0.1);
                            --rdp-accent-color-dark: #00F0FF;
                            --rdp-background-color-dark: rgba(0, 240, 255, 0.1);
                            --rdp-outline: 2px solid var(--rdp-accent-color);
                            --rdp-outline-selected: 2px solid var(--rdp-accent-color);
                            margin: 0;
                            color: white;
                        }
                        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                            color: black;
                            background-color: #00F0FF;
                            font-weight: 900;
                        }
                        .rdp-day_today {
                            font-weight: bold;
                            color: #00F0FF;
                        }
                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                            background-color: rgba(255, 255, 255, 0.1);
                        }
                    `}</style>
                    <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        className="text-sm font-medium tracking-wide"
                    />
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest font-bold">Time</span>
                        </div>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-[#111] border border-white/20 text-white rounded-lg px-3 py-1.5 focus:border-[#00F0FF] outline-none text-sm font-mono tracking-wider"
                        />
                    </div>
                    
                    <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-5 bg-[#00F0FF]/10 text-[#00F0FF] py-2 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#00F0FF] hover:text-black transition-colors"
                    >
                        Confirm Schedule
                    </button>
                </div>
            )}
        </div>
    );
}
