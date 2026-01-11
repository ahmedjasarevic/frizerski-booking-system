import express from 'express';
import client from '../config/twilioClient.js';

const router = express.Router();

// 1️⃣ Pošalji verifikacijski kod SMS-om
router.post('/send-code', async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });

    res.json({ success: true, sid: verification.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ Provjera unesenog koda
router.post('/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  console.log("--- PROVJERA KODA ---");
  console.log("Servis SID:", process.env.TWILIO_VERIFY_SERVICE_SID);
  console.log("Telefon iz body-a:", `"${phone}"`); // Navodnici će ti pokazati ako ima razmak
  console.log("Kod iz body-a:", `"${code}"`);
  try {
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === "approved") {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: "Neispravan kod" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
