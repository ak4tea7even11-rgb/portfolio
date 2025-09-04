// Zaroori modules import kar rahe hain
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware use kar rahe hain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Nodemailer ke liye transporter banate hain
// Yahan "user" aur "pass" mein apni Gmail aur App Password dalien
const transporter = nodemailer.createTransport({
    service: 'gmail', // Agar aap koi aur service use kar rahe hain to us ka naam likhen
    auth: {
        user: 'aapka.email@gmail.com', // Yahan apni Gmail ID likhein
        pass: 'aapka_app_password'    // Yahan apni App Password likhein
    }
});

// Root URL par simple message
app.get('/', (req, res) => {
    res.send('Server chal raha hai aur email bhej sakta hai!');
});

// '/submit-form' endpoint banaya hai, jahan se frontend data bheje ga
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    // Email options banate hain
    const mailOptions = {
        from: 'aapka.email@gmail.com', // Aapka apna email address
        to: 'receiver.email@example.com', // Yahan woh email address likhein jahan aap message receive karna chahte hain
        subject: `Naya message aaya hai ak4t7 portfolio se`, // Email ka subject
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #00ff00;">Naya message</h2>
                <p><strong>abdullah:</strong> ${name}</p>
                <p><strong>ak4tea7even11@gmail.com:</strong> ${email}</p>
                <p><strong>hi:</strong></p>
                <p>${message}</p>
            </div>
        `
    };

    try {
        // Email bhejne ki koshish kar rahe hain
        await transporter.sendMail(mailOptions);
        console.log('Email kamyabi se bhej diya gaya hai.');
        res.json({ success: true, message: 'Aapka paigham kamyabi se bhej diya gaya hai. Shukriya!' });
    } catch (error) {
        // Agar koi galti ho to console mein print karein
        console.error('Email bhejte waqt galti:', error);
        res.status(500).json({ success: false, message: 'Paigham bhejte waqt kuch galti ho gayi hai.' });
    }
});

// Server ko start kar rahe hain
app.listen(port, () => {
    console.log(`Server http://localhost:${port} par chal raha hai`);
});
