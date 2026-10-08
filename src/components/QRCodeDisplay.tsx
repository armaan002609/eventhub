'use client';

import React from 'react';
import QRCode from 'react-qr-code';

export default function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#554093]/10 inline-block shadow-sm">
      <QRCode value={value} size={100} level="H" />
    </div>
  );
}
