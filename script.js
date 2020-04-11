const video = document.getElementById('video')

console.log(video.width)

const start = Date.now();

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

console.log(faceapi.nets)

function startVideo() {
    console.log('video'+ (Date.now() - start))

    const videoStart = document.getElementById('videoStart');
    videoStart.textContent = 'video '+ (Date.now() - start)

  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )


}

video.addEventListener('playing', () => { console.log('ready'+ (Date.now() - start));
    const ready = document.getElementById('ready');
    ready.textContent = 'ready '+ (Date.now() - start)
})

setTimeout( () => {
//video.addEventListener('playing', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)



    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)

        //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)



        if(resizedDetections.length > 0) {
            for(let i in resizedDetections)  {

                const person = resizedDetections[i];

                const box = person.detection.box;

                const expressions = person.expressions;

                var exp = 'sad';

                for( const expression in expressions ) {
                    if (expressions[expression] > expressions[exp]) {
                        exp = expression;
                    }
                };

                const drawOptions = {
                    label: exp,
                    lineWidth: 2,
                    drawLabelOptions: {fontSize: 20}
                }
                const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
                drawBox.draw(canvas)

            }

        }


    }, 200)

}, 20000)


