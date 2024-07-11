document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('captureButton');
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const downloadButton = document.getElementById('downloadButton');

    let mediaRecorder;
    let chunks = [];

    async function startVideoStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error('Error accessing webcam:', err);
        }
    }

    function stopVideoStream() {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }

    function captureImage() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg');
        console.log('Captured Image:', imageDataURL);
    }

    function startRecording() {
        chunks = [];
        mediaRecorder = new MediaRecorder(video.srcObject);
        mediaRecorder.ondataavailable = function(event) {
            chunks.push(event.data);
        };
        mediaRecorder.onstop = function() {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            downloadButton.href = url;
            downloadButton.download = 'recorded-video.webm';
        };
        mediaRecorder.start();
    }

    function stopRecording() {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    // Event listeners
    window.addEventListener('load', () => {
        startVideoStream();
    });

    captureButton.addEventListener('click', () => {
        captureImage();
    });

    recordButton.addEventListener('click', () => {
        startRecording();
        recordButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
    });

    stopButton.addEventListener('click', () => {
        stopRecording();
        stopButton.style.display = 'none';
        recordButton.style.display = 'inline-block';
    });
});
