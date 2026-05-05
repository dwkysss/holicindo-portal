// components/UnitQRCode.tsx
"use client";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function UnitQRCode({
  serialNumber,
  hideButton = false,
}: {
  serialNumber: string;
  hideButton?: boolean;
}) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Arahkan QR ke halaman Unit Passport utama, BUKAN halaman print
    const baseUrl = window.location.origin;
    setCurrentUrl(`${baseUrl}/unit/${serialNumber.toLowerCase()}`);
  }, [serialNumber]);

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-white border-[8px] border-gray-900 rounded-3xl">
        {currentUrl ? (
          <QRCodeSVG value={currentUrl} size={200} level={"H"} />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 animate-pulse rounded" />
        )}
      </div>

      {!hideButton && (
        <button
          onClick={() => window.print()}
          className="no-print mt-4 text-blue-600 font-bold uppercase text-[10px]"
        >
          Print Label
        </button>
      )}
    </div>
  );
}
