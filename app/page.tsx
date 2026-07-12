// app/page.tsx
// Главная страница: загрузка .md файла, отправка на /api/parse, получение AST, рендер.
//
// TODO: implement
//   1. Добавить 'use client'
//   2. Обработчик выбора файла -> POST /api/parse с FormData
//   3. Получение AST из ответа
//   4. Передача AST в <MarkdownRenderer />

export default function HomePage() {
  return (
    <main>
      <h1>Markdown Parser</h1>
      {/* TODO: добавить <input type="file" />, отправку на /api/parse и рендер через <MarkdownRenderer /> */}
      <p>Загрузи .md файл для парсинга.</p>
    </main>
  );
}
