'use client';

export default function HomePage() {
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(`Parsing logic will be integrated next.`);
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
          <input type="file" accept=".md" className="retro-file-input" />
        </div>

        <button type="submit" className="parse-button">
          <span className="btn-en">Parse</span>
          <span className="btn-ja">パース</span>
        </button>
      </form>
    </div>
  );
}
