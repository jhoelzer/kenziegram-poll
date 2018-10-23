let now = Date.now();
let interval = 5000;
// let timer;
errorCount = 0;

function fetchImg() {
    const postOpt = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ after: now })
    }

    fetch("/latest", postOpt)
        .then(response => response.json())
        .then(data => {
            console.log(data.images);
            for (let i in data.images) {
                let img = document.createElement("img");
                let pic = data.images[i];
                img.src = pic;
                defaultStatus.appendChild(img);
            }
        })
        .catch(err => {
        errorCount++;
        if (errCount >= 2) {
            console.log("Server Connection Lost")
            // clearTimeout(timer)
        }
    })
}

setInterval(fetchImg, interval);