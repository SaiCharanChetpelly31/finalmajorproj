
import React, { useState, useEffect } from 'react';
import qrcode from 'qrcode';

function QRCode({ text }) {
  const [qrCode, setQRCode] = useState(null);

  useEffect(() => {
    // Generate QR code
    const generateQR = async (text) => {
      try {
        const qrCode = await qrcode.toDataURL(text);
        setQRCode(qrCode);
      } catch (err) {
        console.error(err);
      }
    };

    generateQR(text);
  }, [text]);

  return (
    <div>
      {qrCode && <img src={qrCode} alt="QR code" />}
    </div>
  );
}

export default QRCode;

