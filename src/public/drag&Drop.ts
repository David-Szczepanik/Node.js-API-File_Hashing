const droparea: HTMLElement | null = document.getElementById("droparea");
const fileInput: HTMLInputElement | null = document.getElementById("fileInput") as HTMLInputElement;

if (droparea && fileInput) {
    droparea.addEventListener("click", () => {
        fileInput.click();
    });

    droparea.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        droparea.classList.add("hover");
    });

    droparea.addEventListener("dragleave", () => {
        droparea.classList.remove("hover");
    });

    droparea.addEventListener("drop", (e: DragEvent) => {
        e.preventDefault();
        droparea.classList.remove("hover");

        const files: FileList = e.dataTransfer?.files || new DataTransfer().files;

        for (let i = 0; i < files.length; i++) {
            const file: File = files[i];
            hashFile(file)
                .then(() => {
                    console.log('File hashing completed successfully.');
                })
                .catch((error) => {
                    console.error('Error during file hashing:', error);
                });
        }
    });

    fileInput.addEventListener("change", (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files: FileList | null = target.files;

        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file: File = files[i];
                hashFile(file)
                    .then(() => {
                        console.log('File hashing completed successfully.');
                    })
                    .catch((error) => {
                        console.error('Error during file hashing:', error);
                    });
            }
        }
    });
}