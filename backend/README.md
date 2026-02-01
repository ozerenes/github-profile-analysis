# Professional Presence Analyzer — Backend (API)

API servisi: CV + opsiyonel URL'ler alır, profil çıkarımı, iş potansiyeli skoru, rol önerisi ve öğrenme yol haritası üretir.

## Gereksinimler

- Node.js 18+
- **LLM:** Gemini (ücretsiz) veya OpenAI (ücretli). Key'leri `.env` içinde tanımlayın.

## Kurulum

```bash
npm install
cp .env.example .env
# .env içinde LLM_PROVIDER, GEMINI_API_KEY veya OPENAI_API_KEY ayarlayın
```

## Çalıştırma

```bash
npm start
# veya watch: npm run dev
```

Varsayılan port: **3001** (`PORT` ile değiştirilebilir).

## Test

```bash
npm test
# watch: npm run test:watch
```

## API Özeti

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/health` | GET | Health check |
| `/api/ingest` | POST | CV + opsiyonel URL'ler → normalize payload |
| `/api/extract-profile` | POST | Ingest → AI profil çıkarımı |
| `/api/score` | POST | Profile → iş potansiyeli skoru |
| `/api/role-fit` | POST | Profile → uygun/kaçınılacak roller |
| `/api/learning-roadmap` | POST | Profile + roleFit → öğrenme yol haritası |
| `/api/report` | POST | Profile + score/roleFit/roadmap → rapor |
| `/api/analyze` | POST | Tam pipeline: ingest → extract → score → role fit → roadmap → report |

Detay için `docs/` klasörüne bakın.
