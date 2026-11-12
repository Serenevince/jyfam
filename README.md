# Jesus Youth Thrissur - Family Gathering 2026

Official website for the **33rd Annual Jesus Youth Family Gathering 2026** hosted by Jesus Youth Thrissur Zone at **St. Paul's C.E.H.S.S., Kuriachira, Thrissur**.

## 🌟 Key Features

- **Hero Highlights Carousel**: Cinematic smooth fade-transition carousel showcasing program moments.
- **Live Intercession Counter & Subzone Statistics**:
  - Live offering form tracking Holy Rosaries, Holy Masses, Eucharistic Adoration hours, Chaplets, and Fasting days.
  - Subzone-wise spiritual statistical breakdown across all 16 subzones of the Archdiocese of Trichur.
  - Admin controls with secure passcode protection (`jy2026`) to reset/calibrate data for production.
- **Route & Venue Transit Guide**:
  - Compact schematic vector route network connecting Swaraj Round, Kokkalai, NH 544 Kuttanellur Bypass, and Ollur to the venue.
  - Interactive Leaflet map with venue marker and route paths.
  - Mode-based transit tabs for Car/Bike and Local Bus service with drop-off landmarks.
- **Zone Photo Gallery**: Dedicated archives gallery page with category filtering and lightbox modal view.

## 🚀 Deployment to Vercel

### Option 1: Automatic Deployment via GitHub (Recommended)
1. Push this repository to your GitHub account.
2. Sign in to [Vercel](https://vercel.com).
3. Click **"Add New..."** → **"Project"**.
4. Select your `jy-family-gathering-2026` GitHub repository.
5. Click **"Deploy"** (no build command needed — it is a static site).

### Option 2: Deploy via Vercel CLI
```bash
# In the project directory:
vercel login
vercel --prod
```

## 📁 Project Structure

```
jy-family-gathering-2026/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── logo.png
│   │   ├── route-map.svg
│   │   └── ...
│   └── js/
│       ├── app.js
│       ├── intercession.js
│       └── map.js
├── gallery.html
├── index.html
├── vercel.json
├── .gitignore
└── README.md
```

