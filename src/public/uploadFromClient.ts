export interface fileInfo {
  fileName: string;
  fileSize: number;
  fileHash: string;
}

/**
 * Handles the file upload process.
 * Gets the file from the input, sends it to the backend, and logs the file info.
 * @async
 */
export async function handleFile() {
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

/**
 * Sends the selected file to the backend.
 * @param {File} file - The file to be sent to the backend.
 * @returns {Promise<fileInfo[]>} The file info returned from the backend.
 * @throws Will throw an error if the fetch request fails.
 * @async
 */
export async function sendFileToBackend(file: File): Promise<fileInfo[]> {
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
