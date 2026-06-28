const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Biar server bisa nerima data JSON dari frontend lu nanti
app.use(express.json());

// Ngenalin folder 'public' tempat index.html dan semua gambar logo rank berada
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API dummy buat nampung orderan joki/diamond
app.post('/api/order', (req, res) => {
    const orderData = req.body;
    console.log("Ada orderan masuk, Cuy! Detail:", orderData);
    res.status(200).json({ status: "success", message: "Data diterima backend!" });
});

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`Server Joki lev1nnstore.id udah aktif, Vincent!`);
    console.log(`Buka browser lu dan akses ke http://localhost:${PORT}`);
    console.log(`===================================================`);
});
