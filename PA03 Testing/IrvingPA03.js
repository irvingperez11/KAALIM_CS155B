
var geometry = new THREE.CubeGeometry( 250, 250, 250 );
var cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "img/nightsky_ft.png" ), side: THREE.DoubleSide }), //front side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/nightsky_bk.png' ), side: THREE.DoubleSide }), //back side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/nightsky_up.png' ), side: THREE.DoubleSide }), //up side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/nightsky_dn.png' ), side: THREE.DoubleSide }), //down side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/nightsky_rt.png' ), side: THREE.DoubleSide }), //right side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/nightsky_lf.png' ), side: THREE.DoubleSide }) //left side
];

var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
var cube = new THREE.Mesh( geometry, cubeMaterial );
scene.add( cube );


// Camera Position
camera.position.z = 3;

// lighting
var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.3 );
scene.add( ambientLight );
