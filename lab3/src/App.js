import React, { useState, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  const handleNew = () => {
    if (window.confirm('Створити новий файл? Незбережені зміни будуть втрачені.')) {
      setText('');
      document.title = 'Текстовий редактор';
    }
  };

  const handleOpenClick = () => fileInputRef.current.click();
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setText(ev.target.result);
      document.title = `Текстовий редактор — ${file.name}`;
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'untitled.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExit = () => {
    if (window.confirm('Закрити редактор?')) window.close();
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '8px', background: '#eee' }}>
        <button onClick={handleNew}>Новий</button>
        <button onClick={handleOpenClick}>Відкрити</button>
        <button onClick={handleSave}>Зберегти</button>
        <button onClick={handleExit}>Вихід</button>
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </nav>
      <textarea
        style={{ flex: 1, width: '100%', padding: '8px', boxSizing: 'border-box' }}
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}

export default App;
