# Professional Presence Analyzer — Frontend (React SPA)

React (Vite) arayüzü: CV yükleme, opsiyonel GitHub/LinkedIn/portfolio URL'leri, analiz sonucu rapor görüntüleme.

## Gereksinimler

- Node.js 18+
- Backend API çalışır durumda (varsayılan: http://localhost:3001)

## Kurulum

```bash
npm install
```

## Geliştirme

Backend'i ayrı bir terminalde 3001 portunda çalıştırın, sonra:

```bash
npm run dev
```

Tarayıcı: **http://localhost:5173**. Vite `/api` ve `/health` isteklerini backend'e proxy eder.

## Production build

```bash
npm run build
```

Çıktı: `dist/`. Backend URL'i build sırasında ayarlamak için:

```bash
VITE_API_URL=https://api.example.com npm run build
```

Build sonrası önizleme: `npm run preview`.
