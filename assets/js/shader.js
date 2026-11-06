/* =========================================================
   Hero WebGL — champ fluide (domain-warped fbm) qui tourbillonne
   autour du curseur. Clic = nouvelle palette.
   ========================================================= */
(function () {
  const canvas = document.querySelector(".hero__gl");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) { canvas.style.background = "radial-gradient(circle at 60% 40%, #6b4dff, #ff4d2e 40%, #0b0b10 75%)"; return; }

  const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const frag = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uVel;
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform float uPulse;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float s = 0., a = .5;
  for(int i=0;i<5;i++){ s += a*noise(p); p = mat2(1.6,1.2,-1.2,1.6)*p + vec2(1.7,9.2); a *= .5; }
  return s;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 p = (uv - .5) * vec2(ar, 1.);
  vec2 m = (uMouse - .5) * vec2(ar, 1.);

  vec2 d = p - m;
  float dist = length(d);
  float infl = exp(-dist*dist*5.);
  float ang = infl * (1.2 + uVel*6.) + uPulse*infl*3.;
  float c = cos(ang), s = sin(ang);
  p = m + mat2(c,-s,s,c)*d * (1. - infl*.25);

  float t = uTime*.07;
  vec2 q = vec2(fbm(p*1.4 + t), fbm(p*1.4 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*1.4 + 3.5*q + vec2(1.7,9.2) + t*1.3), fbm(p*1.4 + 3.5*q + vec2(8.3,2.8) - t*.9));
  float f = fbm(p*1.4 + 3.5*r);

  vec3 bg = vec3(.043,.043,.063);
  vec3 col = mix(bg, uC1, smoothstep(.25, .85, f));
  col = mix(col, uC2, smoothstep(.35, 1.05, length(q)) * .85);
  col = mix(col, uC3, smoothstep(.62, 1.0, r.x) * .9);
  col += uC3 * infl * .12;
  // bandes iridescentes fines
  col += .06 * sin(f*40. + uTime*.6) * smoothstep(.4,.8,f);
  // vignette + assombrissement bas (lisibilité du titre)
  col *= smoothstep(1.25, .25, length((uv-.5)*vec2(1.,1.2)));
  col *= mix(.55, 1., smoothstep(.0, .7, uv.y));
  gl_FragColor = vec4(col, 1.);
}`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ["uRes", "uTime", "uMouse", "uVel", "uC1", "uC2", "uC3", "uPulse"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const palettes = [
    ["#6b4dff", "#ff4d2e", "#d4ff3a"], // signature
    ["#ff2e88", "#2e6bff", "#ffd23a"], // pop
    ["#00e0b8", "#3a2eff", "#f3efe4"], // aqua
    ["#ff6a00", "#b100ff", "#00ffd0"], // sunset rave
  ];
  let palIndex = 0;
  const cur = palettes[0].map(hex);
  let target = palettes[0].map(hex);

  const mouse = { x: 0.6, y: 0.55, tx: 0.6, ty: 0.55, vel: 0 };
  let pulse = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  const hero = canvas.parentElement;
  function setPointer(cx, cy) {
    const r = hero.getBoundingClientRect();
    mouse.tx = (cx - r.left) / r.width;
    mouse.ty = 1 - (cy - r.top) / r.height;
  }
  window.addEventListener("pointermove", (e) => setPointer(e.clientX, e.clientY), { passive: true });
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    palIndex = (palIndex + 1) % palettes.length;
    target = palettes[palIndex].map(hex);
    pulse = 1;
    document.documentElement.style.setProperty("--hero-accent", palettes[palIndex][2]);
  });

  // Mobile : gyroscope → déplace le tourbillon
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    mouse.tx = 0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.4;
    mouse.ty = 0.5 - Math.max(-1, Math.min(1, (e.beta - 45) / 35)) * 0.4;
  });

  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

  const start = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = reduced ? 20 : (now - start) / 1000;
    const px = mouse.x, py = mouse.y;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    const v = Math.hypot(mouse.x - px, mouse.y - py);
    mouse.vel += (Math.min(v * 25, 1) - mouse.vel) * 0.08;
    pulse *= 0.95;
    for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) cur[i][k] += (target[i][k] - cur[i][k]) * 0.04;

    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, t);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform1f(U.uVel, mouse.vel);
    gl.uniform1f(U.uPulse, pulse);
    gl.uniform3fv(U.uC1, cur[0]);
    gl.uniform3fv(U.uC2, cur[1]);
    gl.uniform3fv(U.uC3, cur[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
})();
