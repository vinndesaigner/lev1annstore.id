const axios = require('axios'); // atau pake fetch bawaan jika lu ga pake axios

module.exports = async (req, res) => {
    // Biar gak error CORS pas diakses frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request dari browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method tidak diizinkan, harus POST!' });
    }

    try {
        const { gameCode, targetId, zoneId } = req.body;
        console.log(`[CEK NAMA] Nyari nama buat Game: ${gameCode}, ID: ${targetId}, Zone: ${zoneId}`);

        // ==========================================
        // 1. TARUH LOGIK BERESIN API VIPAYMENT LU DI SINI
        // ==========================================
        // Contoh kasarnya:
        // const response = await axios.post('URL_VIPAYMENT', { sign: '...', ... });
        // const nickname = response.data.data.username; 
        
        // Sementara kita return sukses dulu buat ngetes jalurnya tembus atau kagak
        return res.status(200).json({ 
            success: true, 
            nickname: "Cees Vincent Sukses Terhubung!" 
        });

    } catch (error) {
        console.error('Error API:', error.message);
        return res.status(500).json({ error: 'Gagal nge-cek nickname', details: error.message });
    }
};