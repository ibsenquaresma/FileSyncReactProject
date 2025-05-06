
# FolderSync - Backend

This is the backend of the FolderSync application. It is built using **NestJS** and provides the API and logic to compare and copy files between two selected folders.

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js FileSystem (fs)](https://nodejs.org/api/fs.html)
- CORS, Swagger, and built-in NestJS modules

## 📂 Project Structure

```
backend/
├── src/
│   ├── app/
│   │   └── file-system/
│   │       ├── file-system.controller.ts
│   │       ├── file-system.module.ts
│   │       └── file-system.service.ts
│   └── main.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 📦 Installation

```bash
cd backend
npm install
```

## 🚀 Running the Server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000`

## 🔍 API Endpoints

| Method | Endpoint       | Description                       |
|--------|----------------|-----------------------------------|
| POST   | /compare       | Compare two folders               |
| POST   | /copy-file     | Copy a file from one folder to another |
| POST   | /copy-multiple | Copy all files from a list        |

### 🧪 Example Request: Compare Folders

```json
POST /compare
{
  "folderA": "C:/Users/Name/Downloads/FolderA",
  "folderB": "C:/Users/Name/Downloads/FolderB"
}
```

### ✅ Example Response

```json
{
  "onlyInA": ["file1.txt"],
  "onlyInB": ["file2.txt"],
  "inBoth": ["sharedFile.txt"]
}
```

## ⚠️ Notes

- Make sure the paths used in requests are **absolute paths**.
- The backend needs permission to access and read/write to the specified folders.

## 🧼 Linting

```bash
npm run lint
```