import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js/+esm';
import { Reflector } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/objects/Reflector.js/+esm';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/EffectComposer.js/+esm';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/RenderPass.js/+esm';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/UnrealBloomPass.js/+esm';
import { OutputPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/OutputPass.js/+esm';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/ShaderPass.js/+esm';
import { ORDER, COUNTS, INTRO_TIME, LIT, shot, introShot } from './choreo.js';

const { gsap } = window;
const DEG = Math.PI / 180;
const UP = new THREE.Vector3(0, 1, 0);
const lin = (r, g = r, b = r) => new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const HOME = new THREE.Vector3(0, 0, 0);
const HEADLIGHTS = { arc: [0.646, 2.242], umbra: [0.637, 2.525] };
const POOLS = { arc: [2.8, 4.3], umbra: [3.0, 4.6] };
const TUBE = 14;

const GRADE = {
  name: 'OhmenGrade',
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = (c.rgb - 0.5) * 1.06 + 0.5;
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      gl_FragColor = vec4(mix(vec3(l), col, 1.06), c.a);
    }`
};

const FLOOR_SHADER = {
  name: 'OhmenFloor',
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uTexel: { value: new THREE.Vector2(1 / 512, 1 / 512) },
    uStrength: { value: 0.62 },
    uBlur: { value: 1.0 },
    uBase: { value: lin(0.0018, 0.0019, 0.002) },
    uPool: { value: 0.055 },
    uPools: { value: [new THREE.Vector4(0, 0, 1, 0), new THREE.Vector4(), new THREE.Vector4()] },
    uPoolSizes: { value: [new THREE.Vector2(2.9, 4.4), new THREE.Vector2(1, 1), new THREE.Vector2(1, 1)] },
    uBeams: { value: Array.from({ length: 6 }, () => new THREE.Vector4()) },
    uBeamColor: { value: lin(0.11, 0.115, 0.125) },
    uTunnel: { value: new THREE.Vector3(4.6, 0, 1.9) },
    uRadius: { value: new THREE.Vector2(5.0, 15.5) },
    uFadeCentre: { value: new THREE.Vector2(0, 0) },
    uLevel: { value: 1 }
  },
  vertexShader: /* glsl */`
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec3 vWorld;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
      #include <logdepthbuf_vertex>
    }`,
  fragmentShader: /* glsl */`
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform vec2 uTexel;
    uniform float uStrength;
    uniform float uBlur;
    uniform vec3 uBase;
    uniform float uPool;
    uniform vec4 uPools[3];
    uniform vec2 uPoolSizes[3];
    uniform vec4 uBeams[6];
    uniform vec3 uBeamColor;
    uniform vec3 uTunnel;
    uniform vec2 uRadius;
    uniform vec2 uFadeCentre;
    uniform float uLevel;
    varying vec4 vUv;
    varying vec3 vWorld;
    #include <common>
    #include <logdepthbuf_pars_fragment>
    float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    void main() {
      #include <logdepthbuf_fragment>
      vec2 uv = vUv.xy / vUv.w;
      float n = vnoise(vWorld.xz * 1.3) * 0.55 + vnoise(vWorld.xz * 6.0) * 0.3 + vnoise(vWorld.xz * 31.0) * 0.15;
      float lod = uBlur * mix(0.85, 1.15, n);
      vec2 o = uTexel * exp2(lod) * 0.75;
      vec3 refl = textureLod(tDiffuse, uv, lod).rgb * 0.36;
      refl += textureLod(tDiffuse, uv + vec2(o.x, 0.0), lod).rgb * 0.16;
      refl += textureLod(tDiffuse, uv - vec2(o.x, 0.0), lod).rgb * 0.16;
      refl += textureLod(tDiffuse, uv + vec2(0.0, o.y), lod).rgb * 0.16;
      refl += textureLod(tDiffuse, uv - vec2(0.0, o.y), lod).rgb * 0.16;
      float pool = 0.0;
      for (int i = 0; i < 3; i++) {
        vec2 q = (vWorld.xz - uPools[i].xy) / uPoolSizes[i];
        pool += exp(-dot(q, q)) * uPools[i].z;
      }
      if (uTunnel.y > 0.0) {
        float c = 0.5 + 0.5 * cos(6.2831853 * vWorld.x / uTunnel.x);
        pool += uTunnel.y * c * c * exp(-pow(vWorld.z / uTunnel.z, 2.0));
      }
      float beam = 0.0;
      for (int i = 0; i < 6; i++) {
        vec4 B = uBeams[i];
        if (B.z <= 0.0) continue;
        vec2 dir = vec2(sin(B.w), cos(B.w));
        vec2 d = vWorld.xz - B.xy;
        float along = dot(d, dir);
        float side = d.x * dir.y - d.y * dir.x;
        float a = max(along, 0.0);
        float width = 0.12 + 0.2 * a;
        beam += B.z * smoothstep(-0.05, 0.7, along) * exp(-a / 2.3) * exp(-(side * side) / (width * width));
      }
      float rad = length(vWorld.xz - uFadeCentre);
      float fade = 1.0 - smoothstep(uRadius.x, uRadius.y, rad);
      vec3 V = normalize(cameraPosition - vWorld);
      float fres = 0.04 + 0.96 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
      float grain = mix(0.8, 1.15, n);
      vec3 base = (uBase * uLevel + vec3(uPool * pool)) * grain + uBeamColor * beam * grain;
      vec3 col = base + refl * uStrength * mix(0.3, 1.0, fres);
      gl_FragColor = vec4(col * fade, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
};

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function bake(renderer, env) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.0, 0.1, 80);
  pmrem.dispose();
  env.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      if (o.material.map) o.material.map.dispose();
      o.material.dispose();
    }
  });
  return target.texture;
}

function envRoom(y0) {
  const env = new THREE.Scene();
  const solid = (r, g = r, b = r, side = THREE.FrontSide) => new THREE.MeshBasicMaterial({ color: lin(r, g, b), side });
  const room = new THREE.Mesh(new THREE.BoxGeometry(44, 18, 44), solid(0.0016, 0.0016, 0.0018, THREE.BackSide));
  room.position.y = y0 + 8.9;
  env.add(room);
  const floorCanvas = document.createElement('canvas');
  floorCanvas.width = floorCanvas.height = 256;
  const fg = floorCanvas.getContext('2d');
  const grad = fg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, '#303030');
  grad.addColorStop(0.16, '#1c1c1c');
  grad.addColorStop(0.45, '#070707');
  grad.addColorStop(1, '#010101');
  fg.fillStyle = grad;
  fg.fillRect(0, 0, 256, 256);
  const floorTex = new THREE.CanvasTexture(floorCanvas);
  floorTex.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.MeshBasicMaterial({ map: floorTex, color: lin(0.5) }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0 - 0.001;
  env.add(floor);
  return { env, solid };
}

function studioEnvironment(renderer) {
  const y0 = -0.75;
  const { env, solid } = envRoom(y0);
  const tube = (len, along, intensity) => {
    const geo = along === 'x' ? new THREE.BoxGeometry(len, 0.07, 0.07) : new THREE.BoxGeometry(0.07, 0.07, len);
    return new THREE.Mesh(geo, solid(intensity, intensity * 0.99, intensity * 0.97));
  };
  const W = 3.15;
  const L = 6.5;
  const H = 4.15 + y0;
  [-1, 1].forEach(s => {
    const t = tube(L, 'z', 34);
    t.position.set(s * W / 2, H, 0);
    env.add(t);
    const u = tube(W, 'x', 34);
    u.position.set(0, H, s * L / 2);
    env.add(u);
  });
  const soft = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, L * 0.86), solid(0.035));
  soft.rotation.x = Math.PI / 2;
  soft.position.y = H + 0.08;
  env.add(soft);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(16, 3.4), solid(3.0, 3.02, 3.1));
  back.position.set(0, 4.4 + y0, -10.5);
  back.rotation.x = 32 * DEG;
  env.add(back);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(12, 2.6), solid(0.55, 0.57, 0.62));
  front.position.set(0, 3.2 + y0, 11);
  front.rotation.y = Math.PI;
  front.rotation.x = -20 * DEG;
  env.add(front);
  [-1, 1].forEach(s => {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.35), solid(5.0));
    strip.position.set(s * 8.5, 2.0 + y0, 0.6);
    strip.rotation.y = -s * Math.PI / 2;
    env.add(strip);
  });
  return bake(renderer, env);
}

function tunnelEnvironment(renderer) {
  const y0 = -0.75;
  const { env, solid } = envRoom(y0);
  const H = 4.35 + y0;
  for (let k = -4; k <= 4; k++) {
    const x = k * 4.6;
    [-1, 1].forEach(s => {
      const along = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.06), solid(30));
      along.position.set(x, H, s * 1.8);
      env.add(along);
      const across = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 3.6), solid(30));
      across.position.set(x + s * 1.4, H, 0);
      env.add(across);
    });
    const soft = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.2), solid(0.05));
    soft.rotation.x = Math.PI / 2;
    soft.position.set(x, H + 0.08, 0);
    env.add(soft);
  }
  const horizon = new THREE.Mesh(new THREE.BoxGeometry(60, 0.1, 0.1), solid(14));
  horizon.position.set(0, 3.6 + y0, -6.5);
  env.add(horizon);
  const streak = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.5), solid(4.0));
  streak.position.set(0, 1.55 + y0, 11);
  streak.rotation.y = Math.PI;
  env.add(streak);
  return bake(renderer, env);
}

function tubeMaterial() {
  return new THREE.MeshBasicMaterial({ color: lin(TUBE), toneMapped: true, fog: false });
}

function makeFrame(cx, cz, width, length, height, radius = 0.024) {
  const group = new THREE.Group();
  const tubes = [];
  const mat = tubeMaterial();
  [[-1, 'z'], [1, 'z'], [-1, 'x'], [1, 'x']].forEach(([s, along]) => {
    const geo = along === 'z' ? new THREE.CylinderGeometry(radius, radius, length, 10) : new THREE.CylinderGeometry(radius, radius, width, 10);
    const mesh = new THREE.Mesh(geo, mat);
    if (along === 'z') {
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(cx + s * width / 2, height, cz);
    } else {
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(cx, height, cz + s * length / 2);
    }
    group.add(mesh);
    tubes.push(mesh);
  });
  return { group, tubes, mat };
}

function makeRig(width, length) {
  const group = new THREE.Group();
  const tubes = [];
  const r = 0.024;
  const H = 4.15;
  [[-1, 'z'], [1, 'z'], [-1, 'x'], [1, 'x']].forEach(([s, along]) => {
    const geo = along === 'z' ? new THREE.CylinderGeometry(r, r, length, 10) : new THREE.CylinderGeometry(r, r, width, 10);
    const mesh = new THREE.Mesh(geo, tubeMaterial());
    if (along === 'z') {
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(s * width / 2, H, 0);
    } else {
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(0, H, s * length / 2);
    }
    mesh.userData.base = TUBE;
    group.add(mesh);
    tubes.push(mesh);
  });
  return { group, tubes };
}

export class Stage {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.reduced = !!options.reduced;
    this.cars = new Map();
    this.loading = new Map();
    this.current = null;
    this.busy = false;
    this.queue = null;
    this.running = false;
    this.level = { v: 1 };
    this.lightsOn = true;
    this.idle = 0;
    this.mode = 'film';
    this.set = '';
    this.frame = this.frame.bind(this);
    this.clock = new THREE.Clock();
    this.samples = [];
    this.adaptations = 0;
    this.lastRender = 0;
    this.dirty = true;
    this.order = ORDER;
    this.chapters = new Map(ORDER.map((id, index) => [id, { id, index, count: COUNTS[id] }]));
    this.active = 'arrive';
    this.target = 0;
    this.progress = 0;
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.viewport = { w: 1, h: 1 };
    this.fk = 1.3;
    this.fy = 0.47;
    this.intro = null;
    this.filmCars = null;
    const small = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight) < 600;
    this.quality = options.quality || (small ? 'low' : 'high');
    this.init();
  }

  static supported() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  }

  init() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: this.quality !== 'high', powerPreference: 'high-performance', alpha: false, stencil: false });
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);
    this.renderer = renderer;
    this.ratio = Math.min(window.devicePixelRatio || 1, this.quality === 'high' ? 1.75 : 1.5);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 18, 48);
    this.envStudio = studioEnvironment(renderer);
    this.envTunnel = tunnelEnvironment(renderer);
    scene.environment = this.envStudio;
    scene.environmentIntensity = 1;
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 160);
    camera.layers.enable(1);
    camera.position.set(5.2, 2.0, 5.6);
    this.camera = camera;

    const controls = new OrbitControls(camera, this.canvas);
    controls.target.set(0, 0.62, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.7;
    controls.minDistance = 3.4;
    controls.maxDistance = 11.5;
    controls.minPolarAngle = 22 * DEG;
    controls.maxPolarAngle = 87 * DEG;
    controls.autoRotateSpeed = 0.55;
    controls.enabled = false;
    controls.addEventListener('start', () => this.interact());
    controls.addEventListener('end', () => { this.idle = performance.now(); });
    this.controls = controls;

    const hemi = new THREE.HemisphereLight(lin(1), lin(0.03), 0.4);
    scene.add(hemi);
    this.hemi = hemi;

    const reflectRes = this.quality === 'high' ? 0.5 : 0.35;
    this.reflectRes = reflectRes;
    const floor = new Reflector(new THREE.PlaneGeometry(120, 120), {
      textureWidth: 512,
      textureHeight: 512,
      clipBias: 0.002,
      multisample: 0,
      shader: FLOOR_SHADER
    });
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.renderOrder = -1;
    const mirror = floor.getRenderTarget().texture;
    mirror.generateMipmaps = true;
    mirror.minFilter = THREE.LinearMipmapLinearFilter;
    scene.add(floor);
    this.floor = floor;
    this.uniforms = floor.material.uniforms;
    const reflect = floor.onBeforeRender;
    floor.onBeforeRender = (...args) => {
      const mats = this.tubeMaterials;
      const saved = mats.map(m => m.color.r);
      const dim = this.mode === 'garage' ? 0.22 : 0.14;
      mats.forEach(m => m.color.multiplyScalar(dim));
      reflect(...args);
      mats.forEach((m, i) => m.color.setScalar(saved[i]));
    };

    const rig = makeRig(3.1, 6.5);
    scene.add(rig.group);
    this.rig = rig;

    this.buildFilmSet();
    this.tubeMaterials = [...new Set([...rig.tubes.map(t => t.material), ...this.frames.map(f => f.mat), ...this.tunnelMats])];

    this.glow = glowTexture();

    if (this.quality === 'high') this.makeComposer();
    else this.canvas.classList.add('is-raw');

    this.setSet('studio');
    this.loader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.resize();
  }

  makeComposer() {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(this.renderer, target);
    composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.34, 0.42, 2.2);
    composer.addPass(this.bloom);
    composer.addPass(new OutputPass());
    composer.addPass(new ShaderPass(GRADE));
    this.composer = composer;
    this.canvas.classList.remove('is-raw');
  }

  buildFilmSet() {
    const film = new THREE.Group();
    this.frames = [
      makeFrame(0, -1.5, 3.0, 8.68, 4.8, 0.022),
      makeFrame(-3.25, -2.35, 3.3, 9.52, 4.8, 0.022),
      makeFrame(3.25, -2.35, 3.3, 9.52, 4.8, 0.022)
    ];
    this.frames.forEach(f => film.add(f.group));
    this.scene.add(film);
    this.filmSet = film;

    const tunnel = new THREE.Group();
    this.tunnelMats = [];
    for (let k = -4; k <= 4; k++) {
      const f = makeFrame(k * 4.6, 0, 2.8, 3.6, 4.35, 0.022);
      tunnel.add(f.group);
      this.tunnelMats.push(f.mat);
    }
    const horizonMat = tubeMaterial();
    horizonMat.color.setScalar(4);
    const horizon = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 60, 10), horizonMat);
    horizon.rotation.z = Math.PI / 2;
    horizon.position.set(0, 3.6, -6.5);
    tunnel.add(horizon);
    this.tunnelMats.push(horizonMat);
    tunnel.visible = false;
    this.scene.add(tunnel);
    this.tunnel = tunnel;
  }

  setSet(name) {
    if (this.set === name) return;
    this.set = name;
    const garage = name === 'garage';
    this.rig.group.visible = garage;
    this.filmSet.visible = !garage && name !== 'tunnel';
    this.tunnel.visible = name === 'tunnel';
    this.scene.environment = name === 'tunnel' ? this.envTunnel : this.envStudio;
    const u = this.uniforms;
    u.uPool.value = garage ? 0.07 : 0.055;
    if (garage) {
      this.scene.fog.near = 11;
      this.scene.fog.far = 34;
      u.uRadius.value.set(5, 15.5);
      u.uFadeCentre.value.set(0, 0);
      u.uTunnel.value.y = 0;
      u.uBeams.value.forEach(b => b.set(0, 0, 0, 0));
      u.uPools.value[1].z = 0;
      u.uPools.value[2].z = 0;
      u.uPools.value[0].set(0, 0, this.level.v, 0);
    } else if (name === 'tunnel') {
      u.uRadius.value.set(7, 19);
      u.uTunnel.value.set(4.6, 0.35, 1.9);
    } else {
      u.uRadius.value.set(13, 36);
      u.uTunnel.value.y = 0;
    }
    this.dirty = true;
  }

  mount(host, before = null) {
    if (this.canvas.parentNode !== host || this.canvas.nextSibling !== before) host.insertBefore(this.canvas, before);
    this.resize();
  }

  interact() {
    this.controls.autoRotate = false;
    this.idle = performance.now();
    if (this.viewTween) this.viewTween.kill();
    if (this.options.onInteract) this.options.onInteract();
  }

  async fetchBuffer(url, onProgress) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    const total = Number(response.headers.get('content-length')) || 0;
    if (!response.body || !total) {
      const buffer = await response.arrayBuffer();
      if (onProgress) onProgress(1);
      return buffer;
    }
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onProgress) onProgress(Math.min(1, loaded / total));
    }
    const out = new Uint8Array(loaded);
    let at = 0;
    chunks.forEach(chunk => {
      out.set(chunk, at);
      at += chunk.length;
    });
    if (onProgress) onProgress(1);
    return out.buffer;
  }

  ensure(model, onProgress, compile = true) {
    if (this.cars.has(model.id)) {
      if (onProgress) onProgress(1);
      return Promise.resolve(this.cars.get(model.id));
    }
    if (this.loading.has(model.id)) return this.loading.get(model.id);
    const job = (async () => {
      const [buffer, shadow] = await Promise.all([
        this.fetchBuffer(model.file, onProgress),
        this.textureLoader.loadAsync(model.shadow).catch(() => null)
      ]);
      const gltf = await new Promise((resolve, reject) => this.loader.parse(buffer, '', resolve, reject));
      const car = this.prepare(gltf, model, shadow);
      if (compile) {
        car.root.visible = true;
        await this.compile();
        car.root.visible = this.current === car;
      }
      this.cars.set(model.id, car);
      return car;
    })();
    this.loading.set(model.id, job);
    job.catch(() => this.loading.delete(model.id));
    return job;
  }

  async compile() {
    try {
      await this.renderer.compileAsync(this.scene, this.camera);
    } catch (error) {
      this.renderer.compile(this.scene, this.camera);
    }
  }

  prepare(gltf, model, shadowTex) {
    const src = gltf.scene;
    const root = new THREE.Group();
    root.name = `${model.id}-root`;
    const body = new THREE.Group();
    root.add(body);
    body.add(src);
    const car = { id: model.id, model, root, body, wheels: [], drive: { s: 0 }, spin: 0, mats: {}, lights: [], radius: model.wheelRadius };
    const cache = new Map();
    const accent = model.accent || 'gloss';
    const make = m0 => {
      const name = m0.name || '';
      const ao = m0.aoMap || null;
      const std = props => new THREE.MeshStandardMaterial({ aoMap: ao, ...props });
      const phys = props => new THREE.MeshPhysicalMaterial({ aoMap: ao, ...props });
      switch (name) {
        case 'Paint 1': return (car.mats.paint = phys({ color: lin(0.3, 0.002, 0.003), metalness: 0.85, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03 }));
        case 'Paint 2': return (car.mats.accent = accent === 'gloss'
          ? phys({ color: lin(0.008, 0.008, 0.009), metalness: 0, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.03 })
          : std({ color: lin(0.012, 0.012, 0.013), metalness: 0, roughness: 0.5 }));
        case 'Glass': return (car.mats.glass = new THREE.MeshPhysicalMaterial({
          color: lin(0), metalness: 0, roughness: 0.03, transparent: true, opacity: 0.62, depthWrite: false,
          blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, envMapIntensity: 1.6
        }));
        case 'Headlight': {
          const mat = new THREE.MeshStandardMaterial({ color: lin(0.002), emissive: lin(0.86, 0.92, 1), emissiveIntensity: 9, roughness: 0.4, fog: false });
          mat.userData.base = 9;
          mat.userData.kind = 'head';
          car.lights.push(mat);
          return (car.mats.head = mat);
        }
        case 'Brakelight': {
          const mat = new THREE.MeshStandardMaterial({ color: lin(0.004, 0, 0), emissive: lin(1, 0.012, 0.008), emissiveIntensity: 5, roughness: 0.4, fog: false });
          mat.userData.base = 5;
          mat.userData.kind = 'tail';
          car.lights.push(mat);
          return (car.mats.tail = mat);
        }
        case 'Signallight': return std({ color: lin(0.25, 0.09, 0), roughness: 0.12 });
        case 'Rim2': return (car.mats.rimFace = std({ color: lin(0.62, 0.63, 0.64), metalness: 1, roughness: 0.16 }));
        case 'Rim1': return (car.mats.rimInner = std({ color: lin(0.02, 0.02, 0.022), metalness: 0.8, roughness: 0.28 }));
        case 'Brake': return (car.mats.caliper = phys({
          color: lin(0.55, 0.012, 0.02), emissive: lin(0.55 * 0.06, 0.012 * 0.06, 0.02 * 0.06), metalness: 0.3, roughness: 0.32,
          clearcoat: 0.8, clearcoatRoughness: 0.06, aoMapIntensity: 0.2, envMapIntensity: 1.6, side: THREE.DoubleSide
        }));
        case 'Interior 3': return (car.mats.leather = std({ color: lin(0.008, 0.0075, 0.0075), roughness: 0.42 }));
        case 'Interior 2': return (car.mats.insert = std({ color: lin(0.12, 0.005, 0.007), roughness: 0.95 }));
        case 'Interior 1': return std({ color: lin(0.014, 0.014, 0.015), roughness: 0.58 });
        case 'Panel Sides': return phys({ color: lin(0.01, 0.01, 0.011), metalness: 0.25, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.04 });
        case 'Material_2': return std({ color: lin(0.01, 0.01, 0.011), metalness: 0, roughness: 0.55 });
        case 'Floormat': return std({ color: lin(0.01, 0.01, 0.011), roughness: 1 });
        case 'Hardware': return std({ color: lin(0.5, 0.5, 0.52), metalness: 1, roughness: 0.25 });
        case 'Mirror': return std({ color: lin(0.9), metalness: 1, roughness: 0.03 });
        case 'Tiretread':
          m0.color = lin(0.022);
          m0.roughness = 0.72;
          return m0;
        case 'Tireside':
          m0.roughness = 0.68;
          return m0;
        case 'Dashboard':
          m0.emissiveIntensity = 2.2;
          return m0;
        default:
          return m0;
      }
    };
    const unseen = new Set(['Hardware', 'Mechanical', 'Floormat', 'Dashboard', 'License', 'Mirror', 'Signallight', 'Disc', 'Brake', 'Interior 1', 'Interior 2', 'Interior 3']);
    src.traverse(o => {
      if (!o.isMesh) return;
      const m0 = o.material;
      const name = m0.name || '';
      if (!cache.has(m0)) cache.set(m0, make(m0));
      o.material = cache.get(m0);
      o.frustumCulled = true;
      // Parts the blurred floor reflection never shows are kept out of the reflection pass.
      if (unseen.has(name) || /^Interior/.test(o.name)) o.layers.set(1);
    });
    src.updateMatrixWorld(true);
    src.traverse(o => {
      if (!o.isMesh || !/BrakePad$/.test(o.name)) return;
      const side = Math.sign(o.position.x) || 1;
      o.position.x += side * 0.032;
      o.scale.multiplyScalar(1.08);
    });
    const wheels = [];
    src.traverse(o => {
      if (/_wheel\d$/.test(o.name)) wheels.push(o);
    });
    wheels.forEach(w => {
      root.add(w);
      car.wheels.push({ node: w, front: w.position.z > 0 });
    });
    if (shadowTex) {
      shadowTex.colorSpace = THREE.NoColorSpace;
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 6.8),
        new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: shadowTex, transparent: true, opacity: 0.94, depthWrite: false, fog: false })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.004;
      shadow.renderOrder = 1;
      root.add(shadow);
      car.shadow = shadow;
    }
    car.flares = [];
    root.visible = false;
    this.scene.add(root);
    return car;
  }

  cloneCar(car) {
    const root = car.root.clone(true);
    const body = root.children.find(o => o.name === '' && o.isGroup && o.children.length && !/_wheel\d$/.test(o.name)) || root.children[0];
    const names = new Set(car.wheels.map(w => w.node.name));
    const wheels = [];
    root.children.forEach(o => {
      if (names.has(o.name)) wheels.push({ node: o, front: o.position.z > 0 });
    });
    const twin = { ...car, root, body, wheels, drive: { s: 0 }, twin: true };
    root.visible = false;
    this.scene.add(root);
    return twin;
  }

  apply(car, look, animate = true) {
    if (!car || !look) return;
    const d = animate && !this.reduced ? 0.8 : 0;
    const tweenColor = (mat, rgb, key = 'color') => {
      if (!mat || !rgb) return;
      const to = lin(...rgb);
      if (!d) {
        mat[key].copy(to);
        return;
      }
      const from = mat[key].clone();
      const k = { t: 0 };
      gsap.to(k, { t: 1, duration: d, ease: 'power2.inOut', overwrite: false, onUpdate: () => { mat[key].copy(from).lerp(to, k.t); this.dirty = true; } });
    };
    const tweenProps = (mat, props) => {
      if (!mat) return;
      if (!d) Object.assign(mat, props);
      else gsap.to(mat, { ...props, duration: d, ease: 'power2.inOut' });
    };
    if (look.paint) {
      tweenColor(car.mats.paint, look.paint.color);
      tweenProps(car.mats.paint, { metalness: look.paint.metalness, roughness: look.paint.roughness });
    }
    if (look.wheels) {
      tweenColor(car.mats.rimFace, look.wheels.face);
      tweenProps(car.mats.rimFace, { metalness: look.wheels.faceMetal, roughness: look.wheels.faceRough });
      tweenColor(car.mats.rimInner, look.wheels.inner);
      tweenProps(car.mats.rimInner, { metalness: look.wheels.innerMetal, roughness: look.wheels.innerRough });
    }
    if (look.calipers) {
      tweenColor(car.mats.caliper, look.calipers.color);
      tweenColor(car.mats.caliper, look.calipers.color.map(v => v * 0.06), 'emissive');
    }
    if (look.interior) {
      tweenColor(car.mats.leather, look.interior.leather);
      tweenColor(car.mats.insert, look.interior.insert);
    }
    this.dirty = true;
  }

  /* ---------- Film ---------- */

  async loadFilm(models, looks, onProgress) {
    const progress = models.map(() => 0);
    const report = () => onProgress && onProgress(progress.reduce((a, b) => a + b, 0) / progress.length);
    const [arc, umbra] = await Promise.all(models.map((model, i) => this.ensure(model, p => {
      progress[i] = p;
      report();
    }, false)));
    this.filmLooks = looks;
    this.filmCars = { arc, umbraL: umbra, umbraR: this.cloneCar(umbra) };
    this.applyFilmLooks();
    this.applyShot(shot('arrive', 0));
    Object.values(this.filmCars).forEach(car => { car.root.visible = true; });
    this.setSet('tunnel');
    await this.compile();
    this.setSet('studio');
    await this.compile();
    this.applyShot(shot('arrive', 0));
    this.dirty = true;
  }

  applyFilmLooks() {
    if (!this.filmCars || !this.filmLooks) return;
    this.apply(this.filmCars.arc, this.filmLooks.arc, false);
    this.apply(this.filmCars.umbraL, this.filmLooks.umbra, false);
  }

  playIntro() {
    if (!this.filmCars || this.reduced) return Promise.resolve(false);
    return new Promise(resolve => {
      this.intro = { start: 0, resolve };
      this.dirty = true;
    });
  }

  setChapter(id, progress) {
    if (!this.chapters.has(id)) return;
    if (id !== this.active) {
      this.active = id;
      const p = clamp(progress === undefined ? 0 : progress);
      this.target = p;
      this.progress = p;
      this.dirty = true;
    } else if (progress !== undefined) {
      this.setProgress(progress);
    }
  }

  setProgress(p) {
    const next = clamp(p);
    if (Math.abs(next - this.target) > 1e-6) {
      this.direction = next > this.target ? 1 : -1;
      this.target = next;
    }
  }

  info() {
    const chapter = this.chapters.get(this.intro ? 'arrive' : this.active);
    const frame = this.intro ? 0 : Math.round(this.progress * (chapter.count - 1));
    return { id: chapter.id, index: chapter.index, frame, count: chapter.count };
  }

  setPointer(x, y) {
    this.pointer.tx = x;
    this.pointer.ty = y;
  }

  pose(car, p) {
    car.root.visible = !!p.show;
    if (!p.show) return;
    car.root.position.set(p.x, 0, p.z);
    car.root.rotation.set(0, p.yaw || 0, 0);
    car.body.rotation.set(0, 0, 0);
    const spin = (p.spin || 0) / car.radius;
    car.wheels.forEach(w => { w.node.rotation.x = spin; });
  }

  applyShot(s) {
    const cars = this.filmCars;
    if (!cars) return;
    this.setSet(s.set);
    const roles = ['arc', 'umbraL', 'umbraR'];
    roles.forEach(role => this.pose(cars[role], s.cars[role]));
    const L = s.light;
    this.frames.forEach((f, i) => f.mat.color.setScalar(TUBE * L.top[i]));
    let main;
    if (s.set === 'tunnel') main = 1;
    else if (s.hero === 'umbraL') main = L.top[1];
    else if (s.hero === 'arc') main = L.top[0];
    else main = L.top[0] * 0.6 + (L.top[1] + L.top[2]) * 0.2;
    const lit = 0.62 * main + 0.2 * L.side + 0.18 * L.amb;
    const level = s.set === 'tunnel' ? 0.62 : clamp(0.02 + 0.98 * Math.pow(lit, 1.6), 0.02, 1);
    this.scene.environmentIntensity = 0.03 + 0.97 * level;
    this.hemi.intensity = 0.4 * level;
    this.scene.fog.near = s.fog[0];
    this.scene.fog.far = s.fog[1];
    const u = this.uniforms;
    u.uLevel.value = 0.25 + 0.75 * L.amb;
    if (s.set === 'tunnel') u.uFadeCentre.value.set(s.cam.pos[0], 0);
    else u.uFadeCentre.value.set(0, 0);
    roles.forEach((role, i) => {
      const car = cars[role];
      const c = s.cars[role];
      const size = POOLS[car.id] || POOLS.arc;
      u.uPools.value[i].set(c.x, c.z, c.show && s.set !== 'tunnel' ? L.top[i] : 0, 0);
      u.uPoolSizes.value[i].set(size[0], size[1]);
      const lamp = HEADLIGHTS[car.id] || HEADLIGHTS.arc;
      const yaw = c.yaw || 0;
      const sin = Math.sin(yaw);
      const cos = Math.cos(yaw);
      [-1, 1].forEach((side, k) => {
        const lx = side * lamp[0];
        const lz = lamp[1] + 0.25;
        const x = c.x + lx * cos + lz * sin;
        const z = c.z - lx * sin + lz * cos;
        u.uBeams.value[i * 2 + k].set(x, z, c.show ? L.beam * 1.0 : 0, yaw);
      });
    });
    const head = 0.45 + 0.55 * L.led;
    [cars.arc, cars.umbraL].forEach(car => {
      car.lights.forEach(m => {
        m.emissiveIntensity = m.userData.kind === 'tail' ? m.userData.base * L.tail : m.userData.base * head;
      });
    });
    const cam = s.cam;
    const target = this.tmpTarget || (this.tmpTarget = new THREE.Vector3());
    target.set(cam.target[0], cam.target[1], cam.target[2]);
    const off = this.tmpOff || (this.tmpOff = new THREE.Vector3());
    off.set(cam.pos[0] - target.x, cam.pos[1] - target.y, cam.pos[2] - target.z);
    off.applyAxisAngle(UP, -this.pointer.x * 1.1 * DEG);
    const right = this.tmpRight || (this.tmpRight = new THREE.Vector3());
    right.crossVectors(off, UP).normalize();
    off.applyAxisAngle(right, this.pointer.y * 0.7 * DEG);
    this.camera.position.copy(target).add(off);
    this.camera.up.copy(UP);
    this.camera.lookAt(target);
    this.lens = cam.lens;
    this.filmProjection(cam.lens);
  }

  filmProjection(lens) {
    const { w, h } = this.viewport;
    const portrait = w / h <= 1;
    const fw = portrait ? w * this.fk : Math.max(w, (h * 16) / 9) * 1.025;
    const cx = w / 2;
    const cy = portrait ? h * this.fy : h / 2;
    const s = (18 / lens) / (fw / 2);
    const camera = this.camera;
    const near = camera.near;
    camera.projectionMatrix.makePerspective(-cx * s * near, (w - cx) * s * near, cy * s * near, -(h - cy) * s * near, near, camera.far);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }

  updateFilm(now, dt) {
    let changed = this.dirty;
    const p = this.pointer;
    const k = 1 - Math.pow(0.94, dt * 60);
    const px = p.x + (p.tx - p.x) * k;
    const py = p.y + (p.ty - p.y) * k;
    if (Math.abs(px - p.x) > 1e-5 || Math.abs(py - p.y) > 1e-5) changed = true;
    p.x = Math.abs(p.tx - px) < 1e-4 ? p.tx : px;
    p.y = Math.abs(p.ty - py) < 1e-4 ? p.ty : py;
    if (this.intro) {
      if (!this.intro.start) this.intro.start = now;
      const t = (now - this.intro.start) / 1000;
      if (t >= INTRO_TIME) {
        const done = this.intro.resolve;
        this.intro = null;
        this.active = 'arrive';
        this.progress = this.target = 0;
        this.applyShot(shot('arrive', 0));
        done(true);
        return true;
      }
      this.applyShot(introShot(t));
      return true;
    }
    const diff = this.target - this.progress;
    if (Math.abs(diff) > 1e-5) {
      const kp = 1 - Math.pow(0.55, dt * 60);
      this.progress = Math.abs(diff) < 1e-4 ? this.target : this.progress + diff * kp;
      changed = true;
    }
    if (changed && this.filmCars) this.applyShot(shot(this.active, this.progress));
    return changed;
  }

  /* ---------- Garage ---------- */

  enterGarage(host, before) {
    if (this.mode === 'garage') {
      this.mount(host, before);
      return;
    }
    this.home = { parent: this.canvas.parentNode, next: this.canvas.nextSibling };
    this.mode = 'garage';
    this.intro = null;
    this.canvas.classList.add('is-garage');
    this.controls.enabled = true;
    this.setSet('garage');
    this.allCars().forEach(car => { car.root.visible = false; });
    const saved = this.garagePose;
    if (saved) {
      this.camera.position.copy(saved.cam);
      this.controls.target.copy(saved.target);
    } else {
      this.camera.position.set(5.2, 2.0, 5.6);
      this.controls.target.set(0, 0.62, 0);
    }
    this.camera.up.copy(UP);
    this.camera.lookAt(this.controls.target);
    if (this.current) {
      const car = this.current;
      car.root.rotation.set(0, saved ? saved.yaw : 0, 0);
      car.body.rotation.set(0, 0, 0);
      car.drive.s = 0;
      car.root.visible = true;
      this.sizeRig(car.model);
      this.place(car);
    }
    this.setLevel(this.level.v);
    this.rigLevel(this.level.v);
    this.mount(host, before);
    this.controls.update();
  }

  exitGarage() {
    if (this.mode !== 'garage') return;
    if (this.viewTween) this.viewTween.kill();
    this.garagePose = {
      cam: this.camera.position.clone(),
      target: this.controls.target.clone(),
      yaw: this.current ? this.current.root.rotation.y : 0
    };
    this.mode = 'film';
    this.busy = false;
    this.controls.enabled = false;
    this.controls.autoRotate = false;
    this.canvas.classList.remove('is-garage');
    this.inset = 0;
    this.camera.clearViewOffset();
    this.allCars().forEach(car => { car.root.visible = false; });
    this.applyFilmLooks();
    this.set = '';
    if (this.home && this.home.parent) this.mount(this.home.parent, this.home.next && this.home.next.parentNode === this.home.parent ? this.home.next : null);
    if (this.filmCars) this.applyShot(shot(this.active, this.progress));
    this.dirty = true;
  }

  allCars() {
    const list = [...this.cars.values()];
    if (this.filmCars) list.push(this.filmCars.umbraR);
    return list;
  }

  forward(yaw) {
    return new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  }

  place(car) {
    if (this.mode !== 'garage') return;
    const f = this.forward(car.root.rotation.y);
    car.root.position.copy(HOME).addScaledVector(f, car.drive.s);
    const spin = car.drive.s / car.radius;
    car.wheels.forEach(w => { w.node.rotation.x = spin; });
    const dist = car.root.position.length();
    const fade = THREE.MathUtils.clamp(1 - (dist - 12) / 30, 0.12, 1);
    car.lights.forEach(m => { m.emissiveIntensity = m.userData.base * (this.lightsOn || this.busy ? 1 : 0.0) * fade; });
  }

  setLights(on, instant = false) {
    this.lightsOn = on;
    const car = this.current;
    if (!car) return;
    car.lights.forEach(m => {
      const to = on ? m.userData.base : 0;
      if (instant || this.reduced) m.emissiveIntensity = to;
      else {
        const tl = gsap.timeline();
        if (on) [0.4, 0, 0.8, 0.2, 1].forEach((k, i) => tl.set(m, { emissiveIntensity: to * k }, i * 0.05));
        else tl.to(m, { emissiveIntensity: 0, duration: 0.35, ease: 'power2.in' });
      }
    });
  }

  setLevel(v) {
    this.level.v = v;
    if (this.mode !== 'garage') return;
    const u = this.uniforms;
    u.uLevel.value = v;
    u.uPools.value[0].z = v;
    this.scene.environmentIntensity = 0.18 + 0.82 * v;
    this.hemi.intensity = 0.4 * v;
  }

  rigLevel(v, tubes = this.rig.tubes) {
    tubes.forEach(t => t.material.color.setScalar(t.userData.base * v));
  }

  sizeRig(model) {
    const [w, l] = model.rig || [3.1, 6.5];
    const parts = this.rig.tubes;
    parts[0].position.x = -w / 2;
    parts[1].position.x = w / 2;
    parts[2].position.z = -l / 2;
    parts[3].position.z = l / 2;
    parts[0].scale.y = parts[1].scale.y = l / 6.5;
    parts[2].scale.y = parts[3].scale.y = w / 3.1;
    this.uniforms.uPoolSizes.value[0].set(w * 0.94, l * 0.68);
    this.uniforms.uPools.value[0].x = 0;
    this.uniforms.uPools.value[0].y = 0;
  }

  presentYaw() {
    const cam = this.camera.position;
    const t = this.controls.target;
    const towards = Math.atan2(cam.x - t.x, cam.z - t.z);
    return towards - 38 * DEG;
  }

  async show(model, look, onProgress) {
    const car = await this.ensure(model, onProgress);
    if (this.current && this.current !== car) this.current.root.visible = false;
    this.current = car;
    car.drive.s = 0;
    car.root.rotation.set(0, 0, 0);
    car.body.rotation.set(0, 0, 0);
    this.apply(car, look, false);
    this.sizeRig(model);
    car.root.visible = true;
    this.place(car);
    this.setLights(this.lightsOn, true);
    return car;
  }

  async swap(model, look, onProgress) {
    if (this.current && this.current.id === model.id) {
      this.apply(this.current, look);
      return this.current;
    }
    if (this.busy) {
      this.queue = { model, look, onProgress };
      return this.pending;
    }
    this.busy = true;
    this.controls.autoRotate = false;
    const from = this.current;
    let resolveDone;
    this.pending = new Promise(resolve => { resolveDone = resolve; });
    try {
      const to = await this.ensure(model, onProgress);
      this.apply(to, look, false);
      if (!from || this.reduced) {
        await this.show(model, look);
      } else {
        await this.nfs(from, to, model);
      }
    } finally {
      this.busy = false;
      this.idle = performance.now();
      resolveDone(this.current);
    }
    if (this.queue) {
      const next = this.queue;
      this.queue = null;
      return this.swap(next.model, next.look, next.onProgress);
    }
    return this.current;
  }

  arrival(tl, to, model, at, yaw, sound) {
    tl.add(() => {
      this.current = to;
      this.sizeRig(model);
      to.root.rotation.set(0, yaw, 0);
      to.body.rotation.set(0, 0, 0);
      to.drive.s = -34;
      to.root.visible = true;
      to.lights.forEach(m => { m.emissiveIntensity = m.userData.base; });
      this.place(to);
      if (sound && sound.arrive) sound.arrive(2.3);
      if (this.options.onSwap) this.options.onSwap(model);
    }, at)
      .to(to.drive, { s: 0, duration: 2.3, ease: 'power3.out', onUpdate: () => this.place(to) }, at)
      .to(to.body.rotation, { x: 0.018, duration: 0.2, ease: 'power2.out' }, at + 1.85)
      .to(to.body.rotation, { x: 0, duration: 1.1, ease: 'elastic.out(1, 0.42)' }, at + 2.05)
      .add(() => this.flicker(), at + 1.95)
      .to(this.level, { v: 1, duration: 0.7, ease: 'power2.out', onUpdate: () => this.setLevel(this.level.v) }, at + 2.1)
      .to(to.root.rotation, {
        y: () => {
          const now = to.root.rotation.y;
          return now + wrap(this.presentYaw() - now);
        },
        duration: 1.1,
        ease: 'power2.inOut'
      }, at + 2.3)
      .add(() => {
        if (!this.lightsOn) this.setLights(false);
      });
  }

  enter(model, look, onProgress) {
    if (this.reduced) {
      return this.show(model, look, onProgress).then(car => {
        this.setLevel(1);
        this.rigLevel(1);
        return car;
      });
    }
    return this.ensure(model, onProgress).then(to => new Promise(resolve => {
      this.busy = true;
      this.apply(to, look, false);
      this.setLevel(0.05);
      this.rigLevel(0);
      const cam = this.camera.position;
      const target = this.controls.target;
      const away = Math.atan2(target.x - cam.x, target.z - cam.z);
      const tl = gsap.timeline({
        onComplete: () => {
          this.busy = false;
          this.idle = performance.now();
          resolve(to);
        }
      });
      this.arrival(tl, to, model, 0.35, away + 18 * DEG + Math.PI, this.options.sound);
    }));
  }

  nfs(from, to, model) {
    const sound = this.options.sound;
    const cam = this.camera.position;
    const target = this.controls.target;
    const away = Math.atan2(target.x - cam.x, target.z - cam.z);
    const yaw0 = from.root.rotation.y;
    const options = [away + 24 * DEG, away - 24 * DEG];
    const exitRaw = options.reduce((best, y) => (Math.abs(wrap(y - yaw0)) < Math.abs(wrap(best - yaw0)) ? y : best));
    const exitYaw = yaw0 + wrap(exitRaw - yaw0);
    const side = Math.sign(wrap(exitRaw - away)) || 1;
    const arriveYaw = away - side * 16 * DEG + Math.PI;
    const turn = Math.abs(exitYaw - yaw0);
    return new Promise(resolve => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.add(() => {
        from.lights.forEach(m => gsap.to(m, { emissiveIntensity: m.userData.base, duration: 0.2 }));
      }, 0);
      if (turn > 4 * DEG) tl.to(from.root.rotation, { y: exitYaw, duration: Math.min(0.95, 0.3 + turn * 0.4), ease: 'power2.inOut' }, 0);
      const go = tl.duration() > 0 ? tl.duration() - 0.05 : 0;
      tl.add(() => sound && sound.depart && sound.depart(1.7), go)
        .to(from.drive, { s: 36, duration: 1.7, ease: 'power2.in', onUpdate: () => this.place(from) }, go)
        .to(from.body.rotation, { x: -0.016, duration: 0.3, ease: 'power2.out' }, go)
        .to(from.body.rotation, { x: 0, duration: 0.9, ease: 'power2.inOut' }, go + 0.3)
        .to(this.level, { v: 0.14, duration: 1.0, ease: 'power2.in', onUpdate: () => { this.setLevel(this.level.v); this.rigLevel(0.1 + 0.9 * this.level.v); } }, go + 0.3)
        .add(() => {
          from.root.visible = false;
          from.drive.s = 0;
          from.root.rotation.y = 0;
          this.place(from);
        }, go + 1.75);
      this.arrival(tl, to, model, go + 1.05, arriveYaw, sound);
    });
  }

  flicker() {
    const sound = this.options.sound;
    this.rig.tubes.forEach((tube, i) => {
      const tl = gsap.timeline({ delay: i * 0.11 });
      [1, 0.1, 1, 0.3, 1].forEach((k, j) => tl.set(tube.material.color, { r: tube.userData.base * k, g: tube.userData.base * k, b: tube.userData.base * k }, j * 0.045));
      if (sound && sound.clack) sound.clack(i * 0.11, i === 3 ? 0.6 : 0.9);
    });
  }

  powerUp() {
    if (this.reduced) {
      this.setLevel(1);
      this.rigLevel(1);
      return;
    }
    this.setLevel(0);
    this.rigLevel(0);
    this.flicker();
    gsap.to(this.level, { v: 1, duration: 1.2, delay: 0.25, ease: 'power2.out', onUpdate: () => this.setLevel(this.level.v) });
  }

  view(name, instant = false) {
    const car = this.current;
    if (!car && (name === 'wheel' || name === 'cabin')) return;
    const yaw = car ? car.root.rotation.y : 0;
    const views = {
      front: { az: 40, polar: 74, r: 7.9, t: [0, 0.62, 0] },
      side: { az: 90, polar: 83, r: 8.6, t: [0, 0.6, 0] },
      rear: { az: 148, polar: 72, r: 7.9, t: [0, 0.62, 0] },
      top: { az: 30, polar: 30, r: 9.6, t: [0, 0.4, 0] },
      wheel: car ? { az: 78, polar: 84, r: 3.3, t: car.model.wheel } : null,
      cabin: car ? { az: 16, polar: 50, r: 3.5, t: car.model.cabin } : null
    };
    const v = { ...(views[name] || views.front) };
    if (name !== 'wheel' && name !== 'cabin') v.r *= this.fit || 1;
    const local = new THREE.Vector3(...v.t);
    const t = local.applyAxisAngle(UP, yaw);
    if (car) t.add(car.root.position);
    const goal = { az: yaw + v.az * DEG, polar: v.polar * DEG, r: v.r };
    const controls = this.controls;
    const s = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(controls.target));
    const from = { az: s.theta, polar: s.phi, r: s.radius, tx: controls.target.x, ty: controls.target.y, tz: controls.target.z };
    const to = { az: from.az + wrap(goal.az - from.az), polar: goal.polar, r: goal.r, tx: t.x, ty: t.y, tz: t.z };
    controls.minDistance = Math.min(3.4, v.r - 0.4);
    controls.autoRotate = false;
    if (this.viewTween) this.viewTween.kill();
    const apply = () => {
      controls.target.set(from.tx, from.ty, from.tz);
      const off = new THREE.Vector3().setFromSphericalCoords(from.r, from.polar, from.az);
      this.camera.position.copy(controls.target).add(off);
      this.camera.lookAt(controls.target);
    };
    if (instant || this.reduced) {
      Object.assign(from, to);
      apply();
      controls.update();
      return;
    }
    this.viewTween = gsap.to(from, { ...to, duration: 1.6, ease: 'power3.inOut', onUpdate: apply, onComplete: () => { this.idle = performance.now(); } });
  }

  turn() {
    const car = this.current;
    if (!car) return 0;
    const cam = this.camera.position;
    const t = this.controls.target;
    const az = Math.atan2(cam.x - t.x, cam.z - t.z);
    const rel = (az - car.root.rotation.y) / DEG;
    return ((rel % 360) + 360) % 360;
  }

  setInset(px) {
    this.inset = px;
    this.resize();
  }

  /* ---------- Rendering ---------- */

  readFrame() {
    const css = getComputedStyle(document.documentElement);
    const fk = parseFloat(css.getPropertyValue('--fk'));
    const fy = parseFloat(css.getPropertyValue('--fy'));
    this.fk = Number.isFinite(fk) ? fk : 1.3;
    this.fy = Number.isFinite(fy) ? fy : 0.47;
  }

  resize() {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.viewport = { w, h };
    const ratio = this.ratio;
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h, false);
    const camera = this.camera;
    camera.aspect = w / h;
    if (this.mode === 'garage') {
      const inset = this.inset || 0;
      const free = Math.max(0.5, (w - inset) / h);
      const fov = 2 * Math.atan(Math.tan(20.5 * DEG) / free) / DEG;
      camera.fov = THREE.MathUtils.clamp(fov, 25, 58);
      const half = Math.atan(Math.tan(camera.fov * DEG / 2) * free);
      this.fit = Math.max(1, 2.75 / (Math.tan(half) * 7.9));
      if (inset) camera.setViewOffset(w, h, inset / 2, 0, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    } else {
      this.readFrame();
      if (this.lens) this.filmProjection(this.lens);
    }
    const rw = Math.max(256, Math.round(w * ratio * this.reflectRes));
    const rh = Math.max(256, Math.round(h * ratio * this.reflectRes));
    this.floor.getRenderTarget().setSize(rw, rh);
    this.uniforms.uTexel.value.set(1 / rw, 1 / rh);
    this.uniforms.uBlur.value = Math.log2(Math.max(2, rh / 72));
    if (this.composer) {
      this.composer.setPixelRatio(ratio);
      this.composer.setSize(w, h);
      this.bloom.resolution.set(w * ratio * 0.5, h * ratio * 0.5);
    }
    this.dirty = true;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    this.idle = performance.now();
    this.dirty = true;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  adapt(now) {
    if (this.adaptations >= 3) return;
    const gap = now - this.lastRender;
    this.lastRender = now;
    if (gap <= 0 || gap > 120) return;
    this.samples.push(gap);
    if (this.samples.length < 75) return;
    const sorted = this.samples.slice(15).sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    this.samples = [];
    if (median > 1000 / 42 && this.ratio > 1) {
      this.ratio = Math.max(1, this.ratio * 0.78);
      this.reflectRes = Math.max(0.3, this.reflectRes * 0.8);
      this.adaptations += 1;
      this.resize();
    } else if (median > 1000 / 30 && this.composer) {
      this.composer = null;
      this.canvas.classList.add('is-raw');
      this.adaptations += 1;
    } else {
      this.adaptations = 3;
    }
  }

  render() {
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  frame(now) {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.1, this.clock.getDelta());
    if (this.mode === 'garage') {
      if (!this.busy && !this.controls.autoRotate && performance.now() - this.idle > 7000 && !this.reduced) this.controls.autoRotate = true;
      this.controls.update(dt);
      if (this.options.onTurn) this.options.onTurn(this.turn());
      this.adapt(now);
      this.render();
      return;
    }
    if (!this.filmCars) return;
    if (this.updateFilm(now, dt)) {
      this.dirty = false;
      this.adapt(now);
      this.render();
    } else {
      this.lastRender = 0;
    }
  }
}

export { LIT };
