const axios = require('axios');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method salah!' });

  try {
    const { targetId, zoneId } = req.body;
    const apiId = process.env.VIP_ID;
    const apiKey = process.env.VIP_KEY;

    // Generate Signature
    const dynamicSign = crypto.createHash('md5').update(apiId + apiKey).digest('hex');

    // Paket Data
    const payload = {
        key: apiKey,
        sign: dynamicSign,
        type: 'get-nickname',
        code: 'mobile-legends',
        target: 'userId',
        additional_target: zoneId
    };

    // CCTV: Print payload ke log Vercel
    console.log('--- DATA YANG DIKIRIM KE VIP-RESELLER ---');
    console.log(JSON.stringify(payload, null, 2));

    const response = await axios.post('https://vip-reseller.co.id/api/game-feature', payload);

    console.log('Respons Server:', response.data);

    if (response.data && response.data.result === true) {
        return res.status(200).json({ success: true, nickname: response.data.data });
    } else {
        return res.status(400).json({ success: false, nickname: response.data.message || 'Gagal' });
    }

  } catch (error) {
    console.error('Error Detail:', error.response ? error.response.data : error.message);
    return res.status(500).json({ success: false, nickname: 'Cek error di Vercel Log' });
  }
};