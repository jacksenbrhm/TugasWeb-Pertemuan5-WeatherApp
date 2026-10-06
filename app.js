'use strict';

// ===== Konfigurasi =====
const API_KEY = typeof CONFIG !== 'undefined' ? CONFIG.API_KEY : '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const getIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

const HISTORY_KEY = 'weather-history';
const UNIT_KEY = 'weather-unit';
const MAX_HISTORY = 5;

// ===== DOM Elements =====
const $ = (selector) => document.querySelector(selector);

const form = $('#searchForm');
const input = $('#cityInput');
const loading = $('#loading');
const error = $('#error');
const result = $('#weatherResult');
const historyList = $('#historyList');
const unitToggle = $('#unitToggle');

// ===== State =====
const state = {
  data: null,                                   // data cuaca terakhir
  unit: localStorage.getItem(UNIT_KEY) || 'C',  // 'C' atau 'F'
};

// ===== UI helpers =====
const showLoading = () => loading.classList.remove('hidden');
const hideLoading = () => loading.classList.add('hidden');

const showError = (message) => {
  error.textContent = message;
  error.classList.remove('hidden');
  result.classList.add('hidden');
};

const clearError = () => error.classList.add('hidden');

// ===== Suhu (Bonus: toggle °C/°F) =====
const formatTemp = (celsius, unit) => {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°${unit}`;
};

// ===== Riwayat (Bonus: LocalStorage) =====
const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
};

const renderHistory = () => {
  // Array method: map -> ubah array nama kota menjadi elemen <li>
  const items = loadHistory().map((city) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history__chip';
    btn.dataset.city = city;
    btn.textContent = city;
    li.append(btn);
    return li;
  });
  historyList.replaceChildren(...items);
};

const addToHistory = (city) => {
  // Array method: filter -> hapus duplikat (tidak peka huruf besar/kecil)
  const others = loadHistory().filter((c) => c.toLowerCase() !== city.toLowerCase());
  const updated = [city, ...others].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  renderHistory();
};

// ===== Tampilkan data cuaca =====
const displayWeather = (data) => {
  const { name, main, weather, wind } = data;   // destructuring
  const [{ description, icon }] = weather;

  $('#cityName').textContent = name;
  $('#temperature').textContent = formatTemp(main.temp, state.unit);
  $('#description').textContent = description;
  $('#humidity').textContent = `💧 Kelembaban: ${main.humidity}%`;
  $('#wind').textContent = `💨 Angin: ${wind.speed} m/s`;

  const img = $('#weatherIcon');
  img.src = getIconUrl(icon);
  img.alt = description;

  unitToggle.textContent = `Ubah ke °${state.unit === 'C' ? 'F' : 'C'}`;
  result.classList.remove('hidden');
};

// ===== Fetch data cuaca =====
const getWeather = async (city) => {
  clearError();

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    showError('API key belum diisi. Isi API_KEY di file config.js.');
    return;
  }

  try {
    showLoading();
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;
    const res = await fetch(url);

    if (res.status === 404) throw new Error(`Kota "${city}" tidak ditemukan. Periksa penulisannya.`);
    if (res.status === 401) throw new Error('API key tidak valid atau belum aktif (key baru butuh 1-2 jam).');
    if (!res.ok) throw new Error('Server bermasalah. Coba lagi nanti.');

    const data = await res.json();
    state.data = data;
    displayWeather(data);
    addToHistory(data.name);
  } catch (err) {
    // fetch() melempar TypeError jika tidak ada koneksi (network error)
    const message = err instanceof TypeError
      ? 'Gagal terhubung ke internet. Periksa koneksi Anda.'
      : err.message;
    showError(message);
  } finally {
    hideLoading();
  }
};

// ===== Event listeners =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});

historyList.addEventListener('click', (e) => {
  const city = e.target.dataset.city;
  if (city) {
    input.value = city;
    getWeather(city);
  }
});

unitToggle.addEventListener('click', () => {
  state.unit = state.unit === 'C' ? 'F' : 'C';
  localStorage.setItem(UNIT_KEY, state.unit);
  if (state.data) displayWeather(state.data);   // tampilkan ulang tanpa fetch
});

// ===== Init =====
renderHistory();
const [lastCity] = loadHistory();
if (lastCity) getWeather(lastCity);
