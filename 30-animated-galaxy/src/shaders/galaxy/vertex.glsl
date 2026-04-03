uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float radius = length(modelPosition.xz);
    float angleOffset = (1.0 / radius) * uTime * 0.2;
    angle += angleOffset;

    modelPosition.x = cos(angle) * radius;
    modelPosition.z = sin(angle) * radius;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * ( 1.0 / - viewPosition.z );

    // Varyings
    vColor = color;
}