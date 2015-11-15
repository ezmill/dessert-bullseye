var container;
var scene, camera, light, renderer;
var geometry, cube, mesh, material;
var mouse = new THREE.Vector2(), center;
var stats;
var container;
var scene, renderer, camera, controls;
var fbScene, fbRenderer, fbCamera, fbTexture, fbShaders, fbMaterial;
var mouseX = 0, mouseY = 0;
var time = 0;
var texture;
var windowHalfX = window.innerWidth / 2;
var w = window.innerWidth;
var windowHalfY = window.innerHeight / 2;
var h = window.innerHeight;
var renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
var start = Date.now(); 
var gradient, tex;
var meshes = [];
var obj;
var counter = 0;
var rtt;
var captureFrame = 0;
var sizeMult = 1;
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );
// var capturer = new CCapture( { framerate: 2, format: 'gif', workersPath: 'js/' } );
var range = 100.0;
var video, texture;
var expand = false;
var ringVal = 200.0;
init();
fbInit();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer: true});
    renderer.setSize(renderSize.x, renderSize.y);

    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    camera.position.z = 1;

    scene = new THREE.Scene();
    cs = new CustomShaders();
    material = new THREE.ShaderMaterial({
        uniforms: cs.circleShader.uniforms,
        fragmentShader: cs.circleShader.fragmentShader,
        vertexShader: cs.circleShader.vertexShader
    });
    material.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    material.uniforms["time"].value = 0.0;
    material.uniforms["rings"].value = ringVal;
    geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    fbTexture = new THREE.Texture(renderer.domElement);
    fbTexture.needsUpdate = true;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}
var counter = 0;
function onDocumentMouseDown(){
    counter++;
    if(counter%2==0){
        material.uniforms["rings"].value = 0.0;
    } else {
        material.uniforms["rings"].value = ringVal;
    }
}


function animate() {
// setTimeout(function() {
	requestAnimationFrame( animate );
// }, 1000 / 30);
	render();

}

function render() {

	// texture.needsUpdate = true;
	renderer.render( scene, camera );
    fbDraw();

}

function fbInit(){

    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true/*, alpha: true*/});
    fbRenderer.setClearColor(0xffffff, 1.0);
    fbRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(fbRenderer.domElement);

    fbScene = new THREE.Scene();
    

    var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();

    fbShaders = [ 
        customShaders.flowShader, 
        customShaders.blurShader, 
        customShaders.diffShader, 
        customShaders2.warp2, 
        customShaders2.passShader,
        customShaders.bumpShader
    ];

    fbMaterial = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, fbTexture, fbShaders);
        
    fbMaterial.init();

    document.addEventListener( 'keydown', function(){screenshot(fbRenderer)}, false );
}
function onDocumentMouseMove( event ) {

	mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
	mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);
    
    
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      // fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);
    }


}
function fbDraw(){

    time+=0.01;
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.time.value = time;
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(Math.sin(time)*2.0, Math.cos(time)*2.0);
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(0.0,0.0);
      fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);
    }
    material.uniforms.time.value += 0.01;

    fbTexture.needsUpdate = true;
        
    fbMaterial.update();
    // fbMaterial.expand(1.002);
    fbRenderer.render(fbScene, fbCamera);

    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();

    capturer.capture( fbRenderer.domElement );

    
}
function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }
