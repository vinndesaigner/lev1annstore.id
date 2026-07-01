const axios = require('axios');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method salah!' });

  try {
    const { targetId, zoneId } = req.body;
    
    // Ambil env dan langsung kita hapus spasi tak kasat mata (.trim)
    const apiId = process.env.VIP_ID ? process.env.VIP_ID.trim() : ''; 
    const apiKey = process.env.VIP_KEY ? process.env.VIP_KEY.trim() : '';

    // Gabungkan string rumus asli: API ID + API KEY
    const rawSignature = apiId + apiKey;
    const dynamicSign = crypto.createHash('md5').update(rawSignature).digest('hex');

    // TRACKING LOG (Biar kelihatan di Vercel)
    console.log(`[PELACAK] API_ID asli: ${apiId}`);
    console.log(`[PELACAK] Raw gabungan buat MD5: ${rawSignature}`);
    console.log(`[PELACAK] Hasil MD5 Hex: ${dynamicSign}`);

   // 1. Ubah bungkus data menjadi Form URL Encoded
    const payload = new URLSearchParams();
    payload.append('key', apiKey);
    payload.append('sign', dynamicSign);
    payload.append('type', 'get-nickname');
    payload.append('code', 'mobile-legends');
    payload.append('target', targetId);
    payload.append('additional_target', zoneId);

    // 2. Kirim ke supplier dengan header application/x-www-form-urlencoded
    const response = await axios.post('https://vip-reseller.co.id/api/game-feature', payload, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    console.log('Respons Server Supplier:', response.data);

    if (response.data && response.data.result === true) {
        return res.status(200).json({ success: true, nickname: response.data.data });
    } else {
        return res.status(400).json({ success: false, nickname: response.data.message || 'ID atau Server salah, Cuy!' });
    }

  } catch (error) {
    console.error('Error detail:', error.message);
    return res.status(500).json({ success: false, nickname: 'Server Error' });
  }
};