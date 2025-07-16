import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../features/event/eventSlice';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getThaiHolidays } from '../utils/thai-holidays'; // Import holidays

// ... (EventModal component remains the same)

function CalendarPage() {
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        dispatch(getEvents());
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, [dispatch]);

    // ... (Notification scheduler useEffect remains the same)

    const thaiHolidays = useMemo(() => getThaiHolidays(currentDate.getFullYear()), [currentDate]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const openModal = (day, event = null) => {
        // ... (openModal logic remains the same)
    };

    const handleSaveEvent = useCallback((e) => {
        // ... (handleSaveEvent logic remains the same)
    }, [dispatch, selectedEvent]);
    
    const handleDeleteEvent = useCallback((id) => {
        // ... (handleDeleteEvent logic remains the same)
    }, [dispatch]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();

        let blanks = Array(firstDay).fill(null);
        let days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="border-r border-b"></div>;

            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => new Date(e.start).toDateString() === new Date(dateStr).toDateString());
            const holiday = thaiHolidays.find(h => h.date === dateStr);

            return (
                <div key={day} className="border-r border-b p-2 min-h-[120px] flex flex-col relative hover:bg-purple-50 transition-colors">
                    <div className={`font-bold ${isToday ? 'text-white bg-purple-500 rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day}</div>
                    <div className="flex-grow mt-1 space-y-1 overflow-y-auto text-xs">
                        {holiday && <div className="bg-green-100 text-green-800 p-1 rounded truncate">{holiday.name}</div>}
                        {dayEvents.map(event => (
                            <div key={event._id} onClick={() => openModal(day, event)} className="bg-purple-200 text-purple-800 p-1 rounded cursor-pointer truncate">
                                {event.title}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => openModal(day)} className="absolute bottom-1 right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-purple-300"><FaPlus size={10}/></button>
                </div>
            );
        });
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-lg">
            {/* ... (EventModal remains the same) ... */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronLeft /></button>
                    <h2 className="text-2xl font-bold text-primary-text">{`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`}</h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronRight /></button>
                </div>
                <button onClick={() => openModal(new Date().getDate())} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark text-sm">
                    <FaPlus className="mr-2" /> เพิ่มกิจกรรมด่วน
                </button>
            </div>
            <div className="grid grid-cols-7 text-center font-semibold text-text-secondary">
                {DAY_NAMES.map(day => <div key={day} className="py-2 border-b-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 border-l border-t">
                {renderCalendar()}
            </div>
        </div>
    );
}

export default CalendarPage;
