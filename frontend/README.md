# FolderSync - Frontend

A web interface for comparing and syncing files between two local folders.

## ✨ Technologies

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📁 Features

- Select two local folders (Folder A and Folder B)
- Compare files:
  - Files only in Folder A
  - Files only in Folder B
  - Files present in both
- Select files individually or copy all at once
- Clean and responsive UI using Tailwind CSS

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/foldersync.git
cd foldersync/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

## ⚙️ Configuration

Create a `.env` file in the project root and set the backend URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> Update the URL if your backend is running on a different port or domain.

## 📷 Preview

![screenshot](https://via.placeholder.com/800x400?text=FolderSync+UI+Preview)

## ⚠️ Notes

- Browsers restrict full folder access. Real folder reading is handled by the backend using the provided paths.
- For full functionality, the backend NestJS service must be running.

## 🧪 Useful Scripts

```bash
npm run dev       # Run in development mode
npm run build     # Build for production
npm run preview   # Preview the production build locally
```

## 👨‍💻 Author

Developed by Ibsen Quaresma with ♥.