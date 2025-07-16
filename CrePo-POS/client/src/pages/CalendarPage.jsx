import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../features/event/eventSlice';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaGopuram } from 'react-icons/fa'; // <-- แก้ไข: เปลี่ยน FaBuddhist เป็น FaGopuram
import { toast } from 'react-toastify';
import { getThaiHolidays, getBuddhistHolyDays } from '../utils/thai-holidays'; 

const MONTH_NAMES = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const DAY_NAMES = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// Event Modal Component (No changes here, so it's collapsed for brevity)
const EventModal = ({ isOpen, event, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setNotes(event.notes || '');
        } else {
            setTitle('');
            setNotes('');
        }
    }, [event]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...event, title, notes });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">{event?._id ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}</h2>
                <input type="text" placeholder="ชื่อกิจกรรม" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <textarea placeholder="รายละเอียด" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded mb-4" />
                <div className="flex justify-between">
                    <div>{event?._id && (<button onClick={() => onDelete(event._id)} className="bg-red-500 text-white px-4 py-2 rounded"><FaTrash /></button>)}</div>
                    <div>
                        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">ยกเลิก</button>
                        <button onClick={handleSave} className="bg-purple-500 text-white px-4 py-2 rounded">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CalendarPage() {
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        dispatch(getEvents());
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, [dispatch]);

     const allMonthEvents = useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const holidays = getThaiHolidays(year).filter(h => new Date(h.date).getMonth() === month);
      const holyDays = getBuddhistHolyDays(year, month);
      const userEvents = events.filter(e => new Date(e.start).getMonth() === month && new Date(e.start).getFullYear() === year);
      
      const combined = [
        ...holidays.map(e => ({...e, type: 'holiday'})),
        ...holyDays.map(e => ({...e, type: 'holy'})),
        ...userEvents.map(e => ({...e, date: e.start, name: e.title, type: 'user'}))
      ];

      return combined.sort((a,b) => new Date(a.date) - new Date(b.date));

    }, [currentDate, events]);


    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const openModal = (day, event = null) => {
        setSelectedDay(day);
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedEvent(event ? event : { start: date, end: date, allDay: true });
        setIsModalOpen(true);
    };

    const handleSaveEvent = useCallback((eventData) => {
        const { _id, ...dataToSave } = eventData;
        if (_id) {
            dispatch(updateEvent(eventData));
        } else {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
            dispatch(createEvent({ ...dataToSave, start: date, end: date, allDay: true }));
        }
        setIsModalOpen(false);
    }, [dispatch, currentDate, selectedDay]);
    
    const handleDeleteEvent = useCallback((id) => {
        dispatch(deleteEvent(id));
        setIsModalOpen(false);
    }, [dispatch]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();

        const holyDaysForMonth = getBuddhistHolyDays(year, month);

        let blanks = Array(firstDay).fill(null);
        let days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="border-r border-b"></div>;

            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => new Date(e.start).toDateString() === new Date(dateStr).toDateString());
            const holiday = getThaiHolidays(year).find(h => h.date === dateStr);
            const holyDay = holyDaysForMonth.find(h => new Date(h.date).getDate() === day);

            return (
                <div key={day} className="border-r border-b p-2 min-h-[120px] flex flex-col relative hover:bg-purple-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className={`font-bold ${isToday ? 'text-white bg-primary-dark rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-600'}`}>{day}</div>
                      {holyDay && (
                        <div title={holyDay.name} className="text-yellow-500">
                          <FaGopuram /> {/* <-- แก้ไข: เปลี่ยน FaBuddhist เป็น FaGopuram */}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow mt-1 space-y-1 overflow-y-auto text-xs">
                        {holiday && <div className="bg-green-100 text-green-800 p-1 rounded truncate">{holiday.name}</div>}
                        {dayEvents.map(event => (
                            <div key={event._id} onClick={() => openModal(day, event)} className="bg-purple-200 text-purple-800 p-1 rounded cursor-pointer truncate">
                                {event.title}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => openModal(day)} className="absolute bottom-1 right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-purple-300 opacity-50 hover:opacity-100 transition-opacity"><FaPlus size={10}/></button>
                </div>
            );
        });
    };

    return (
        <div className="flex gap-4 p-4 h-[calc(100vh-100px)]">
             <EventModal isOpen={isModalOpen} event={selectedEvent} onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} onDelete={handleDeleteEvent}/>
            <div className="flex-grow bg-white rounded-2xl shadow-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronLeft /></button>
                        <h2 className="text-2xl font-bold text-primary-text">{`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`}</h2>
                        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><FaChevronRight /></button>
                    </div>
                    <button onClick={() => openModal(new Date().getDate())} className="flex items-center bg-primary-main text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark text-sm">
                        <FaPlus className="mr-2" /> เพิ่มกิจกรรม
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-text-secondary">
                    {DAY_NAMES.map(day => <div key={day} className="py-2 border-b-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 border-l border-t flex-grow">
                    {renderCalendar()}
                </div>
            </div>
            {/* Monthly Events Summary */}
            <div className="w-1/4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
                <h3 className="text-xl font-bold text-primary-text mb-4">สรุปประจำเดือน</h3>
                <div className="overflow-y-auto flex-grow">
                    {allMonthEvents.length > 0 ? (
                        <ul className="space-y-3">
                            {allMonthEvents.map((event, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm p-2 rounded-lg">
                                    <div className="font-bold text-center">
                                        <div className="text-primary-dark">{new Date(event.date).getDate()}</div>
                                        <div className="text-xs text-gray-500">{MONTH_NAMES[new Date(event.date).getMonth()].substring(0,3)}</div>
                                    </div>
                                    <div className="flex-grow">
                                      <p className={`font-semibold ${event.type === 'user' ? 'text-purple-700' : event.type === 'holiday' ? 'text-green-700' : 'text-yellow-700'}`}>{event.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">ไม่มีกิจกรรมในเดือนนี้</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;