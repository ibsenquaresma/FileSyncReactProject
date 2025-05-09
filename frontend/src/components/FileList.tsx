import { Copy } from 'lucide-react';

interface Props {
  title: string;
  files: string[];
  onToggle?: (file: string) => void;
  from?: 'A' | 'B';
  setFrom?: (from: 'A' | 'B') => void;
  onCopyAll?: () => void;
}

export default function FileList({ title, files, onToggle, from, setFrom, onCopyAll }: Props) {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">{title}</h2>
        {onCopyAll && (
          <button onClick={onCopyAll} title="Copiar todos">
            <Copy className="w-4 h-4 text-blue-500" />
          </button>
        )}
        {from && setFrom && (
          <button onClick={() => setFrom(from === 'A' ? 'B' : 'A')} className="text-sm text-blue-500">
            Alternar de {from === 'A' ? 'Pasta Virtual' : 'Pasta HD Externo'}
          </button>
        )}
      </div>
      <ul className="space-y-1">
        {files.map(file => (
          <li key={file} className="flex items-center gap-2">
            {onToggle && (
              <input type="checkbox" onChange={() => onToggle(file)} />
            )}
            <span>{file}</span>
          </li>
        ))}
        {files.length === 0 && <p className="text-sm text-gray-400">Nenhum arquivo</p>}
      </ul>
    </div>
  );
}
