import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { FaReceipt } from 'react-icons/fa';

function ReceiptsPage() {
  return (
    <PlaceholderPage title="ใบเสร็จรับเงิน" icon={<FaReceipt />} />
  );
}

export default ReceiptsPage;