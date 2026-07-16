'use client';

import { useRef } from 'react';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/markdown',
      },

      body: file,
    });

    const data = await response.json();
    console.log(data);
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
