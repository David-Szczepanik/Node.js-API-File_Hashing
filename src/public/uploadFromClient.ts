export type fileInfo = {
    fileName: string;
    fileSize: number;
    fileHash: string;
};

async function handleFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
        try {
            const fileInfo = await sendFileToBackend(file);
            console.log('File Size and Hash:', fileInfo);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('No file selected');
    }
}

async function sendFileToBackend(file: File): Promise<fileInfo[]> {
    const formData = new FormData();
    formData.append(file.name, file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        return response.json();
    } catch (error) {
        throw new Error('Error sending file to server: ' + error);
    }
}