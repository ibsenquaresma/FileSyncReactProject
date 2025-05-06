import { useState } from 'react';
import FolderInput from '../components/FolderInput';
import FileList from '../components/FileList';
import { toast } from 'react-toastify';

interface FileComparison {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
}

export default function Home() {
  const [folderA, setFolderA] = useState('');
  const [folderB, setFolderB] = useState('');
  const [comparison, setComparison] = useState<FileComparison | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [from, setFrom] = useState<'A' | 'B'>('A');

  const setFolders = async () => {
    const res = await fetch('http://localhost:3000/fs/set-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderA, folderB }),
    });
    if (res.ok) toast.success('Pastas definidas!');
    else toast.error('Erro ao definir pastas');
  };

  const compare = async () => {
    const res = await fetch('http://localhost:3000/fs/compare');
    const data = await res.json();
    setComparison(data);
    toast.info('Comparação concluída');
  };

  const toggleFile = (file: string) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
    );
  };

  const copySelected = async () => {
    const res = await fetch('http://localhost:3000/fs/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: selectedFiles, from, to: from === 'A' ? 'B' : 'A' }),
    });
    const result = await res.json();
    toast.success('Arquivos copiados!');
  };

  const copyAll = async (fileList: string[], source: 'A' | 'B') => {
    const res = await fetch('http://localhost:3000/fs/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: selectedFiles, from, to: from === 'A' ? 'B' : 'A' }),
    });
    const result = await res.json();
    toast.success('Arquivos copiados!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📂 FolderSync</h1>

      <FolderInput label="Pasta A" value={folderA} onChange={setFolderA} />
      <FolderInput label="Pasta B" value={folderB} onChange={setFolderB} />

      <div className="flex gap-4 mt-4">
        <button onClick={setFolders} className="btn">Definir Pastas</button>
        <button onClick={compare} className="btn">Comparar</button>
        <button onClick={copySelected} className="btn">Copiar Selecionados</button>
      </div>

      {comparison && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <FileList
            title="Somente na Pasta A"
            files={comparison.onlyInA}
            onToggle={toggleFile}
            from="A"
            setFrom={setFrom}
            onCopyAll={() => copyAll(comparison.onlyInA, 'A')}
          />
          <FileList
            title="Somente na Pasta B"
            files={comparison.onlyInB}
            onToggle={toggleFile}
            from="B"
            setFrom={setFrom}
            onCopyAll={() => copyAll(comparison.onlyInB, 'B')}
          />
          <FileList
            title="Em Ambas"
            files={comparison.inBoth}
            onToggle={toggleFile}
          />
        </div>
      )}
    </div>
  );
}