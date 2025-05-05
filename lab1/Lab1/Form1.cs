// Form1.cs
using System;
using System.IO;
using System.Windows.Forms;

namespace TextEditor
{
    public partial class Form1 : Form
    {
        private string currentFile;

        public Form1()
        {
            InitializeComponent();
        }

        private void NewFile(object sender, EventArgs e)
        {
            if (!ConfirmSave()) return;
            editor.Clear();
            currentFile = null;
            Text = "Текстовий редактор";
        }

        private void OpenFile(object sender, EventArgs e)
        {
            if (!ConfirmSave()) return;
            using (var dlg = new OpenFileDialog { Filter = "Текст файли (*.txt)|*.txt|Всі файли (*.*)|*.*" })
            {
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    currentFile = dlg.FileName;
                    editor.Text = File.ReadAllText(currentFile);
                    Text = $"Текстовий редактор — {Path.GetFileName(currentFile)}";
                    editor.Modified = false;
                }
            }
        }

        private void SaveFile(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(currentFile))
                SaveAsFile(sender, e);
            else
                WriteToFile(currentFile);
        }

        private void SaveAsFile(object sender, EventArgs e)
        {
            using (var dlg = new SaveFileDialog { Filter = "Текст файли (*.txt)|*.txt|Всі файли (*.*)|*.*", DefaultExt = "txt" })
            {
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    currentFile = dlg.FileName;
                    WriteToFile(currentFile);
                    Text = $"Текстовий редактор — {Path.GetFileName(currentFile)}";
                    editor.Modified = false;
                }
            }
        }

        private void ExitFile(object sender, EventArgs e)
        {
            if (ConfirmSave()) Close();
        }

        private void WriteToFile(string path)
        {
            try
            {
                File.WriteAllText(path, editor.Text);
                editor.Modified = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Не вдалося зберегти файл:\n{ex.Message}",
                    "Помилка",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        private bool ConfirmSave()
        {
            if (!editor.Modified) return true;
            var res = MessageBox.Show(
                "Зберегти зміни?",
                "Питання",
                MessageBoxButtons.YesNoCancel,
                MessageBoxIcon.Question
            );
            if (res == DialogResult.Cancel) return false;
            if (res == DialogResult.Yes) SaveFile(null, null);
            return true;
        }
    }
}
