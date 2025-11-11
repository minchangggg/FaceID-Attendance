# [Face ID Attendance]()
An IoT-based, contact-free attendance system using face recognition.

<img width="1919" height="487" alt="image" src="https://github.com/user-attachments/assets/81c4da88-6e1d-4153-80a3-a12b5527b093" />

## [1. What it does]()
**FaceID Attendance** is a contactless attendance system built around low-cost edge devices and a central FaceID server.

- Real-time face detection & recognition
- Touchless **Check-In / Check-Out** with timestamps
- Logging to **CSV/JSON** locally or via **HTTP POST** to a backend

-------------------------

## [2. Approaches]()

### 2.1. `Approach 1: On-device (ESP32-CAM + ESP-WHO)`
> Ref: https://www.14core.com/esp32-s-cam-in-face-detection-and-recognition-with-esp-who-library/?utm_source=chatgpt.com

- Detection & recognition run entirely on the ESP32-CAM using ESP-WHO.
  > ESP-WHO supports development of face detection and recognition applications based around Espressif Systems' ESP32 chip in the most convenient way. With ESP-WHO, you can easily build up face detection- and recognition-featured applications.

- Lowest cost; No external server is required after enrollment.
- Best for small classrooms/kiosks with 1–2 faces in frame.

- Requirements
  + Board: ESP32-CAM (AI-Thinker or equivalent).
  + Toolchain: **ESP-IDF 4.4.7** with idf.py.
    > https://dl.espressif.com/dl/esp-idf/?idf=4.4
  + Framework: **ESP-WHO v1.0.0**.
    > https://github.com/espressif/esp-who.git -b v1.0.0
  + Stable 5V supply (≥ 1A recommended). Avoid brownouts during Wi-Fi + camera.

### 2.2. `Approach 2: Edge-Server (ESP32-CAM → Server/Laptop)` => Main Approach for this Repository
Folder Backend Code: **FaceID-Server**

Folder Frontend Code: **reactapp**

- ESP32-CAM streams or sends images to a local server.
- Server handles:
  - Face detection (e.g. YOLOv8)
  - Face embeddings
  - Matching against stored embeddings
  - Attendance logging (SQLite + CSV)
- Scales to multiple cameras and higher user counts.

### 2.3. `Approach 3: Standalone Edge (Raspberry Pi 5 + Pi Camera v2)`
- All processing on Raspberry Pi (detect, embed, match, log).
- No external server required.
- Balanced in cost, performance, and maintainability.

### 2.4. Comparison of Approaches

| Dimension                | On-device (ESP32-CAM + ESP-WHO)              | Edge-Server (ESP32-CAM → Server/Laptop)                 | Standalone Edge (Raspberry Pi 5 + Pi Camera v2)         |
|---|---|---|---|
| **Hardware cost**        | **Lowest**                                   | Low–Medium (ESP32 + existing PC/laptop/server)          | Medium (Pi 5 + camera)                                  |
| **Accuracy / Models**    | Basic (lightweight ESP-WHO)                  | **High** (RetinaFace/YOLO + ArcFace/FaceNet on CPU/GPU) | High (OpenCV/ONNX/NCNN on Pi)                           |
| **Throughput (FPS\*)**   | ~3–8 FPS (QVGA/VGA, 1–2 faces)               | **10–30+ FPS** (depends on model/GPU)                   | ~8–20 FPS (depends on optimizations)                    |
| **Latency**              | Low–Medium (on-device)                       | Medium (network + server processing)                    | Low–Medium (on-device)                                  |
| **Scalability**          | Limited (1 camera per node)                  | **High** (multi-camera, central compute)                | Medium (per-node scale; add more Pis)                   |
| **Network dependency**   | None after enrollment                        | Required (streaming to server)                          | Optional (local logging; optional POST)                 |
| **Offline operation**    | **Yes**                                      | No (server required)                                    | **Yes**                                                 |
| **Setup complexity**     | Low (flash firmware, basic config)           | Medium (camera stream + server stack/models)            | Medium (OS + camera + libs)                             |
| **Maintenance**          | Firmware updates per device                  | Centralized model/app updates                           | Per-node app updates                                    |
| **Power**                | **Very low**                                 | Low (ESP) + higher on server                            | Moderate (Pi 5)                                         |
| **Best for**             | Ultra-low-cost kiosks, small rooms           | Campuses with many cameras, higher accuracy needs       | Classrooms/offices without server, balanced performance |
| **Key limitations**      | Lower accuracy, limited faces in frame       | Needs stable LAN; server sizing & security              | Cost/power > ESP; still below desktop-class performance |

\* *FPS values are indicative and depend on resolution, model, and optimizations.*

-------------------------

## [3. Execution Flow for Approach 2: Edge-Server (ESP32-CAM → Server/Laptop)]()

### 3.1. Overview
FaceID operates in two main phases: **Enrollment** and **Recognition & Attendance**.

**Phase 1 - Enrollment**
  1. Capture a face image from ESP32-CAM or another client.
  2. Run `detect → (optional) align → embed` to get embedding vector **d**.
  3. Store `{person_id, name, embedding, metadata}` in the face database (SQLite).

**Phase 2 - Recognition & Attendance**
  1. Capture a frame from ESP32-CAM.
  2. For each detected face: `detect → (optional) align → embed` → query vector **q**.
  3. Match **q** against stored embeddings (e.g. cosine similarity):
     - If `score ≥ threshold` → return `{name, student_id}`.
     - Else → mark as **Unknown`** (optionally log for review).
  4. Log the attendance event (ID, name, timestamp) to SQLite and CSV.

### 3.2. System Architecture & Data Flow 
*(Edge-Server: ESP32-CAM → Server/Laptop)*

- **ESP32-CAM** streams frames (MJPEG/RTSP/HTTP) → **FastAPI Server**.
- **Detecting Service**: face detection.
- **Embedding Service**: generates face embeddings → **`d`** / **`q`** vectors.
- **SQLite DB**: stores embeddings and metadata; queried on match.
- **Logging module**: logs events to CSV/JSON and exposes HTTP APIs endpoints.
- **Web UI (reactapp)** → consumes APIs and displays attendance records

<img width="3953" height="1586" alt="faceID" src="https://github.com/user-attachments/assets/b4ecfdf5-b6a9-43c7-8e7d-e273c98dc0ca" />

-------------------------

## [4. Getting Started]()

### 4.1. Running the FastAPI Server (BE)
The FaceID server is a FastAPI application that handles face detection, recognition, and attendance logging.

**Prerequisites:**
- Python 3.11+
- Required packages: fastapi, uvicorn, deepface, ultralytics, opencv-python, pillow, numpy, python-dotenv

**Installation:**

```bash
cd FaceID-Server
pip install fastapi uvicorn python-dotenv pillow numpy ultralytics deepface opencv-python requests
```

**Running the server:**

```bash
cd FaceID-Server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`

**API Endpoints:**
- `POST /add-face/` - Register a new face with name and student_id
- `POST /verify-face/` - Verify a face against registered faces
- `POST /detect-human/` - Detect if there's a human in the image
- `GET /view-logs/` - View all verification logs (from all dates, sorted by timestamp)
- `GET /view-logs/?date=YYYY-MM-DD` - View verification logs for a specific date

### 4.2. Running the React (FE)
The React app provides a modern interface for viewing attendance records with search and filtering capabilities.

**Prerequisites:**
- Node.js 16+
- FastAPI server running on `http://localhost:8000`

**Installation:**

```bash
cd reactapp
npm install
```

**Running the app:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Features:**
- View all attendance logs in real-time (auto-refresh every 30s)
- Filter by specific date or view all dates
- Search by student name or ID
- Statistics dashboard (total students, check-ins)
- Dark mode support
- Responsive design

For detailed documentation, see [reactapp/README.md](reactapp/README.md)
