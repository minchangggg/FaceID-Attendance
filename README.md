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

## [3. Requirements and Execution Flow (Approach 2 - Edge-Server)]()
### 3.1 Requirements
- Board: ESP32-CAM (AI-Thinker or equivalent).

  <img width="270" alt="image" src="https://github.com/user-attachments/assets/11721ba0-5ed0-4caf-aa5c-fe7d4cb2508d">
  <img width="140" alt="image" src="https://github.com/user-attachments/assets/13878d8e-575d-44d9-9d27-af9a1379ff66">
  <img width="150" alt="image" src="https://github.com/user-attachments/assets/9fb330d6-ecaf-4c63-876b-d1e720a2472b">
  <img width="147" alt="image" src="https://github.com/user-attachments/assets/cb5ab32f-0c67-4d5a-84ff-2e23b28af88f">
  
  <img width="632" height="264" alt="image" src="https://github.com/user-attachments/assets/447ad7ab-b9cb-49cb-ba9a-e12404cb8a8b" />

- Stable 5V supply (≥ 1A recommended). Avoid brownouts during Wi-Fi + camera.

### 3.2. Execution Flow
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

### 3.3. System Architecture & Data Flow 
*(Edge-Server: ESP32-CAM → Server/Laptop)*

**ESP32-CAM** streams frames (MJPEG/RTSP/HTTP) → **FastAPI Server**.

**Detecting Service**: face detection.

**Embedding Service**: generates face embeddings → **`d`** / **`q`** vectors.

**SQLite DB**: stores embeddings and metadata; queried on match.

**Logging module**: logs events to CSV/JSON and exposes HTTP APIs endpoints.

**Web UI (reactapp)** → consumes APIs and displays attendance records

<img width="3953" height="1586" alt="faceID" src="https://github.com/user-attachments/assets/b4ecfdf5-b6a9-43c7-8e7d-e273c98dc0ca" />

-------------------------

## [4. Getting Started]()

Folder Backend Code: **FaceID-Server**  
Folder Frontend Code: **reactapp**  
Folder ESP32-CAM WebServer: **ESP32Cam-CameraWebServer**

### 4.1. Running the FastAPI Server (BE)

The FaceID server is a FastAPI application that handles face detection, recognition, and attendance logging.

**Prerequisites:**

- Python 3.11+
- Packages: `fastapi`, `uvicorn`, `deepface`, `ultralytics`, `opencv-python`, `pillow`, `numpy`, `python-dotenv`, `requests`

**Installation:**

```bash
cd FaceID-Server
pip install fastapi uvicorn python-dotenv pillow numpy ultralytics deepface opencv-python requests
````

**Run:**

```bash
cd FaceID-Server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server: `http://localhost:8000`

**API Endpoints:**

* `POST /add-face/` — Register a new face (name, student_id, image)
* `POST /verify-face/` — Verify a face against registered faces
* `POST /detect-human/` — Detect if there is a human in the image
* `GET /view-logs/` — Get all verification logs (all dates)
* `GET /view-logs/?date=YYYY-MM-DD` — Get logs for a specific date

### 4.2. Running the React App (FE)

The React app provides a web interface for viewing attendance records.

**Prerequisites:**

* Node.js 16+
* Backend running at `http://localhost:8000`

**Installation & Run:**

```bash
cd reactapp
npm install
npm run dev
```

Frontend: `http://localhost:5173`

**Features:**

* View attendance logs (auto-refresh)
* Filter by date
* Search by student name or ID
* Basic statistics
* Dark mode
* Responsive layout

For more details, see `reactapp/README.md`.

### 4.3. ESP32-CAM Camera WebServer (Capture Source)

Folder `ESP32Cam-CameraWebServer` contains the ESP32-CAM firmware, based on the classic `CameraWebServer` example.

* Preview page: `http://<ESP32_CAM_IP>/`
* Snapshot endpoint: `http://<ESP32_CAM_IP>/capture` (JPEG frame)
* The `/capture` URL can be used as the image source for:

  * `POST /add-face/` (enrollment)
  * `POST /verify-face/` (recognition)
    handled by the **FaceID-Server** backend.

```




