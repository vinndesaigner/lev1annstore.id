const express = require('express');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto'); // Modul bawaan Node.js buat bikin MD5 Sign

const app = express();
const PORT = 3000;

// Biar server bisa nerima data JSON dari frontend
app.use(express.json());

// Ngenalin folder 'public' tempat index.html berada
app.use(express.static(path.join(__dirname, 'public')));

// ========================================================
// 🔍 1. ENDPOINT UNTUK CEK NICKNAME GAME OTOMATIS
// ========================================================
app.post('/api/check-nickname', async (req, res) => {
    const { gameCode, targetId, zoneId } = req.body;
    console.log(`[CEK NAMA] Nyari nama buat Game: ${gameCode}, ID: ${targetId}, Zone: ${zoneId}`);

    // Rumus bikin parameter 'sign': md5(API_ID + API_KEY)
    const rawSign = 'xm0bRZvb' + 'SthlX5nLo7AuepcGAxEpkmiVDXlDv7tCjSeeUbeyfHcmJgM2samiOTk6IeFDFGv2';
    const generatedSign = crypto.createHash('md5').update(rawSign).digest('hex');

    // Payload disesuaikan sama dokumentasi foto lu (type: get-nickname)
    const payload = {
        key: 'SthlX5nLo7AuepcGAxEpkmiVDXlDv7tCjSeeUbeyfHcmJgM2samiOTk6IeFDFGv2', // API Key masuk langsung disini
        sign: generatedSign,
        type: 'get-nickname',
        code: gameCode,                 // Contoh: 'mobile-legends'
        target: targetId,               // User ID Player
        additional_target: zoneId || '' // Zone ID Player
    };

    try {
        const response = await axios.post('https://vip-reseller.co.id/api/game-feature', new URLSearchParams(payload).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.result === true) {
            return res.status(200).json({
                status: "success",
                nickname: response.data.data // Ngasih balik nama player asli dari server game
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: response.data.message || "ID atau Zone salah / tidak ditemukan."
            });
        }

    } catch (error) {
        console.error("Error pas cek nickname ke VIPayment:", error.message);
        return res.status(500).json({
            status: "error",
            message: "Gagal mengecek nama karena gangguan server internal."
        });
    }
});

// ========================================================
// 🛒 2. ENDPOINT UNTUK ORDERAN OTOMATIS
// ========================================================
app.post('/api/order', async (req, res) => {
    const orderData = req.body;
    console.log("[ORDER BARU] Ada data masuk, Cuy! Detail:", orderData);

    // Rumus bikin parameter 'sign': md5(API_ID + API_KEY)
    const rawSign = 'xm0bRZvb' + 'SthlX5nLo7AuepcGAxEpkmiVDXlDv7tCjSeeUbeyfHcmJgM2samiOTk6IeFDFGv2';
    const generatedSign = crypto.createHash('md5').update(rawSign).digest('hex');

    const payload = {
        key: 'SthlX5nLo7AuepcGAxEpkmiVDXlDv7tCjSeeUbeyfHcmJgM2samiOTk6IeFDFGv2', // API Key masuk langsung disini
        sign: generatedSign,
        type: 'order',
        service: orderData.service,     // Kode layanan produk
        data_no: orderData.targetId,    // User ID tujuan
        data_zone: orderData.zoneId || '' // Zone ID jika ada
    };

    try {
        const response = await axios.post('https://vip-reseller.co.id/api/game-feature', new URLSearchParams(payload).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.result === true) {
            return res.status(200).json({
                status: "success",
                message: "Pesanan berhasil diteruskan ke VIPayment!",
                data: response.data.data
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: response.data.message || "Gagal diproses oleh provider."
            });
        }

    } catch (error) {
        console.error("Error pas nembak API VIPayment:", error.message);
        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan internal pada server backend."
        });
    }
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log(`Server Joki lev1nnstore.id udah aktif, Vincent!`);
    console.log(`Buka browser lu dan akses ke http://localhost:${PORT}`);
    console.log('=========================================');
});