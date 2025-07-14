import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, updateSettings, reset } from '../../features/setting/settingSlice';
import { toast } from 'react-toastify';

function GeneralPage() {
  const dispatch = useDispatch();
  const { settings, isLoading, isError, message } = useSelector((state) => state.settings);
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeTaxId: '',
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    dispatch(getSettings());
  }, [dispatch, isError, message]);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        storeAddress: settings.storeAddress || '',
        storePhone: settings.storePhone || '',
        storeTaxId: settings.storeTaxId || '',
      });
    }
  }, [settings]);

  const { storeName, storeAddress, storePhone, storeTaxId } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(formData))
      .unwrap()
      .then(() => {
        toast.success('บันทึกข้อมูลสำเร็จ!');
      })
      .catch((err) => {
        toast.error('เกิดข้อผิดพลาดในการบันทึก');
      });
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">ตั้งค่าทั่วไป</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อร้านค้า</label>
            <input type="text" name="storeName" value={storeName} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
            <textarea name="storeAddress" value={storeAddress} onChange={onChange} rows="3" className="mt-1 block w-full px-3 py-2 border rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
            <input type="text" name="storePhone" value={storePhone} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" name="storeTaxId" value={storeTaxId} onChange={onChange} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneralPage;
