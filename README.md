# TugasWeb-Pertemuan5-WeatherApp

Weather App menggunakan **OpenWeatherMap API** (HTML, CSS, JavaScript ES6+).

## Requirements

| # | Requirement | Implementasi |
|---|---|---|
| 1 | ES6+ (const, arrow functions, template literals) | Seluruh `app.js`, tanpa `var` |
| 2 | async/await + Fetch API | `getWeather()` |
| 3 | Tampilkan kota, suhu, deskripsi, ikon, kelembaban | `displayWeather()` |
| 4 | Error 404 (kota tidak ditemukan) | `res.status === 404` |
| 5 | Error network | `catch` + `TypeError` |
| 6 | Loading state | `showLoading()` / `hideLoading()` di `finally` |
| 7 | Min. 1 array method | `map` dan `filter` pada riwayat pencarian |
| 8 | UI responsif | Mobile-first, `clamp()`, flexbox |

**Bonus:** riwayat pencarian (LocalStorage) dan toggle °C/°F.

## Cara Menjalankan

1. Daftar di [openweathermap.org](https://openweathermap.org) dan ambil API key.
2. Salin `config.example.js` menjadi `config.js`, lalu isi `API_KEY`.
3. Buka `index.html` dengan Live Server.
