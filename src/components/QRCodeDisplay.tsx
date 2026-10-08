'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-[#554093]/10 inline-block shadow-sm">
      <QRCodeSVG 
        value={value}
        size={100}
        fgColor="#554093"
        bgColor="#ffffff"
        level="Q"
      />
    </div>
  );
}
