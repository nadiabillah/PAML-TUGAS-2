const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Gagal mengenkripsi password" });
        }

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Gagal mendaftarkan user" });
            }
            res.status(201).json({ message: "Registrasi berhasil!" });
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi!" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Email tidak ditemukan!" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: "Gagal memverifikasi password" });
            }
            if (!isMatch) {
                return res.status(401).json({ message: "Password salah!" });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({ message: "Login berhasil!", token });
        });
    });
};