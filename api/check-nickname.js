const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan, harus POST!' });
  }

  try {
    const { gameCode, targetId, zoneId } = req.body;
    console.log(`[CEK NAMA] Nyari nama buat Game: ${gameCode}, ID: ${targetId}, Zone: ${zoneId}`);

    // 1. Tembak langsung ke URL asli VIP-Reseller
    const response = await axios.post('https://vip-reseller.co.id/api/game-feature', {
        key: process.env.VIP_KEY, 
        sign: process.env.VIP_SIGN,  
        type: 'get-nickname',               
        game: 'mobile-legends',
        target: targetId,
        zone: zoneId
    });

    // 2. Cek apakah response sukses (result: true)
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