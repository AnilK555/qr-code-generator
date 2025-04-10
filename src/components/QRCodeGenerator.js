import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

const QRCodeGenerator = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        website: '',
    });

    const [qrValue, setQrValue] = useState('');
    const qrRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateQR = () => {
        const qrString = Object.entries(formData)
            .map(([key, value]) => `${key[0].toUpperCase() + key.slice(1)}: ${value}`)
            .join('\n');
        setQrValue(qrString);
    };

    const handleDownloadQR = () => {
        if (qrRef.current === null) return;

        toPng(qrRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'qr-code.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Failed to download QR code:', err);
            });
    };

    return (
        <div className="generator-conatiner">
            <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>

            {['name', 'email', 'phone', 'address', 'company', 'website'].map((field) => (
                <input
                    key={field}
                    name={field}
                    placeholder={field[0].toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    className="text-input"

                />
            ))}

            <button onClick={handleGenerateQR} className="generate-button">
                Generate QR
            </button>

            {qrValue && (
                <div className="mt-6 text-center">
                    <div ref={qrRef} className="inline-block p-4 bg-white rounded shadow">
                        <QRCode value={qrValue} />
                    </div>
                    <button onClick={handleDownloadQR} className="download-button">
                        Download QR
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;