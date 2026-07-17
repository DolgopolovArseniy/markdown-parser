'use client';

import { useRef } from 'react';
import { useMd } from './context/MdContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addParsedMd } = useMd();
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const file = fileInputRef.current?.files?.[0];

      if (!file) throw new Error('Attach a file pleaaaaase :(');

      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/markdown',
        },

        body: file,
      });

      if (!response.ok) throw new Error('Something went wrong :(');

      const { data: ast } = await response.json();

      const parsedMd = { fileName: file?.name, ast };
      const newId = crypto.randomUUID();

      addParsedMd(newId, parsedMd);
      router.push(`/${newId}`);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <div className="centered-content">
      <h2
        style={{
          marginBottom: '16px',
          borderBottom: '1px solid #ffffff',
          paddingBottom: '8px',
          width: '100%',
        }}
      >
        [FILE UPLOAD / ファイルアップロード]
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className="retro-file-input-container">
          <span style={{ fontSize: '14px' }}>SELECT .MD FILE TO PARSE</span>
          <input
            type="file"
            accept=".md"
            className="retro-file-input"
            ref={fileInputRef}
          />
        </div>

        <button type="submit" className="parse-button">
          <span className="btn-en">Parse</span>
          <span className="btn-ja">パース</span>
        </button>
      </form>
    </div>
  );
}
