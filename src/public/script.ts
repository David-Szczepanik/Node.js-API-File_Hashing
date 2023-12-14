async function hashFile(file: File): Promise<void> {
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    const percentageElement = document.getElementById('progress-percentage') as HTMLElement; // New element
    const hashResultContainer = document.getElementById('hashResult') as HTMLElement;

    const fileSize = file.size;
    const CHUNK_SIZE = 1024 * 1024 * 5; // 5 MB Chunks

    let offset = 0;

    async function processChunk(): Promise<void> {
        const chunk = file?.slice(offset, offset + CHUNK_SIZE);
        offset += CHUNK_SIZE;

        const reader = new FileReader();

        reader.onload = async function (event): Promise<void> {
            const chunkData = new Uint8Array(event.target!.result as ArrayBuffer);
            const response = await sendChunk(chunkData);

            const progress = offset / fileSize;

            progressBar.style.width = `${progress * 100}%`;
            percentageElement.innerText = `${Math.floor(progress * 100)}%`;

            if (offset < fileSize) {
                await processChunk();
            } else {
                progressBar.style.width = '100%';
                percentageElement.innerText = '100%';
                hashResultContainer.innerHTML = `File Name: ${file.name}<br>File Size: ${fileSize} bytes<br>File Hash: ${response.hash}`;
                saveBackup(file, response.hash);
            }
        };

        reader.readAsArrayBuffer(chunk ?? new Blob());
    }

    async function sendChunk(chunkData: Uint8Array): Promise<{ hash: string }> {
        const response = await fetch('/hash', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: chunkData,
        });

        return response.json();
    }

    await processChunk();
}

function saveBackup(file: File, hash: string): void {
    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileHash: hash,
        }),
    })
        .then((response: Response) => response.json())
        .then((backupInfo: any) => {
            console.log('Backup information saved to the server:', backupInfo);
        })
        .catch((error: Error) => {
            console.error('Error saving backup information:', error);
        });
}
