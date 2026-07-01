const axios = require('axios');
const crypto = require('crypto'); // Modul bawaan Node.js buat bikin MD5 otomatis

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan, harus POST!' });
  }

  try {
    const { gameCode, targetId, zoneId } = req.body;
    console.log(`[CEK NAMA] Nyari nama buat Game: ${gameCode}, ID: ${targetId}, Zone: ${zoneId}`);

    // 1. Generate formula md5(API ID + API KEY) secara dinamis sesuai dokumentasi
    const apiId = process.env.VIP_ID;    // API ID / Member ID lu di VIP-Reseller
    const apiKey = process.env.VIP_KEY;  // API KEY lu yang panjang itu
    
    if (!apiId || !apiKey) {
        console.error('Variable VIP_ID atau VIP_KEY belum di-set di Vercel, Cuy!');
    }

    const rawSignature = apiId + apiKey;
    const dynamicSign = crypto.createHash('md5').update(rawSignature).digest('hex');

    // 2. Tembak ke VIP-Reseller pake nama parameter yang bener sesuai image_fddc94.png
    const response = await axios.post('https://vip-reseller.co.id/api/game-feature', {
        key: apiKey, 
        sign: dynamicSign,  
        type: 'get-nickname',               
        code: 'mobile-legends', // disesuaikan dari 'game' menjadi 'code'
        target: targetId,
        additional_target: zoneId // disesuaikan dari 'zone' menjadi 'additional_target'
    });

    // 3. Cek apakah response sukses (result: true)
    if (response.data && response.data.result === true) {
        return res.status(200).json({
            success: true,
            nickname: response.data.data
        });
    } else {
        return res.status(400).json({
            success: false,
            nickname: response.data.message || 'ID atau Server salah, Cuy!'
        });
    }

  } catch (error) {
    console.error('Error API:', error.message);
    return res.status(500).json({ 
        success: false, 
        nickname: 'Gagal nge-cek nickname, server supplier bermasalah' 
    });
  }
};