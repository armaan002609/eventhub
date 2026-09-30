import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '6px solid #554093',
          background: 'transparent',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <div style={{ width: '32px', height: '4px', background: '#554093' }} />
          <div style={{ width: '32px', height: '4px', background: '#554093' }} />
          <div style={{ width: '32px', height: '4px', background: '#554093' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
