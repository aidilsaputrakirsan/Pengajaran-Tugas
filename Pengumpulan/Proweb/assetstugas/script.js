const ProwebNamespace = {
    webAppUrl: 'https://script.google.com/macros/s/AKfycbwBW434ZBkhi0IWwiHr1atwIb7Xvrl8qNpAOhSyoWHVplQfnotNznHE7ihzRnoLuyVlrQ/exec'
};

const tugas = "Tugas1"; // Tugas diatur berdasarkan halaman sebelumnya

const fileInput = document.getElementById('file');
const fileInfo = document.getElementById('fileInfo');
const fileLabel = document.getElementById('fileLabel');

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.textContent = `Ukuran file: ${fileSize} MB`;
        fileLabel.textContent = file.name;
        fileLabel.classList.add('active');
    } else {
        fileInfo.textContent = "Ukuran file: 0 MB";
        fileLabel.textContent = "Klik untuk memilih file PDF (Maks. 5MB)";
        fileLabel.classList.remove('active');
    }
});

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const nim = document.getElementById('nim').value.trim();
    const email = document.getElementById('email').value.trim();
    const file = fileInput.files[0];
    const status = document.getElementById('status');
    const spinner = document.getElementById('spinner');
    const uploadButton = document.getElementById('uploadButton');

    // Validasi tipe file PDF
    if (!file || file.type !== "application/pdf") {
        showStatus('Hanya file PDF yang diperbolehkan.', 'error');
        return;
    }

    // Validasi ukuran file maksimal 5MB
    if (file.size > 5 * 1024 * 1024) { // Diubah dari 10MB ke 5MB
        showStatus('Ukuran file melebihi 5MB.', 'error'); // Menyesuaikan pesan
        return;
    }

    // Validasi format nama file
    const expectedFilename = `${nim}_${name.replace(/\s+/g, '_')}_Tugas1.pdf`;
    if (file.name !== expectedFilename) {
        showStatus(`Nama file tidak sesuai. Harusnya "${expectedFilename}".`, 'error');
        return;
    }

    uploadButton.disabled = true;
    spinner.style.display = 'block';
    uploadButton.textContent = 'Mengunggah...';

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
                    mimeType: file.type,
                    tugas: tugas
                })
            });

            const result = await response.json();
            if (result.success) {
                showStatus(`File berhasil diunggah! Lihat file: <a href="${result.fileUrl}" target="_blank">View File</a>`, 'success');
                // Reset form
                document.getElementById('uploadForm').reset();
                fileInfo.textContent = "Ukuran file: 0 MB";
                fileLabel.textContent = "Klik untuk memilih file PDF (Maks. 5MB)";
                fileLabel.classList.remove('active');
            } else {
                showStatus(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showStatus('Terjadi kesalahan saat mengunggah file.', 'error');
        } finally {
            uploadButton.disabled = false;
            spinner.style.display = 'none';
            uploadButton.textContent = 'Upload Tugas';
        }
    };

    reader.readAsDataURL(file);
});

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.style.display = 'block';
    status.innerHTML = message;
    status.className = type === 'success' ? 'status-success' : 'status-error';
}
