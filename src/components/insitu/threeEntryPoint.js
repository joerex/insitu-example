import SceneManager from './SceneManager';

export default (containerElement, options) => {
  const canvas = createCanvas(document, containerElement);
  const sceneManager = new SceneManager(canvas, options);

  sceneManager.load()
    .then(() => {
      bindEventListeners();
      resizeCanvas();
      render();
      console.log('Load complete', options.name || '');
      options.loadComplete();
    })
    .catch(error => options.error(error));

  function createCanvas(document, containerElement) {
    const canvas = document.createElement('canvas');
    containerElement.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    window.addEventListener('mousemove', event => {
      sceneManager.onMouseMove(event);
    });
  }

  function resizeCanvas() {
    canvas.style.width = options.width || '100%';
    canvas.style.height= options.height || '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    sceneManager.onWindowResize();
  }

  function render() {
    requestAnimationFrame(render);
    sceneManager.update();
  }
}