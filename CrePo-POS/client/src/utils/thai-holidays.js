// A simple holiday utility. In a real app, this might come from an API.
// This list is for demonstration purposes and may not be complete or accurate for all years.

const holidays = [
    { month: 1, day: 1, name: "วันขึ้นปีใหม่" },
    { month: 1, day: 16, name: "วันครู" },
    { month: 2, day: 10, name: "วันตรุษจีน" }, // Example, date varies
    { month: 2, day: 24, name: "วันมาฆบูชา" }, // Example, date varies
    { month: 4, day: 6, name: "วันจักรี" },
    { month: 4, day: 13, name: "วันสงกรานต์" },
    { month: 4, day: 14, name: "วันสงกรานต์" },
    { month: 4, day: 15, name: "วันสงกรานต์" },
    { month: 5, day: 1, name: "วันแรงงาน" },
    { month: 5, day: 4, name: "วันฉัตรมงคล" },
    { month: 5, day: 22, name: "วันวิสาขบูชา" }, // Example, date varies
    { month: 6, day: 3, name: "วันเฉลิมฯ พระราชินี" },
    { month: 7, day: 20, name: "วันอาสาฬหบูชา" }, // Example, date varies
    { month: 7, day: 21, name: "วันเข้าพรรษา" }, // Example, date varies
    { month: 7, day: 28, name: "วันเฉลิมฯ ร.10" },
    { month: 8, day: 12, name: "วันแม่แห่งชาติ" },
    { month: 10, day: 13, name: "วันคล้ายวันสวรรคต ร.9" },
    { month: 10, day: 23, name: "วันปิยมหาราช" },
    { month: 10, day: 31, name: "วันฮาโลวีน" },
    { month: 12, day: 5, name: "วันพ่อแห่งชาติ" },
    { month: 12, day: 10, name: "วันรัฐธรรมนูญ" },
    { month: 12, day: 25, name: "วันคริสต์มาส" },
    { month: 12, day: 31, name: "วันสิ้นปี" },
];

export const getThaiHolidays = (year) => {
    return holidays.map(h => ({
        date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
        name: h.name,
    }));
};
