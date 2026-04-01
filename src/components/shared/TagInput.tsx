import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  suggestions = [],
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = suggestions
    .filter((s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 6);

  function add(tag: string) {
    const t = tag.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md"
          >
            {tag}
            <button onClick={() => onChange(tags.filter((t) => t !== tag))}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {filtered.map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
