import * as THREE from 'three';

export default class {
  constructor(canvas, options) {
    this.options = options;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    const aspect = (options.width || window.innerWidth) / (options.height || window.innerHeight);
    this.camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
    this.camera.position.z = 4 - options.zoom;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setSize( options.width || window.innerWidth, options.height || window.innerHeight );
  }

  load() {
    return new Promise((resolve, reject) => {
      this.loadAssets()
        .then(() => this.buildScene())
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  async loadAssets() {
    await this.loadModel();
    if (this.options.videoPath) {
      await this.loadVideo();
    }
    return Promise.resolve();
  }

  update() {
    if (this.videoTexture) {
      this.videoTexture.needsUpdate = true;
    }

    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  onMouseMove(event) {
    if (!this.options.rotation) {
      const rotation = this.getRotationFromMouse(event.pageX, event.pageY);
      this.updateRotation(rotation);
    }
  }

  getRotation() {
    if (!this.options.rotation) {
      return {x: 0, y: 0};
    }
    else if (typeof this.options.rotate === 'function') {
      return this.options.rotation();
    }
    else {
      return this.options.rotation;
    }
  }

  getRotationFromMouse(x, y) {
    const horzRotationCenter = 0;
    const pageCenterHorz = (window.innerWidth / 2);
    const horzRotationFactor = (x - pageCenterHorz) * .001;
    const horzRotation = horzRotationCenter + horzRotationFactor;

    const vertRotationCenter = 0;
    const pageCenterVert = (window.innerHeight / 2);
    const vertRotationFactor = (y - pageCenterVert) * .001;
    const vertRotation = vertRotationCenter + vertRotationFactor;

    return {x: vertRotation, y: horzRotation};
  }

  updateRotation(rotation) {
    if (this.deviceMesh) {
      this.deviceMesh.rotation.x = rotation.x;
      this.deviceMesh.rotation.y = rotation.y;
    }
  }

  onWindowResize() {

  }

  loadVideo() {
    return new Promise((resolve, reject) => {
      const video = document.getElementById('video');
      this.videoTexture = new THREE.Texture(video);
      this.videoTexture.minFilter = THREE.LinearFilter;
      this.videoTexture.magFilter = THREE.LinearFilter;
      this.videoTexture.format = THREE.RGBFormat;
      this.videoTexture.generateMipmaps = false;

      video.addEventListener('loadeddata', () => {
        resolve();
      });

      video.addEventListener('error', () => {
        reject('Could not load video');
      }, false);

      video.src = this.options.videoPath;
    })
  }
  
  loadModel() {
    const STLLoader = require('three-stl-loader')(THREE);
    const loader = new STLLoader();
    let stl;

    return new Promise((resolve, reject) => {
      switch (this.options.device) {
        case 'iphone':
          stl = '/models/iphone.stl';
          break;
        default:
          reject('Device not specified');
          return;
      }

      loader.load(stl, geometry => {
        this.deviceGeometry = geometry;
        resolve();
      });
    });
  }
  
  buildScene() {
    const ambientLight = new THREE.AmbientLight( 0xFFFFFF, .5, 0);
    const pointLight = new THREE.PointLight( 0xffffff, 1, 0 );
    pointLight.position.set( 100, 200, 100 );
    this.scene.add(ambientLight);
    this.scene.add(pointLight);

    this.deviceGeometry.rotateX(-(Math.PI / 2));
    this.deviceGeometry.rotateY(Math.PI);
    this.deviceGeometry.center();

    // wireframe geometry and material
    //const geo = new THREE.WireframeGeometry( this.deviceGeometry )
    //const mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
    //mesh = new THREE.LineSegments( geo, mat );

    const geo = this.deviceGeometry;
    const mat = new THREE.MeshPhongMaterial( { color: 0x000000 } );
    this.deviceMesh = new THREE.Mesh( geo, mat );

    this.scene.add(this.deviceMesh);

    const rotation = this.getRotation();
    this.updateRotation(rotation);

    let texture;

    if (this.options.videoPath) {
      texture = this.videoTexture;
    }
    else {
      texture = new THREE.TextureLoader().load(this.options.imagePath);
    }

    const screenGeometry = new THREE.PlaneGeometry(2, 3.8);
    const screenMaterial = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFFF});
    screenMaterial.map.minFilter = THREE.LinearFilter;
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = .16;
    this.deviceMesh.add(screenMesh);

    return Promise.resolve();
  }
}