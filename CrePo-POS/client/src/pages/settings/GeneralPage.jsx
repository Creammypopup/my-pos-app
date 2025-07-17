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
    storeTaxId: '', // <-- นำกลับมา
  });

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);
  
  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        storeAddress: settings.storeAddress || '',
        storePhone: settings.storePhone || '',
        storeTaxId: settings.storeTaxId || '', // <-- นำกลับมา
      });
    }
  }, [settings]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

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
        toast.success('บันทึกข้อมูลร้านค้าสำเร็จ!');
        dispatch(getSettings());
      })
      .catch((err) => {
        toast.error(err.message || 'เกิดข้อผิดพลาดในการบันทึก');
      });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary mb-6">ตั้งค่าทั่วไป</h1>
      <div className="max-w-2xl bg-content-bg p-8 rounded-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-text-secondary">ชื่อร้านค้า</label>
            <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={onChange} className="mt-1 block w-full px-4 py-2 border border-border-color rounded-lg focus:ring-primary-main focus:border-primary-main" />
          </div>
          <div>
            <label htmlFor="storeAddress" className="block text-sm font-medium text-text-secondary">ที่อยู่</label>
            <textarea id="storeAddress" name="storeAddress" value={formData.storeAddress} onChange={onChange} rows="3" className="mt-1 block w-full px-4 py-2 border border-border-color rounded-lg focus:ring-primary-main focus:border-primary-main"></textarea>
          </div>
          <div>
            <label htmlFor="storePhone" className="block text-sm font-medium text-text-secondary">เบอร์โทรศัพท์</label>
            <input type="text" id="storePhone" name="storePhone" value={formData.storePhone} onChange={onChange} className="mt-1 block w-full px-4 py-2 border border-border-color rounded-lg focus:ring-primary-main focus:border-primary-main" />
          </div>
          <div>
            <label htmlFor="storeTaxId" className="block text-sm font-medium text-text-secondary">เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" id="storeTaxId" name="storeTaxId" value={formData.storeTaxId} onChange={onChange} className="mt-1 block w-full px-4 py-2 border border-border-color rounded-lg focus:ring-primary-main focus:border-primary-main" />
          </div>
          <div className="text-right pt-4">
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:bg-primary-main disabled:bg-gray-400 transition-colors">
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneralPage;