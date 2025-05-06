interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FolderInput({ label, value, onChange }: Props) {
  return (
    <div className="mb-2">
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border px-2 py-1 rounded w-full"
        placeholder="Ex: C:/minha-pasta"
      />
    </div>
  );
}
