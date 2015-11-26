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
var matcaps = [
    "assets/textures/b16walls013.jpg",
    "assets/textures/gingham.jpg",
    "assets/textures/rubymatcap.jpg",
    "assets/textures/Charcoal_black_texture_1.jpg",
    "assets/textures/crystal.jpg",
    "assets/textures/DSCF2694.jpg",
    "assets/textures/gold-1.jpg",
    "assets/textures/tumblr_niubkwwc9L1u9u26oo1_r1_540.png",
    // "assets/textures/macrea.jpg",
    // "assets/textures/MW-dragon-purple-thumb.jpg",
    // "assets/textures/shhh3.jpg",
    // "assets/textures/gold2.jpg",
]
var video, texture;
var expand = false;
var cameraPos = document.getElementById("cameraPos");
var filename = document.getElementById("filename");
var preview = document.getElementById("preview");
var cp = document.getElementById("cp");
var matcapIndex = 0;
init();
fbInit();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	target = new Target();
	target.init();


    texture = new THREE.Texture(target.canvas);
    texture.needsUpdate = true;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}
var counter = 0;
function onDocumentMouseDown(){
	if(counter%2==0){
		target.alpha = 0.0;
	} else {
		target.alpha = 1.0;
	}
	counter++;
}


function animate() {
// setTimeout(function() {
	requestAnimationFrame( animate );
// }, 1000 / 30);
	render();

}

function render() {
	target.update();

	texture.needsUpdate = true;
	// camera.position.x += ( mouse.x - camera.position.x ) * 0.05;
	// camera.position.y += ( - mouse.y - camera.position.y ) * 0.05;
	// camera.lookAt( center );
	// gradient.update();
	// fbRenderer.render( scene, camera );
    fbDraw();
    fbTex.needsUpdate = true;
    normalRenderer.render(normalScene, normalCamera);
    capturer.capture( normalRenderer.domElement );

}

function fbInit(){

    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true/*, alpha: true*/});
    fbRenderer.setClearColor(0xffffff, 1.0);
    fbRenderer.setSize(window.innerWidth, window.innerHeight);
    // container.appendChild(fbRenderer.domElement);

    fbScene = new THREE.Scene();
    

    var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();

    fbShaders = [ 
        customShaders.flowShader, 
        customShaders.blurShader, 
        customShaders.diffShader, 
        customShaders2.blurShader, 
        customShaders.blurShader,
        customShaders.embossShader
    ];

    fbMaterial = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, texture, fbShaders);
        
    fbMaterial.init();

    fbTex = new THREE.Texture(fbRenderer.domElement);
    fbTex.needsUpdate = true;
    fbTex.minFilter = fbTex.magFilter = THREE.NearestFilter;

    normalScene = new THREE.Scene();
    normalCamera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    normalCamera.position.z = cameraPos.value;
    cp.innerHTML = cameraPos.value;

    normalRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    normalRenderer.setSize( renderSize.x, renderSize.y );
    normalRenderer.setClearColor(0xffffff,1.0);

    ambientLight = new THREE.AmbientLight( 0xffffff );
    normalScene.add( ambientLight );

    pointLight = new THREE.PointLight( 0xff0000, 1.0, 1000 );
    pointLight.position.set( 0, 0, 600 );

    normalScene.add( pointLight );

    directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, -0.5, -1 );
    normalScene.add( directionalLight );

    // normalMaterial = new THREE.MeshPhongMaterial({
    //     color: 0xffffff,
    //     // specular: 0x222222,
    //     shininess: 35,
    //     map: fbTex,
    //     // specularMap: THREE.ImageUtils.loadTexture( "obj/leeperrysmith/Map-SPEC.jpg" ),
    //     // bumpMap: fbTex,
    //    normalMap: fbTex,
    //     normalScale: new THREE.Vector2( 1.8, 1.8 )
    // })
    currentMatcap = matcaps[matcapIndex];
    preview.src = currentMatcap;
    filename.innerHTML = currentMatcap.split("assets/textures/")[1];
    normalMaterial = new THREE.ShaderMaterial( {

        uniforms: { 
            tNormal: {type: 't', value: fbTex },
            // tCol: {type: 't', value: colTex },
            tMatCap: {type: 't', value: THREE.ImageUtils.loadTexture( currentMatcap ) },
            time: {type: 'f', value: 0 },
            bump: {type: 'f', value: 0 },
            noise: {type: 'f', value: .04 },
            repeat: {type: 'v2', value: new THREE.Vector2( 1, 1 ) },
            resolution: {type: 'v2', value: null },
            mouse: {type: 'v2', value: new THREE.Vector2( 0.0,0.0 ) },
            useNormal: {type: 'f', value: 1 },
            useRim: {type: 'f', value: 0 },
            rimPower: {type: 'f', value: 2 },
            useScreen: {type: 'f', value: 0 },
            normalScale: {type: 'f', value: 1.0 },
            normalRepeat: {type: 'f', value: 1 }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        // wrapping: THREE.ClampToEdgeWrapping,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        
    } );

    normalMaterial.uniforms.tMatCap.value.wrapS = normalMaterial.uniforms.tMatCap.value.wrapT = 
    THREE.ClampToEdgeWrapping;
    normalMaterial.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // normalMaterial.uniforms.tNormal.value.wrapS = normalMaterial.uniforms.tNormal.value.wrapT = 
    // THREE.RepeatWrapping;

    normalGeometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);

    normalGeometry.verticesNeedUpdate = true;
    normalGeometry.normalsNeedUpdate = true;
    normalGeometry.uvsNeedUpdate = true;
    normalGeometry.computeCentroids();
    normalGeometry.computeFaceNormals();
    normalGeometry.computeVertexNormals();
    normalGeometry.computeMorphNormals();
    normalGeometry.computeTangents();

    normalMesh = new THREE.Mesh(normalGeometry, normalMaterial);
    normalMesh.position.set(0,0,0);
    normalScene.add(normalMesh);

    container.appendChild(normalRenderer.domElement);

    document.addEventListener( 'keydown', function(){screenshot(normalRenderer)}, false );
}

function updateCameraPos(value){
    console.log(value);
    normalCamera.position.z = value;
    cp.innerHTML = value;
}
function addMatcap(){
    // var preview = document.querySelector('img'); //selects the query named img
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
      var newMatcap = reader.result;
      // newMatcap.name = file.name;
      // console.log(reader.result);
      // var newMatcap = new Image();
      // newMatcap.src = reader.result;
      matcaps.push(newMatcap);
    }

    if (file) {
      reader.readAsDataURL(file); //reads the data as a URL
    }
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
    // fbTexture.needsUpdate = true;
        
    fbMaterial.update();
    // fbMaterial.expand(1.002);
    fbRenderer.render(fbScene, fbCamera);

    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();

    // capturer.capture( fbRenderer.domElement );

    
}
function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }
