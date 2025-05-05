// renderer.js
window.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
  
    window.api.onAction((type, data) => {
      switch (type) {
        case 'new':
          editor.value = '';
          document.title = 'Текстовий редактор';
          break;
        case 'open':
          editor.value = data.content;
          document.title = 'Текстовий редактор — ' + data.filename;
          break;
        case 'saved-as':
          document.title = 'Текстовий редактор — ' + data.filename;
          break;
      }
    });
  });
  