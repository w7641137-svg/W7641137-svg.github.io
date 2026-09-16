[index.html](https://github.com/user-attachments/files/32310892/index.html)

<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <meta name="theme-color" content="#000000">
  <title>Гёте — AR</title>
  <script src="https://cdn.jsdelivr.net/npm/aframe@1.6.0/dist/aframe-master.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
  <style>
    html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}
    a-scene{position:fixed!important;inset:0!important}
  </style>
  <script>
    AFRAME.registerComponent('wolfson-portrait', {
      init: function () {
        const p = this.el.querySelector('#portrait');
        const show = () => {
          p.setAttribute('visible', true);
          p.setAttribute('material', 'opacity', 0);
          p.setAttribute('scale', '0.94 0.94 0.94');
          p.setAttribute('position', '0 0.07 0.08');
          p.setAttribute('animation__fade', 'property: material.opacity; from: 0; to: 1; dur: 800; easing: easeOutQuad');
          p.setAttribute('animation__rise', 'property: position; from: 0 0.07 0.08; to: 0 0.15 0.10; dur: 950; easing: easeOutCubic');
          setTimeout(() => {
            p.setAttribute('animation__breathe', 'property: scale; from: 1 1 1; to: 1.012 1.012 1.012; dur: 3200; dir: alternate; loop: true; easing: easeInOutSine');
            p.setAttribute('animation__float', 'property: position; from: 0 0.15 0.10; to: 0 0.16 0.105; dur: 3500; dir: alternate; loop: true; easing: easeInOutSine');
          }, 1000);
        };
        const hide = () => {
          p.removeAttribute('animation__breathe');
          p.removeAttribute('animation__float');
          p.setAttribute('animation__fadeout', 'property: material.opacity; to: 0; dur: 250; easing: easeInQuad');
          setTimeout(() => p.setAttribute('visible', false), 280);
        };
        this.el.addEventListener('targetFound', show);
        this.el.addEventListener('targetLost', hide);
      }
    });
  </script>
</head>
<body>
  <a-scene
    mindar-image="imageTargetSrc: ./targets.mind; autoStart: true; uiLoading: yes; uiScanning: no; uiError: yes; warmupTolerance: 5; missTolerance: 7;"
    color-space="sRGB"
    renderer="colorManagement: true; physicallyCorrectLights: true; alpha: true; antialias: true"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false">

    <a-assets>
      <img id="portraitAsset" src="./goethe_portrait.png" crossorigin="anonymous">
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

    <a-entity mindar-image-target="targetIndex: 0" wolfson-portrait>
      <a-plane id="portrait"
        src="#portraitAsset"
        visible="false"
        position="0 0.15 0.10"
        width="0.72"
        height="0.90"
        rotation="-6 0 0"
        material="transparent: true; opacity: 0; alphaTest: 0.01; depthWrite: false">
      </a-plane>
    </a-entity>
  </a-scene>
</body>
</html>
