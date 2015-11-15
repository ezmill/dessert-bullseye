//THREE.JS UTILS - EZRA MILLER
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            var file = window.URL.createObjectURL(blob);
            var img = new Image();
            img.src = file;
            img.onload = function(e) {
                window.open(this.src);

            }
        }
        function dataURItoBlob(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
    if (event.keyCode == "82") {
        // capturer.start();
    }
    if (event.keyCode == "84") {
        // capturer.stop();
        // capturer.save(function(blob) {
            // window.location = blob;
        // });
    }
}
function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}
// var manager = new THREE.LoadingManager();
// manager.onProgress = function ( item, loaded, total ) {
//     // console.log( item, loaded, total );
// };
function loadModel(model, material){
    var loader = new THREE.OBJLoader( manager );
    var that = this;
    loader.load( model, function ( object ) {

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {
                child.material = material;
            }
        } );
        // obj = object;
        // console.log(that, model, material);
        // scene.add( object );
        that.mesh = object;
        that.scene.add(that.mesh);
    }, onProgress, onError );
}
function onProgress( xhr ) {
if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    // console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
};

function onError( xhr ) {
};
function createTex(string){
    var tex = THREE.ImageUtils.loadTexture(string);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;  
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.antialias = true;
    return tex;
}
function createTexCube(PATH, FORMAT, isRefractive){
    var path = PATH;
    var format = FORMAT;
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    if(isRefractive){
        var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    } else {
        var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    }
    return textureCube;
}
function randomColor(){
    var hex = '#'+Math.floor(Math.random()*16777215).toString(16);
    return new THREE.Color(hex);
}
function hslaColor(h,s,l,a){
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}