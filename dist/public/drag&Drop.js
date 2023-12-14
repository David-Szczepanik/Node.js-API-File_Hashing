"use strict";
const droparea = document.getElementById("droparea");
const fileInput = document.getElementById("fileInput");
if (droparea && fileInput) {
    droparea.addEventListener("click", () => {
        fileInput.click();
    });
    droparea.addEventListener("dragover", (e) => {
        e.preventDefault();
        droparea.classList.add("hover");
    });
    droparea.addEventListener("dragleave", () => {
        droparea.classList.remove("hover");
    });
    droparea.addEventListener("drop", (e) => {
        var _a;
        e.preventDefault();
        droparea.classList.remove("hover");
        const files = ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) || new DataTransfer().files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            hashFile(file)
                .then(() => {
                console.log('File hashing completed successfully.');
            })
                .catch((error) => {
                console.error('Error during file hashing:', error);
            });
        }
    });
    fileInput.addEventListener("change", (e) => {
        const target = e.target;
        const files = target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
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
