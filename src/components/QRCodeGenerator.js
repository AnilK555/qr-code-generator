import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { toPng } from "html-to-image";

const QRCodeGenerator = () => {
    const [link, setLink] = useState("");
    const [logo, setLogo] = useState("");
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);

    const qrRef = useRef(null);
    const handleChange = async (e) => {
        const value = e.target.value;

        if (!value) return;

        setLoading(true); // Start loading

        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
            setApiData(response.data);
        } catch (error) {
            console.error("API call failed", error);
        } finally {
            setLoading(false); // Stop loading
        }

        const links = {
            Flipkart: "https://www.flipkart.com",
            YouTube: "https://www.youtube.com",
            Amazon: "https://www.amazon.in",
        };

        const logos = {
            Flipkart: "/logos/flipkart-logo-39904.png",
            YouTube: "/logos/youtube-play-button-28298.png",
            Amazon: "/logos/picture-logo-42725.png",
        };

        setLink(links[value]);
        setLogo(logos[value]);
    };

    const downloadQRCode = () => {
        if (qrRef.current === null) return;

        toPng(qrRef.current)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "qr-code.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Download failed", err);
            });
    };

    return (
        <div className="container">
            <h2>QR Code Generator</h2>

            <label htmlFor="siteSelect">Choose a website:</label>
            <select id="siteSelect" onChange={handleChange} defaultValue="">
                <option value="" disabled>
                    -- Select --
                </option>
                <option value="Flipkart">Flipkart</option>
                <option value="YouTube">YouTube</option>
                <option value="Amazon">Amazon</option>
            </select>

            <div className="link-box">
                <label>Selected Link:</label>
                <input type="text" value={link} readOnly />
            </div>
            {loading && <div className="loader-spinner"></div>}
            {(link && !loading) && (
                <div className="logo-box">
                    <div className="qr-container" ref={qrRef}>
                        <QRCode value={link} size={200} bgColor="#ffffff" fgColor="#000000" />
                        {logo && <img src={logo} alt="logo" className="qr-logo" />}
                    </div>
                    <button className="download-btn" onClick={downloadQRCode}>
                        Download QR Code
                    </button>
                </div>
            )}

            {(apiData && !loading) && (
                <div className="api-data">
                    <h4>Fetched API Data:</h4>
                    <pre>{JSON.stringify(apiData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
