# Project Requirements Document: Full-Stack IELTS Mock Test & AI Evaluation Platform

## 1. Project Overview
Build a comprehensive, high-performance, production-grade **IELTS Mock Test Platform** supporting both **Academic** and **General Training** modules. The platform must replicate the official computer-delivered IELTS exam interface with strict timing, authentic test formats, and an automated, rubric-aligned marking system (using AI/LLM evaluation for Writing & Speaking, and deterministic scoring for Listening & Reading).

---

## 2. Core User Roles
1. **Student / Test Taker:** Take full mock tests or individual module practice tests, review detailed band score breakdowns, track historical progress, and receive AI-driven feedback.
2. **Admin / Content Creator:** Create, edit, and publish IELTS mock tests (upload audio, passages, images/charts, and answer keys), manage user accounts, and review platform analytics.
3. **Human Examiner (Optional Hybrid Mode):** Review AI-graded Writing/Speaking submissions and override scores or add manual feedback.

---

## 3. Exam System & Module Specifications
The exam interface must closely mirror the official **Computer-Delivered IELTS** UI (clean split-screen layouts, text highlighting, note-taking, font size/contrast toggles, and persistent countdown timers with auto-submit).

### A. Listening Module (30 Minutes + 2 Minutes Review)
* **Structure:** 4 sections (10 questions each, 40 total) with increasing difficulty.
* **Audio Engine:**
  * Single-play enforcement (audio plays once automatically without pause/rewind controls during timed exam mode).
  * Pre-loaded audio buffering to prevent lag or dropout.
  * Volume slider accessible at all times.
* **Question Types:** Multiple Choice, Matching, Plan/Map/Diagram Labeling, Form/Note/Table/Flow-chart/Summary Completion, Sentence Completion, Short-Answer Questions.

### B. Reading Module (60 Minutes)
* **Structure:** 3 sections (40 questions total) tailored separately for **Academic** (long analytical texts) and **General Training** (everyday/workplace texts + one long text).
* **UI Features:**
  * Split-screen layout: Passage on the left, Questions on the right (independently scrollable).
  * Right-click context menu on passage text for **Highlight** and **Add Note**.
* **Question Types:** True/False/Not Given, Yes/No/Not Given, Matching Headings, Matching Information, Matching Features, Matching Sentence Endings, Sentence/Summary/Note/Table/Flow-chart Completion, Diagram Label Completion, Multiple Choice.

### C. Writing Module (60 Minutes)
* **Structure:**
  * **Task 1 (Recommended 20 mins, min 150 words):**
    * *Academic:* Describe visual information (Line graph, Bar chart, Pie chart, Table, Process diagram, or Map). Must display high-res image alongside the editor.
    * *General Training:* Write a letter (Formal, Semi-formal, or Informal) based on a given scenario.
  * **Task 2 (Recommended 40 mins, min 250 words):** Discursive essay (Opinion, Discussion, Problem/Solution, Advantages/Disadvantages, Two-part question).
* **Editor Features:**
  * Split-screen layout (Prompt/Image on left, Text Editor on right).
  * Real-time **live word counter**.
  * Disabled spell-check, autocorrect, and grammar-check browser attributes (`spellcheck="false"`) to simulate real exam conditions.
  * Auto-save drafts every 10 seconds to prevent data loss.

### D. Speaking Module (11–14 Minutes)
* **Structure:**
  * **Part 1 (4–5 mins):** Introduction and interview on familiar topics.
  * **Part 2 (3–4 mins):** Cue Card topic. Includes a strict **1-minute preparation timer** with a digital scratchpad for notes, followed by a **2-minute speaking recording window**.
  * **Part 3 (4–5 mins):** Two-way abstract discussion related to Part 2.
* **Audio Recording & Examiner Simulation:**
  * Pre-test microphone check and audio level visualizer.
  * Simulated AI Examiner (Text-to-Speech or pre-recorded examiner prompts) asking questions sequentially.
  * Automatic audio capture (WebRTC / MediaRecorder API) saved per question/part and transcribed via Speech-to-Text (e.g., OpenAI Whisper) with filler-word and pause detection.

---

## 4. Professional Marking & Scoring System

### A. Listening & Reading Scoring Engine
* **Deterministic Auto-Grading:** Case-insensitive string matching, handling acceptable variations (e.g., `"colour"` / `"color"`, `"10 am"` / `"10:00 am"`, optional brackets like `"(the) library"`).
* **Official Band Conversion:** Accurate raw-score-to-band conversion tables (0.0 to 9.0 in 0.5 increments), distinguishing between Academic Reading and General Training Reading conversion scales.

### B. Writing AI Grading Engine
* **Rubric Alignment:** Evaluate based on the 4 official IELTS Writing criteria (25% weight each):
  1. **Task Achievement (Task 1) / Task Response (Task 2)**
  2. **Coherence and Cohesion**
  3. **Lexical Resource**
  4. **Grammatical Range and Accuracy**
* **Output Requirements:**
  * Individual band score (0.0–9.0) for each of the 4 criteria + weighted overall Task score (Task 2 carries double the weight of Task 1).
  * Line-by-line grammar, vocabulary, and cohesion error annotations.
  * A rewritten **Band 8.5+ Model Answer** tailored to the user's original ideas.

### C. Speaking AI Grading Engine
* **Audio + Transcript Analysis:** Combine acoustic metrics (speech rate, pauses, hesitation frequency, pronunciation clarity) with LLM transcript evaluation.
* **Rubric Alignment:** Evaluate based on the 4 official IELTS Speaking criteria (25% weight each):
  1. **Fluency and Coherence**
  2. **Lexical Resource**
  3. **Grammatical Range and Accuracy**
  4. **Pronunciation**
* **Output Requirements:**
  * Individual criterion band scores + overall Speaking band score.
  * Full timestamped transcript highlighting mispronunciations, hesitations, and upgraded vocabulary suggestions.

### D. Overall Band Score Calculation
* Compute the arithmetic mean of the 4 module scores (Listening, Reading, Writing, Speaking) rounded to the nearest **whole or half band** following official IELTS rounding rules (e.g., `.25` rounds up to `.5`, `.75` rounds up to the next whole band).

---

## 5. Additional Platform Features
* **Test Modes:**
  * **Full Mock Exam Mode:** Sequential completion of Listening, Reading, and Writing in one sitting + scheduled/immediate Speaking module.
  * **Practice Mode:** Take individual sections/tasks untimed or timed with instant answer explanations.
* **Student Dashboard & Analytics:**
  * Score progression charts over time across all 4 skills.
  * Weakness identification (e.g., "Low accuracy in True/False/Not Given" or "Grammatical Range averaging 5.5").
  * Downloadable PDF Official-Style Test Report Form (TRF).
* **Admin Test Builder CMS:**
  * Rich-text editor for passages, bulk JSON/CSV question importer, audio/image uploader (S3/Cloudflare R2), and rubric prompt tuning.

---

## 6. Recommended Tech Stack & Architecture
* **Frontend:** Next.js (React, TypeScript), Tailwind CSS, Shadcn UI (for clean, accessible exam components).
* **Backend:** Node.js (NestJS or Express) or Python (FastAPI).
* **Database & Storage:** PostgreSQL (relational test data, user scores, question banks), Redis (exam session state & timers), AWS S3 / Cloudflare R2 (Listening audio files, Writing Task 1 charts, Speaking user recordings).
* **AI & Audio Pipeline:**
  * Speech-to-Text: OpenAI Whisper API / Deepgram (with word-level timestamps).
  * Text-to-Speech (Examiner): ElevenLabs / OpenAI TTS.
  * Evaluation LLM: GPT-4o / Claude 3.5 Sonnet with structured JSON schema outputs for rubric scoring.
* **Authentication & Payments:** NextAuth / Clerk (Auth), Stripe (Subscription / Pay-per-mock-test credits).

---

## 7. Deliverables Expected from Development
1. Complete database schema (Users, Tests, Sections, Questions, Attempts, Submissions, Evaluations).
2. Responsive, pixel-accurate Computer-Delivered IELTS exam interface with anti-cheat measures (tab-switch warnings, auto-submit on timeout).
3. REST/GraphQL API endpoints for test delivery, auto-saving progress, audio upload, and AI grading pipelines.
4. Admin dashboard with full CRUD capabilities to create and publish complete Academic and General Training mock tests.
5. Seed data containing at least **1 complete Academic Mock Test** and **1 complete General Training Mock Test** ready for end-to-end testing.