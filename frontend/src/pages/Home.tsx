import { useState, useEffect } from 'react';
import FolderInput from '../components/FolderInput';
import FileList from '../components/FileList';
import { toast } from 'react-toastify';
import { MdErrorOutline } from 'react-icons/md';

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
  const [progress, setProgress] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [cancelCopy, setCancelCopy] = useState(false);
  const [includeSubfolders, setIncludeSubfolders] = useState(true);

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
    const res = await fetch(
      `http://localhost:3000/fs/compare?recursive=${includeSubfolders ? 'true' : 'false'}`,
    );
    const data = await res.json();
    setComparison(data);
    toast.info(`Comparação concluída: ${data.onlyInA.length + data.onlyInB.length} arquivos encontrados`);
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
      body: JSON.stringify(
        { 
          files: selectedFiles, 
          from, 
          to: from === 'A' ? 'B' : 'A',
          includeSubfolders, // Aqui
        }),
    });
    await res.json();
    toast.success('Arquivos copiados!');
  };

  const copyAll = async (fileList: string[], source: 'A' | 'B') => {
    if (!fileList.length) return;
    setShowModal(true);
    setProgress(0);
    setCancelCopy(false);

    for (let i = 0; i < fileList.length; i++) {
      if (cancelCopy) break;

      const file = fileList[i];
      await fetch('http://localhost:3000/fs/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { files: [file],
            from: source,
            to: source === 'A' ? 'B' : 'A',
            includeSubfolders, // Aqui também
          }),
      });
      setProgress(Math.round(((i + 1) / fileList.length) * 100));
    }

    if (!cancelCopy) toast.success('Arquivos copiados com sucesso!');
    setTimeout(() => setShowModal(false), 1500);
  };

  const handleCancel = () => {
    setCancelCopy(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📂 FolderSync</h1>

      {/* Checkbox para incluir subpastas */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="includeSubfolders"
          checked={includeSubfolders}
          onChange={(e) => setIncludeSubfolders(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="includeSubfolders" className="text-sm text-gray-700">
          Incluir subpastas
        </label>
      </div>

      {/* Input para as pastas */}
      <FolderInput label="Onedrive Google Drive etc" value={folderA} onChange={setFolderA} />
      <FolderInput label="HD Externo" value={folderB} onChange={setFolderB} />

      <div className="flex gap-4 mt-4">
        <button onClick={setFolders} className="btn">Definir Pastas</button>
        <button onClick={compare} className="btn">Comparar</button>
        <button onClick={copySelected} className="btn">Copiar Selecionados</button>
      </div>

      {/* Exibição de informações sobre a comparação */}
      {comparison && (
        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-700">
            Comparação concluída:
          </p>
          <div className="text-sm text-gray-500">
            <p>Total de Arquivos: {comparison.onlyInA.length + comparison.onlyInB.length + comparison.inBoth.length}</p>
            <p>Somente na Pasta Virtual: {comparison.onlyInA.length}</p>
            <p>Somente na Pasta HD Externo: {comparison.onlyInB.length}</p>
            <p>Em Ambas as Pastas: {comparison.inBoth.length}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <FileList
                title="Somente na Pasta Virtual"
                files={comparison.onlyInA}
                onToggle={toggleFile}
                from="A"
                setFrom={setFrom}
                onCopyAll={() => copyAll(comparison.onlyInA, 'A')}
              />
            </div>
            <FileList
              title="Somente na Pasta HD Externo"
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
        </div>
      )}

      {/* Modal de Progresso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            {cancelCopy ? (
              <div className="flex flex-col items-center justify-center text-red-600">
                <MdErrorOutline className="text-5xl animate-ping mb-2" />
                <p className="text-xl font-semibold">Cópia Cancelada</p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-gray-700">Copiando arquivos...</p>
                <div className="w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 text-white text-sm leading-6 text-center transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}