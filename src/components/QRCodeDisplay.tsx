'use client';

import React from 'react';

export default function QRCodeDisplay({ value }: { value: string }) {
  const encodedValue = encodeURIComponent(value);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}&color=554093&bgcolor=ffffff`;

  return (
    <div className="bg-white p-3 rounded-xl border border-[#554093]/10 inline-block shadow-sm">
      <img src={qrUrl} alt="QR Code Event Pass" width={100} height={100} className="rounded-md" />
    </div>
  );
}
