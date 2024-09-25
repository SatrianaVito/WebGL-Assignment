// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Initial color
    let objectColor = [1.0, 0.0, 0.0, 1.0];

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program
    let fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get the attribute and uniform locations
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniform = gl.getUniformLocation(shaderProgram, 'uColor');

    // Create a buffer for the rectangle's positions.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Triangle
    const positions = [
        0.0,  0.5,
       -0.5, -0.5,
        0.5, -0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Bind the position buffer
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Use our shader program
    gl.useProgram(shaderProgram);

    // Set the initial color
    gl.uniform4fv(colorUniform, objectColor);

    // Draw the triangle
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    drawScene();

    // Button Event Listeners for color change
    document.getElementById('color1').addEventListener('click', () => {
        objectColor = [1.0, 0.0, 0.0, 1.0]; // Red
        gl.uniform4fv(colorUniform, objectColor);
        drawScene();
    });

    document.getElementById('color2').addEventListener('click', () => {
        objectColor = [0.0, 1.0, 0.0, 1.0]; // Green
        gl.uniform4fv(colorUniform, objectColor);
        drawScene();
    });

    document.getElementById('color3').addEventListener('click', () => {
        objectColor = [0.0, 0.0, 1.0, 1.0]; // Blue
        gl.uniform4fv(colorUniform, objectColor);
        drawScene();
    });

    document.getElementById('resetColor').addEventListener('click', () => {
        objectColor = [1.0, 0.0, 0.0, 1.0]; // Reset to Red
        gl.uniform4fv(colorUniform, objectColor);
        drawScene();
    });
};

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
