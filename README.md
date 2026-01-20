# FAANG or FAKE? - Tech Resume Simulator 🚀

**FAANG or FAKE** is an interactive quiz application that challenges users to identify whether a software engineer's resume belongs to a top-tier tech company (FAANG) or not. Built with **Next.js**, **Supabase**, and **Tailwind CSS**, it features a "Recruiter Simulator" experience with real-world resume data, secure image handling, and competitive game mechanics.

![Project Preview](https://placehold.co/1200x600/0f172a/ffffff?text=FAANG+or+FAKE+Preview) 
## ✨ Key Features

* **Recruiter Simulator Mode**: Analyze real anonymized resumes and make "Hired" or "Rejected" decisions.
* **Interactive Resume Viewer**:
  * **Pan & Zoom**: Custom-built controls to inspect resume details with mouse drag or touch gestures.
  * **Mobile Optimized**: Full touch support with "prevent-scroll" logic for seamless mobile play.
* **Secure Image Proxy**:
  * **Zero-Trust Storage**: Resumes are stored in a **private** Supabase bucket.
  * **Server-Side Signing**: Images are served via a Next.js API proxy (`/api/proxy-image`) that generates temporary signed URLs, preventing direct link sharing or scraping.
* **Live Game State**:
  * **Real-time Stats**: Tracks correct/incorrect streaks and overall accuracy.
  * **Visual Feedback**: High-end "Glassmorphism" UI with "Hired/Rejected" stamps and atmospheric glow effects.
* **Educational Verdicts**: Provides context-aware feedback (e.g., specific advice for spotting 1st vs. 2nd-year talent) based on the final score.

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `tailwind-animate`
* **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Storage)
* **Language**: TypeScript
* **Deployment**: Vercel

