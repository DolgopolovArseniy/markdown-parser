import React from 'react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ borderBottom: '1px solid #ffffff', paddingBottom: '8px', marginBottom: '16px' }}>
        [ABOUT / お問い合わせ]
      </h2>
      <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
        Welcome to the `.md parser` website. This application parses Markdown documents into abstract syntax trees (AST) and renders them instantly.
      </p>
      <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
        Добро пожаловать на сайт `.md parser`. Это приложение анализирует Markdown-документы, преобразуя их в абстрактные синтаксические деревья (AST), и мгновенно визуализирует результат.
      </p>
      <h3 style={{ borderBottom: '1px dashed #ffffff', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px' }}>
        [DESIGN SPEC / デザイン仕様]
      </h3>
      <ul className="retro-list">
        <li>Theme: 90s Japanese Web Aesthetics</li>
        <li>Background Color: #000000</li>
        <li>Text Color: #ffffff</li>
        <li>Primary Font: MS Gothic (Pixelated)</li>
        <li>Navigation Link Color: #ff00ff (Fuchsia)</li>
      </ul>
    </div>
  );
}
