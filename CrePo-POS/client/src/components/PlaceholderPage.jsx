import React from 'react';

// Component กลางสำหรับหน้าที่ยังไม่เปิดใช้งาน
function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary bg-white/50 rounded-2xl p-8">
      <div className="text-6xl text-primary-light mb-4">
        {icon}
      </div>
      <h1 className="text-3xl font-bold text-primary-text">{title}</h1>
      <p className="mt-2">หน้านี้ยังอยู่ในระหว่างการพัฒนา</p>
    </div>
  );
}

export default PlaceholderPage;
