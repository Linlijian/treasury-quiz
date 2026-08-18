// app.js

const PASSWORD = "HuarKuy";

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        });

        // Set initial icon
        themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
}

// Decrypt quiz data
async function loadAndDecryptQuizData() {
    try {
        const response = await fetch('quiz_data.enc');
        const encryptedBase64 = await response.text();
        
        // Decrypt using CryptoJS
        const salt = CryptoJS.enc.Utf8.parse('QuizAppSalt2026');
        const key = CryptoJS.PBKDF2(PASSWORD, salt, { keySize: 256/32, iterations: 1000 });
        const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

        const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const jsonStr = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!jsonStr) throw new Error("Decryption failed (Wrong password or corrupted data)");
        
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Error loading quiz data:", e);
        alert("ไม่สามารถโหลดข้อมูลข้อสอบได้");
        return null;
    }
}

// Shuffle Array Helper
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Get Highscore from LocalStorage
function getHighScore(groupId) {
    return localStorage.getItem(`highscore_group_${groupId}`) || 0;
}

// Set Highscore to LocalStorage
function setHighScore(groupId, score) {
    const current = getHighScore(groupId);
    if (score > current) {
        localStorage.setItem(`highscore_group_${groupId}`, score);
    }
}

document.addEventListener('DOMContentLoaded', initTheme);
