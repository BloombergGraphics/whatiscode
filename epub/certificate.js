
!(function(){

  var module = {sel: d3.select('#certificate'), oninit: takePhoto}
  addModule(module)

  //create certificate
  //called when certificate is scrolled into view
  function takePhoto(){
    navigator.getUserMedia = (navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);

    window.URL = window.URL || window.webkitURL;

    var width = 221, height = 221
    var offsetX = 291, offsetY = 300

    var video = document.getElementById('monitor');
    var canvas = document.getElementById('photo');
    var certificate = document.getElementById('certificate');
    var output = document.getElementById('output');
    var download = document.getElementById('downloadCert');
    var cameraErrorMessage = document.getElementById('cameraErrorMessage');

    var ctx = canvas.getContext('2d');
    var vidStream
    var portrait
    var x, y, minD

    setTimeout(init, 0)

    function gotStream(stream) {
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream; // Opera.
      }

      vidStream = stream

      video.onerror = function(e) {
        stream.stop();
      };

      video.width = certificate.width;
      video.height = certificate.height;  

      output.width = certificate.width;
      output.height = certificate.height;  

      video.onloadedmetadata = function(e) { 

        portrait = video.videoWidth < video.videoHeight
        console.log('portrait', portrait)

        video.style.height = height + 'px'
        video.style.width = 'auto'

        canvas.width = certificate.width
        canvas.height = certificate.height

        video.style.left = offsetX + 'px'
        video.style.top = offsetY + 'px'

        minD = Math.min(video.videoWidth, video.videoHeight)

        x = (video.videoWidth - minD) / 2
        y = (video.videoHeight - minD) / 2

        //automatically take picture
        window.setTimeout(capture, 400)
      };
    }

    function noStream(e) {
      // JB: Safari and IE don't support webcam, so we could make a nicer back up maybe?
      // cameraErrorMessage.textContent = 'No camera available :('
      d3.select('#certificate').attr('src', 'images/certificatedemo_800_nocamera.png')

    }

    function capture() {
      ctx.drawImage(certificate, 0, 0);

      ctx.drawImage(video, 
        x, y, minD, minD,
        offsetX, offsetY, width, height);

      output.src = canvas.toDataURL();

      vidStream.stop();
      // video.parentElement.removeChild(video);

      download.href = canvas.toDataURL('image/png');
      download.click();

    }

    d3.select('#photo').on('click', init)

    function init(){
      if (!navigator.getUserMedia) return noStream()
      navigator.getUserMedia({video: true}, gotStream, noStream);
    }

  }


})();
