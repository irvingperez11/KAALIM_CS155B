/*
This is the final project for team KAALIM
*/
// First we declare the variables that hold the objects we need
// in the animation code
var scene, renderer;  // all threejs programs need these
var camera, blueAvatarCam, redAvatarCam;  // we have three cameras in the main scene
var blueAvatar, redAvatar; //to distinguish the avatars
var blueNetB, redNetB;
var clock;
var rednpc, bluenpc;
var startScene, startCamera, startText;
var endwonScene, endloseScene, endCamera, endwinText, endloseText;

var controls =
     {fwd:false, bwd:false, left:false, right:false,
			speed:10, fly:false, reset:false,
	    camera:camera}
var gameState =
     {ScoreBlue:0, ScoreRed:0, Bluehealth:10, Redhealth:10, scene:'start3', camera:'none' }

// Here is the main game control
init();
initControls();
animate();  // start the animation loop!
//start scene
function createStartScene()
{
	startScene = initScene();
	startText = createStartBox('start3.png',10);
	startScene.add(startText);
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	startScene.add(light1);
	startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	startCamera.position.set(0,50,1);
	startCamera.lookAt(0,0,0);
}
//runs the end scenes
function createEndScene()
{
	endwonScene = initScene();
	endloseScene = initScene();
	endwonText = createStartBox('win2.png',10);
	endloseText = createStartBox('lose2.png',10);
	//endText.rotateX(Math.PI);
	endwonScene.add(endwonText);
	endloseScene.add(endloseText);
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	var light2 = createPointLight();
	light2.position.set(0,200,20);
	endwonScene.add(light1);
	endloseScene.add(light2);
	endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	endCamera.position.set(0,50,1);
	endCamera.lookAt(0,0,0);
}

function init()
{
	createStartScene();
	initPhysijs();
	scene = initScene();
	createEndScene();
	initRenderer();
	createMainScene();
}
function createMainScene()
{
  // setup lighting
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	scene.add(light1);
	var light0 = new THREE.AmbientLight( 0xffffff,0.25);
	scene.add(light0);

	// create main camera
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0,50,0);
	camera.lookAt(0,0,0);

	// create the ground and the skybox
	var ground = createGround('Soccer-Field.jpg');
	scene.add(ground);
	// creates the shape
	var geometry = new THREE.CubeGeometry( 250, 250, 250 );
	var cubeMaterials = [
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "../images/nightsky_ft.png" ), side: THREE.DoubleSide }), //front side
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../images/nightsky_bk.png' ), side: THREE.DoubleSide }), //back side
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../images/nightsky_up.png' ), side: THREE.DoubleSide }), //up side
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../images/nightsky_dn.png' ), side: THREE.DoubleSide }), //down side
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../images/nightsky_rt.png' ), side: THREE.DoubleSide }), //right side
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../images/nightsky_lf.png' ), side: THREE.DoubleSide }) //left side
			];
	// lighting
	var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.3 );
	scene.add( ambientLight );

	var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
	var cube = new THREE.Mesh( geometry, cubeMaterial );
	scene.add( cube );
	// create the blue avatar, controls WASD to control him, button 2 for his camera
	blueAvatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	blueAvatar = createBlueAvatar();
	blueAvatar.translateY(20);
	blueAvatar.translateX(-20);
	blueAvatarCam.translateY(-4);
	blueAvatarCam.translateZ(2);
	scene.add(blueAvatar);
	gameState.camera = blueAvatarCam;
	//creates the red avatar, button 3 for his camera
	redAvatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	redAvatar = createRedAvatar();
	redAvatar.translateY(20);
	redAvatar.translateX(20);
	redAvatarCam.translateY(-4);
	redAvatarCam.translateZ(2);
	scene.add(redAvatar);
	//time to add balls
	addPurpleBalls(); //for the both avatars to play with
	//add in the nets
    blueNetB = createNetB(0x44b4e2);
    blueNetB._dirtyPosition = true;
    blueNetB.position.set(75,-3,0);
    blueNetB.rotateX(Math.PI/2);
    blueNetB.rotateZ(Math.PI);
    scene.add(blueNetB);

    redNetB = createNetB(0xfa2a2a);
    redNetB._dirtyPosition = true;
    redNetB.position.set(-75,-3,0);
    redNetB.rotateY(Math.PI);
    redNetB.rotateX(Math.PI/2);
    redNetB.rotateZ(Math.PI);
    scene.add(redNetB);
    rednpc = createBoxMesh(0xfa2a2a);
    bluenpc= createBoxMesh(0x44b4e2);
    rednpc.position.set(30,5,-30);
    rednpc.scale.set(1,2,4);
    rednpc.addEventListener('collision',
    function showEating (other_object)
    {
      if(other_object == redAvatar)
      {
        gameState.Redhealth -= 1;
        rednpc.__dirtyPosition = true;
        rednpc.position.set(randN(30), randN(20), randN(40)); //add one to the Score
      }
      if (gameState.Redhealth==0) {
        gameState.scene='lose2';
      }

    })
  scene.add(rednpc);


  bluenpc.position.set(-30,5,-30);
  bluenpc.scale.set(1,2,4);
  bluenpc.addEventListener('collision',
  function showEating (other_object)
  {
    if(other_object == blueAvatar)
    {
      gameState.Bluehealth -= 1;
      bluenpc.__dirtyPosition = true;
      bluenpc.position.set(randN(30), randN(20), randN(40)); //add one to the Score
    }
    if (gameState.Bluehealth==0) {
      gameState.scene='lose2';
    }
  })
  scene.add(bluenpc);
  }

function randN(n)
{
	return Math.random()*n;
}
function initScene()
{
    var scene = new Physijs.Scene();
	return scene;
}
function initPhysijs()
{
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
}
function initRenderer()
{
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight-50 );
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}
function createPointLight()
{
	var light;
	light = new THREE.PointLight( 0xffffff);
	light.castShadow = true;
	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default
	light.shadow.mapSize.height = 2048; // default
	light.shadow.camera.near = 0.5;       // default
	light.shadow.camera.far = 500      // default
	return light;
}
function createBoxMesh(color)
{
	var geometry = new THREE.BoxGeometry( 1, 1, 1);
	var material = new THREE.MeshLambertMaterial( { color: color} );
	mesh = new Physijs.BoxMesh( geometry, material );
	mesh.castShadow = true;
	return mesh;
}
function createCyclinderMesh(color)
{
	var geometry = new THREE.CylinderGeometry( 1, 1, 3, 16);
	var material = new THREE.MeshLambertMaterial( { color: color});
	mesh = new Physijs.BoxMesh(geometry,material);
	mesh.castShadow = true;
	return mesh;
}
function createSphereMesh(color)
{
	var geometry = new THREE.SphereGeometry(2,16,32);
	var texture = new THREE.TextureLoader().load( '../images/sky.jpg');
	var material = new THREE.MeshLambertMaterial( { color: color, map:texture, side:THREE.DoubleSide});
	//var material = new THREE.MeshLambertMaterial( {color : color});
	mesh = new Physijs.BoxMesh(geometry,material);
	mesh.position.set(0,4.5,0);
	return mesh;
}
function createGround(image)
{
	// creating the ground to build on
	var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
	mesh.receiveShadow = true;
	mesh.rotateX(Math.PI/2);
	return mesh
}
function createStartBox(image,k)
{
	// creating a textured plane which receives shadows
	var geometry = new THREE.PlaneGeometry( 100, 80, 80 );
	geometry.rotateX(-Math.PI/2);
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	var mesh = new THREE.Mesh( geometry, material, 0 );
	mesh.receiveShadow = false;
	return mesh
}
function createBlueAvatar()
{
    var geometry = new THREE.CylinderGeometry( 3, 3, 6, 32);
	var material = new THREE.MeshLambertMaterial( { color: 0x44b4e2} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	blueAvatarCam.position.set(0,4,0);
	blueAvatarCam.lookAt(0,4,10);
	mesh.add(blueAvatarCam);
	var armRight = createCyclinderMesh(0xffffff);
	armRight.position.set(4,0,0.5);
	mesh.add(armRight);
	var armLeft = createCyclinderMesh(0xffffff);
	armLeft.position.set(-4,0,0.5);
	mesh.add(armLeft);
	var head = createSphereMesh(0xffffff);
	mesh.add(head);
	return mesh;
}
function createRedAvatar()
{
    var geometry = new THREE.CylinderGeometry( 3, 3, 6, 16);
	var material = new THREE.MeshLambertMaterial( { color: 0xfa2a2a} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	redAvatarCam.position.set(0,4,0);
	redAvatarCam.lookAt(0,4,10);
	mesh.add(redAvatarCam);
    var armRight = createCyclinderMesh(0xffffff);
    armRight.position.set(4,0,0.5);
    mesh.add(armRight);
    var armLeft = createCyclinderMesh(0xffffff);
    armLeft.position.set(-4,0,0.5);
    mesh.add(armLeft);
    var head = createSphereMesh(0xff0000);
    mesh.add(head);
	return mesh;
}
function addPurpleBalls()
{
	var numBalls = 15;
	for(i=0;i<numBalls;i++)
	{
		var ball = createBall(0xffffff);
		ball.position.set(randN(20)-5,20,randN(20)-5);
		scene.add(ball);
		ball.addEventListener( 'collision',
		function( other_object, relative_velocity, relative_rotation, contact_normal )
		{
      if (other_object==blueNetB )
			{
				console.log("ball "+i+" hit blueNet");
				gameState.ScoreBlue += 1;  // add one to the score
				if (gameState.ScoreBlue == 5)
				{
					gameState.scene='youwon';
				}
				//gets rid of the ball just scored with
				this.position.y = this.position.y - 100;
				this.__dirtyPosition = true;
			}
      if (other_object==redNetB)
			{
				console.log("ball "+i+" hit redNet");
				gameState.ScoreRed += 1;  // add one to the score
				if (gameState.ScoreRed == 5)
				{
					gameState.scene='youwon';
				}
				//gets rid of the ball just scored with
				this.position.y = this.position.y - 100;
				this.__dirtyPosition = true;
			}
		}
	)
	}
}
function createBall(color)
{
	var geometry = new THREE.SphereGeometry( 1, 16, 32);
    var texture = new THREE.TextureLoader().load( '../images/RoundSoccerBall.png');
    var material = new THREE.MeshLambertMaterial( { color: color,  map: texture ,side:THREE.FrontSide} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	return mesh;
}
function createNet(color)
{
	var geometry = new THREE.BoxGeometry(30, 2, 9.5);
	var texture = new THREE.TextureLoader().load( '../images/net.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: color,  map: texture ,side:THREE.DoubleSide} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	var meshNet = new Physijs.BoxMesh(geometry, pmaterial,0);
	meshNet.castShadow = true;
	return meshNet;
}
function createNetB(color)
{
  var geometry = new THREE.CylinderGeometry( 12, 12, 30, 3, 0, false, 3, 1.5 );
  var texture = new THREE.TextureLoader().load( '../images/net.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: color,  map: texture ,side:THREE.DoubleSide} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	var meshNet = new Physijs.BoxMesh(geometry, pmaterial,0);
	meshNet.castShadow = true;
	return meshNet;
}
function initControls()
{
	// here is where we create the eventListeners to respond to operations
	//create a clock for the time-based animation ...
	clock = new THREE.Clock();
	clock.start();
	window.addEventListener( 'keydown', keydown);
	window.addEventListener( 'keyup',   keyup );
}
function keydown(event)
{
	console.log("Keydown:"+event.key);
	if ((gameState.scene == 'win2' && event.key=='r')||(gameState.scene == 'lose2' && event.key=='r'))
    {
		gameState.scene = 'main';
		gameState.score = 0;
		gameState.health = 10;
		return;
	}
	if (gameState.scene == 'start3' && event.key=='p')
    {
		gameState.scene = 'main';
		gameState.score = 0;
		return;
	}
	if (gameState.scene == 'main' && event.key=='u')
    {
		gameState.scene = 'main';
		gameState.score = 0;
		return;
	}
	switch (event.key)
	{
	// change the way the avatar is moving
	case "w": controls.fwd = true;  break;
	case "s": controls.bwd = true; break;
	case "a": controls.left = true; break;
	case "d": controls.right = true; break;
	case "r": controls.up = true; break;
	case "f": controls.down = true; break;
	case "m": controls.speed = 30; break;
	case " ": controls.fly = true; break;
	case "h": controls.reset = true; break;
	// switch cameras
	case "1": gameState.camera = camera; break;
	case "2": gameState.camera = blueAvatarCam; break; //designate the cameras
	case "3": gameState.camera = redAvatarCam; break; //designate the cameras
    case "ArrowLeft": controls.leftred = true;  break;
    case "ArrowRight": controls.rightred = true;  break;
    case "ArrowUp": controls.fwdred = true;  break;
    case "ArrowDown": controls.bwdred = true;  break;
    case "p": controls.speedred = 30; break;
    case "l": controls.downred = true; break;
    case "k": controls.flyred = true; break;
    case "j": controls.resetred = true; break;
	}
}
function keyup(event)
{
	switch (event.key)
	{
		case "w": controls.fwd   = false;  break;
		case "s": controls.bwd   = false; break;
		case "a": controls.left  = false; break;
		case "d": controls.right = false; break;
		case "r": controls.up    = false; break;
		case "f": controls.down  = false; break;
		case "m": controls.speed = 10; break;
		case " ": controls.fly = false; break;
		case "h": controls.reset = false; break;
    case "ArrowLeft": controls.leftred = false;  break;
    case "ArrowRight": controls.rightred = false;  break;
    case "ArrowUp": controls.fwdred = false;  break;
    case "ArrowDown": controls.bwdred = false;  break;
    case "p": controls.speedred = 10; break;
    case "l": controls.downred = false; break;
    case "k": controls.flyred = false; break;
    case "j": controls.resetred = false; break;
	}
}
function updateAvatarB(avatar) //edited here so both avatars will move
  {
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();
		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}
    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
	  avatar.position.set(40,10,40);
	  gameState.scene = main;
    }
	}
	function updateAvatarR(avatar) //edited here so both avatars will move
  {
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();
		if (controls.fwdred){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwdred){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}
    if (controls.flyred){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.leftred){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.rightred){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.resetred){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }
	}
  function updateredNPC()
  {

  		rednpc.__dirtyPosition = true;
  		rednpc.lookAt(redAvatar.position);
  		rednpc.setLinearVelocity(rednpc.getWorldDirection().multiplyScalar(0.5))

  }
  function updateblueNPC()
  {

  		bluenpc.__dirtyPosition = true;
  		bluenpc.lookAt(blueAvatar.position);
  		bluenpc.setLinearVelocity(bluenpc.getWorldDirection().multiplyScalar(0.5))

  }

function animate()
{
	requestAnimationFrame( animate );
	switch(gameState.scene)
	{
		case "start3":
		renderer.render( startScene, startCamera );
		break;

		case "win2":
			endText.rotateY(0.005);
			renderer.render( endScene, endCamera );
			break;

		case "lose2":
			//endText.rotateY(0.005);
			renderer.render( endloseScene, endCamera );
			break;

		case "main":
    updateAvatarB(blueAvatar);
    updateAvatarR(redAvatar);
    updateredNPC();
		updateblueNPC();
	    scene.simulate();
		if (gameState.camera!= 'none')
		{
			renderer.render( scene, gameState.camera );
		}
		break;
		default:
			console.log("don't know the scene "+gameState.scene);
	}
	var info = document.getElementById("info");
	info.innerHTML='<div style="font-size:24pt">Score Blue: ' + gameState.ScoreBlue + " Score Red: " + gameState.ScoreRed + " || Blue health =" + gameState.Bluehealth + " Red health =" + gameState.Redhealth
		+ '</div>';
}
