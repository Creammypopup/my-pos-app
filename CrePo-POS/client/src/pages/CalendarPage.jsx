import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../features/event/eventSlice';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Helper functions for date manipulation
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const MONTH_NAMES = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const DAY_NAMES = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// Event Modal Component
const EventModal = ({ isOpen, onClose, onSave, onDelete, eventData, setEventData }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        const [datePart, timePart] = eventData[name].split('T');
        if (e.target.type === 'date') {
            setEventData(prev => ({ ...prev, [name]: `${value}T${timePart || '00:00'}` }));
        } else {
            setEventData(prev => ({ ...prev, [name]: `${datePart}T${value}` }));
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <form onSubmit={onSave} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">{eventData._id ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}</h2>
                <div className="space-y-4">
                    <input name="title" value={eventData.title || ''} onChange={handleChange} placeholder="หัวข้อ" className="w-full p-2 border rounded" required />
                    <div className="flex items-center gap-4">
                        <label className="w-20">เริ่มต้น:</label>
                        <input type="date" value={eventData.start?.split('T')[0] || ''} onChange={(e) => handleDateTimeChange(e, 'start')} className="p-2 border rounded" />
                        <input type="time" value={eventData.start?.split('T')[1] || ''} onChange={(e) => handleDateTimeChange(e, 'start')} className="p-2 border rounded" />
                    </div>
                     <div className="flex items-center gap-4">
                        <label className="w-20">สิ้นสุด:</label>
                        <input type="date" value={eventData.end?.split('T')[0] || ''} onChange={(e) => handleDateTimeChange(e, 'end')} className="p-2 border rounded" />
                        <input type="time" value={eventData.end?.split('T')[1] || ''} onChange={(e) => handleDateTimeChange(e, 'end')} className="p-2 border rounded" />
                    </div>
                    <textarea name="notes" value={eventData.notes || ''} onChange={handleChange} placeholder="รายละเอียดเพิ่มเติม..." rows="3" className="w-full p-2 border rounded"></textarea>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <div>
                        {eventData._id && <button type="button" onClick={() => onDelete(eventData._id)} className="text-red-500 p-2 rounded-full hover:bg-red-100"><FaTrash /></button>}
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">ยกเลิก</button>
                        <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-lg">บันทึก</button>
                    </div>
                </div>
            </form>
        </div>
    );
};


function CalendarPage() {
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        dispatch(getEvents());
        // Request notification permission on component mount
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, [dispatch]);

    // Simple in-app notification scheduler
    useEffect(() => {
        events.forEach(event => {
            const eventTime = new Date(event.start).getTime();
            const now = new Date().getTime();
            const timeUntilEvent = eventTime - now;

            if (timeUntilEvent > 0) {
                setTimeout(() => {
                    if (Notification.permission === "granted") {
                        new Notification('แจ้งเตือนกิจกรรม', {
                            body: event.title,
                            icon: '/logo.png' // Optional: add a logo in your public folder
                        });
                    }
                }, timeUntilEvent);
            }
        });
    }, [events]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const openModal = (day, event = null) => {
        if (event) {
            setSelectedEvent({
                ...event,
                start: new Date(event.start).toISOString().substring(0, 16),
                end: new Date(event.end).toISOString().substring(0, 16),
            });
        } else {
            const now = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, now.getHours(), now.getMinutes());
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration
            setSelectedEvent({
                title: '',
                start: startDate.toISOString().substring(0, 16),
                end: endDate.toISOString().substring(0, 16),
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveEvent = useCallback((e) => {
        e.preventDefault();
        const action = selectedEvent._id ? updateEvent(selectedEvent) : createEvent(selectedEvent);
        dispatch(action).unwrap().then(() => {
            toast.success("บันทึกกิจกรรมสำเร็จ!");
            setIsModalOpen(false);
        }).catch(err => toast.error(err.message || "เกิดข้อผิดพลาด"));
    }, [dispatch, selectedEvent]);
    
    const handleDeleteEvent = useCallback((id) => {
        if (window.confirm("คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?")) {
            dispatch(deleteEvent(id)).unwrap().then(() => {
                toast.success("ลบกิจกรรมสำเร็จ!");
                setIsModalOpen(false);
            }).catch(err => toast.error(err.message || "เกิดข้อผิดพลาด"));
        }
    }, [dispatch]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();

        let blanks = Array(firstDay).fill(null);
        let days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="border-r border-b"></div>;

            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => new Date(e.start).toDateString() === new Date(dateStr).toDateString());

            return (
                <div key={day} className="border-r border-b p-2 min-h-[120px] flex flex-col relative hover:bg-purple-50 transition-colors">
                    <div className={`font-bold ${isToday ? 'text-white bg-purple-500 rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day}</div>
                    <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
                        {dayEvents.map(event => (
                            <div key={event._id} onClick={() => openModal(day, event)} className="text-xs bg-purple-200 text-purple-800 p-1 rounded cursor-pointer truncate">
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
            <EventModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                eventData={selectedEvent}
                setEventData={setSelectedEvent}
            />
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronLeft /></button>
                <h2 className="text-2xl font-bold text-primary-text">{`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`}</h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronRight /></button>
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
