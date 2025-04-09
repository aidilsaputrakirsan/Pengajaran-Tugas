(function(){
  const ProwebNamespace = {
    webAppUrl: 'https://script.google.com/macros/s/AKfycbyrzheYopmBIIks3g3OOfyI_IeP5gVPqncwth0AIlCce4ajyTgMk1wXJ884k7DqKdvy/exec'
  };

  // Ambil nilai tugas dari atribut data di tag <html>
  const tugas = document.documentElement.getAttribute('data-tugas') || "Tugas1";

  const fileInput = document.getElementById('file');
  const fileInfo = document.getElementById('fileInfo');
  const fileLabel = document.getElementById('fileLabel');
  const uploadButton = document.getElementById('uploadButton');
  const spinner = document.getElementById('spinner');

  // Perbarui teks tombol upload sesuai dengan tugas
  uploadButton.textContent = `Upload ${tugas}`;

  // Event untuk update informasi file ketika user memilih file
  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
      const fileSize = (file.size / (1024 * 1024)).toFixed(2);
      fileInfo.textContent = `Ukuran file: ${fileSize} MB`;
      fileLabel.textContent = file.name;
      fileLabel.classList.add('active');
    } else {
      fileInfo.textContent = "Ukuran file: 0 MB";
      fileLabel.textContent = "Klik untuk memilih file Markdown (Maks. 5MB)";
      fileLabel.classList.remove('active');
    }
  });

  // Event submit form
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const nim = document.getElementById('nim').value.trim();
    const email = document.getElementById('email').value.trim();
    const file = fileInput.files[0];
    const status = document.getElementById('status');

    // Validasi tipe file dan ukuran (maks 5MB)
    if (!file || file.type !== "text/markdown") {
      showStatus('Hanya file Markdown (.md) yang diperbolehkan.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showStatus('Ukuran file melebihi 5MB.', 'error');
      return;
    }

    // Validasi format nama file
    const expectedFilename = `${nim}_${name.replace(/\s+/g, '_')}_${tugas}.md`;
    if (file.name !== expectedFilename) {
      showStatus(`Nama file tidak sesuai. Harusnya "${expectedFilename}".`, 'error');
      return;
    }

    // Update tampilan tombol dan spinner
    uploadButton.disabled = true;
    spinner.style.display = 'block';
    uploadButton.textContent = `Mengunggah ${tugas}...`;

    const reader = new FileReader();
    reader.onload = async function () {
      const base64File = reader.result.split(',')[1];
      try {
        const response = await fetch(ProwebNamespace.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            name: name,
            nim: nim,
            email: email,
            file: base64File,
            filename: file.name,
            mimeType: 'text/markdown',
            tugas: tugas
          })
        });
        const result = await response.json();
        if (result.success) {
          showStatus(`File berhasil diunggah! Lihat file: <a href="${result.fileUrl}" target="_blank">View File</a>`, 'success');
          document.getElementById('uploadForm').reset();
          fileInfo.textContent = "Ukuran file: 0 MB";
          fileLabel.textContent = "Klik untuk memilih file Markdown (Maks. 5MB)";
          fileLabel.classList.remove('active');
        } else {
          showStatus(`Error: ${result.error}`, 'error');
        }
      } catch (error) {
        showStatus('Terjadi kesalahan saat mengunggah file.', 'error');
      } finally {
        uploadButton.disabled = false;
        spinner.style.display = 'none';
        uploadButton.textContent = `Upload ${tugas}`;
      }
    };

    reader.readAsDataURL(file);
  });

  /**
   * Fungsi untuk menampilkan status
   * @param {string} message Pesan yang akan ditampilkan
   * @param {'success'|'error'} type Jenis status untuk styling
   */
  function showStatus(message, type) {
    const status = document.getElementById('status');
    status.style.display = 'block';
    status.innerHTML = message;
    status.className = type === 'success' ? 'status-success' : 'status-error';
  }
})();