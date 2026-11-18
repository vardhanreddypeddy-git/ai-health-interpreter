# AI Health Report Interpreter

An educational, multilingual prototype that extracts supported biomarkers from lab-report text or digital PDFs and explains the results in patient-friendly language. Its risk scores are rule-based demonstrations, not validated probabilities or medical diagnoses.

---

## 🌟 Key Features

1. **Intelligent Report Parsing & Biomarker Extraction**:
   - Parses unstructured lab reports from file uploads (`.txt`, `.csv`, `.pdf` extracts, `.json`) or direct text pasting.
   - Extracts observed numbers, units, reference intervals, and patient demographics.
   - Maps values against clinical reference intervals (Normal, Borderline, High, Low, Critical High, Critical Low).

2. **Rule-Based Health Scores (not diagnostic or clinically validated)**:
   - Illustrative cardiovascular, metabolic, kidney, liver, and anemia scores based on hard-coded thresholds.
   - An overall wellness index and urgency label intended for demonstration only; scores are not calibrated disease probabilities.

3. **Multilingual Translation & Accessibility**:
   - Instant translation across **14 languages**:
     - English (US) 🇺🇸
     - Telugu (తెలుగు) 🇮🇳
     - Hindi (हिन्दी) 🇮🇳
     - Tamil (தமிழ்) 🇮🇳
     - Kannada (ಕನ್ನಡ) 🇮🇳
     - Malayalam (മലയാളം) 🇮🇳
     - Marathi (मराठी) 🇮🇳
     - Gujarati (ગુજરાતી) 🇮🇳
     - Bengali (বাংলা) 🇮🇳
     - Spanish (Español) 🇪🇸
     - French (Français) 🇫🇷
     - German (Deutsch) 🇩🇪
     - Mandarin Chinese (中文) 🇨🇳
     - Arabic (العربية) 🇸🇦
   - **Text-to-Speech (TTS) Voice Narration**: Reads findings aloud using Web Speech API in the user's selected language.

4. **Doctor-Ready Questions & Lifestyle Guidance**:
   - Generates personalized, clinically grounded questions for the patient's next appointment.
   - One-click copy to clipboard for phone notes.
   - Target nutrition and exercise guidance tailored to abnormal biomarkers.

5. **Interactive AI Health Assistant**:
   - Interactive Q&A chat assistant for questions like *"What does high LDL mean for me?"* or *"What food should I eat?"*
   - Includes optional Google Gemini API key integration for custom responses. If enabled, report details included in a prompt are sent to Google; do not enter identifiable or sensitive health information unless that use is approved.

6. **5 Built-In Realistic Clinical Test Cases**:
   - Cardiovascular & Lipid Risk Profile
   - Type-2 Diabetes & Metabolic Syndrome
   - Severe Microcytic Anemia & Iron Depletion
   - Renal & Hepatic Stress Profile
   - Annual Preventative Wellness Checkup

---

## 🏗️ System Architecture

```
[ User / Lab Report Text or Digital PDF ]
                       │
                       ▼
┌─────────────────────────────────────────┐
│ React + Vite browser application        │
│ PDF.js text extraction; no scanned OCR  │
└───────────────────┬─────────────────────┘
                    │ Clerk session token
                    ▼
┌─────────────────────────────────────────┐
│ Vercel Function                         │
│ Verifies Clerk token; uses Admin SDK    │
│ Stores each user's reports separately  │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Cloud Firestore                         │
│ Direct browser access denied by rules   │
└─────────────────────────────────────────┘
```

---

## 🚀 How to Run

### Prerequisites
- Node.js 22+ and npm for the web app and Vercel API.

### Quick Start
```bash
# Install web dependencies
npm install

# Copy the example environment file and fill in your Clerk publishable key
# On Windows PowerShell:
Copy-Item .env.example .env.local

# Start the development server
npm run dev
```

In another terminal, build the production bundle:
```bash
npm run build
```

Open `http://localhost:3000`. The `/api/reports` endpoint is provided by Vercel and is not served by Vite's development server. Run the API tests with `npm test`.

### Free-tier deployment with Vercel and Firestore

This deployment uses a Vercel Function for the authenticated API and Cloud Firestore on its Spark plan. Firebase Cloud Functions are not used, so do not deploy the `functions/` directory. Vercel Hobby and Firebase Spark have usage limits; review their current limits and avoid treating the service as unlimited.

1. Create a Firebase project and enable Cloud Firestore. Keep the included Firestore rules, which deny direct browser access.
2. Deploy only the Firestore rules:
   ```bash
   npx firebase-tools login
   npx firebase-tools use --add
   npx firebase-tools deploy --only firestore:rules
   ```
3. Create a dedicated Google Cloud service account for the API, grant it only the **Cloud Datastore User** role, and create a JSON key. Do not use an Owner account. Add the complete JSON key as the server-only `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable in Vercel.
4. In the Vercel project's **Settings → Environment Variables**, set the following for Production:
   - `VITE_CLERK_PUBLISHABLE_KEY`: the Clerk publishable key.
   - `VITE_REPORTS_API_URL`: `/api/reports`.
   - `CLERK_SECRET_KEY`: the matching Clerk secret key.
   - `FIREBASE_SERVICE_ACCOUNT_JSON`: the service-account JSON from step 3.
   - `ALLOWED_ORIGINS`: the exact app origin, such as `https://your-project.vercel.app`, without a trailing slash.
5. Redeploy the Vercel project after adding or changing environment variables. The browser sends Clerk session tokens to `/api/reports`; the Vercel Function verifies the token and uses the service account to access reports under that Clerk user ID. Keep the Clerk secret and service-account JSON server-side only. Never prefix them with `VITE_` or commit them.

Use the development Clerk keys for testing. Clerk production setup requires a custom domain you own; a `vercel.app` hostname alone is not a production Clerk domain. The optional Gemini chat is separate and does not require Firebase Gemini features.

---

## 📂 Project Structure

```
ai-health-interpreter/
├── index.html                  # HTML entry point with Tailwind CDN & typography
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
├── firebase.json              # Firestore rules configuration
├── firestore.rules             # Denies direct browser database access
├── api/                        # Clerk-verifying Vercel API and tests
├── functions/                  # Legacy Firebase Functions implementation; not used on Spark
├── test-reports/               # Realistic sample lab report text files
│   ├── cardio-risk-report.txt
│   ├── diabetes-report.txt
│   └── anemia-report.txt
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Main application state and layout
│   ├── data/
│   │   ├── biomarkers.js       # 30+ Biomarker database, ranges & clinical tips
│   │   ├── sampleReports.js    # Preloaded authentic clinical cases
│   │   └── translations.js     # 14-language localization dictionary
│   ├── utils/
│   │   ├── reportParser.js     # Biomarker matching & regex extractor
│   │   ├── riskEngine.js       # Multi-disease risk calculator & synthesis
│   │   └── speech.js           # Web Speech API audio narration
│   └── components/
│       ├── Header.jsx          # Navbar, language switcher, audio & export
│       ├── FileUpload.jsx      # Drag-and-drop, text paste & sample picker
│       ├── RiskOverview.jsx    # Health index dial & 5 disease risk bars
│       ├── BiomarkerTable.jsx  # Table, filter tabs, visual range meters
│       ├── DoctorQuestions.jsx # Tailored questions to ask physician
│       ├── LifestyleAdvice.jsx # Evidence-based diet & activity tips
│       ├── AIAssistantChat.jsx # Interactive medical Q&A with Gemini support
│       └── MedicalDisclaimer.jsx # Required clinical safety banner
```

---

## ⚖️ Safety & Clinical Disclaimer
This system is an assistive educational tool designed to promote patient health literacy and facilitate doctor-patient communication. It is not an automated medical diagnostic tool and does not provide prescriptions or treatment plans. Patients must always review findings with a licensed healthcare practitioner.

The risk scores are hard-coded heuristics and are not clinically validated. Before using cloud storage with real patient information, complete a privacy, security, retention, and regulatory review for your jurisdiction. The optional Gemini chat sends report context to Google when a user supplies a Gemini API key.
