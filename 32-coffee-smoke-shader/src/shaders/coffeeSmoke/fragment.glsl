uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture2D(uPerlinTexture, smokeUv).r; // grayscale image so we can 
    // take any channel, but only one to save some performance

    // Remap
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= 1.0 - smoothstep(0.9, 1.0, vUv.x); // or just smoothstep(1.0, 0.9, vUv.x)

    gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}