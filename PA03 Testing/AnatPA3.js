/*
This file is for testing anything you want to create
Please do not upload your code on top of it, but create a copy of it
So that other people can use it and nothing gets messed up.
Label your code with your name and comment changes you made at the top
This way everyone can read the top comments of the files and write it in
their reports for the latte posts.
Thank you!

Currently the file has a ground, two cameras, an avatar, and controls for the avatar
Please add what you were assigned/volunteered to do, plus anything you think is helpful/fun
Thank you! Don't forget to comment!!
*/

	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam;  // we have two cameras in the main scene
	var avatar;
	var clock;
	var net1;
	var net2;
	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}
	var gameState =
	     {score1:0, score2:0, health1:10, health2:10, scene:'main', camera:'none' }

	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!


	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
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
			var ground = createGround('grass.png');
			scene.add(ground);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();
			avatar.translateY(20);
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			scene.add(avatar);
			gameState.camera = avatarCam;


			net1 = createNet();
			net1._dirtyPosition = true;
			net1.position.set(50,5,0);
			net1.rotateX(Math.PI/2);
			net1.rotateZ(Math.PI/2);
			scene.add(net1);
			net2 = createNet();
			net2._dirtyPosition = true;
			net2.position.set(-50,5,0);
			net2.rotateX(Math.PI/2);
			net2.rotateZ(Math.PI/2);
			scene.add(net2);

			addBalls();

	}


	function randN(n){
		return Math.random()*n;
	}

	function addBalls(){
		var numBalls = 10;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==net1){
						console.log("ball "+i+" hit net1");
						//soundEffect('good.wav');
						gameState.score1 += 1;  // add one to the score
						if (gameState.score1 == 5) {
							gameState.scene='youwon';
						}
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		ball.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==net2){
					console.log("ball "+i+" hit net2");
					//soundEffect('good.wav');
					gameState.score2 += 1;  // add one to the score
					if (gameState.score2 == 5) {
						gameState.scene='youwon';
					}
					//scene.remove(ball);  // this isn't working ...
					// make the ball drop below the scene ..
					// threejs doesn't let us remove it from the schene...
					this.position.y = this.position.y - 100;
					this.__dirtyPosition = true;
				}
			}
		)
	}
	}
	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0x444444} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
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



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}



	function createGround(image)
	{
		// creating the ground to build on
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh
	}


	function createAvatar()
	{
		//this is just temporarily a box avatar for playing with and testing
		var geometry = new THREE.BoxGeometry( 5, 5, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		avatarCam.position.set(0,4,0);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);

		return mesh;
	}

	function createNet()
	{
		var geometry = new THREE.BoxGeometry(30, 8, 10);
		var texture = new THREE.TextureLoader().load( '../images/net.jpg' );
 		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	 	texture.repeat.set( 4, 4 );
  	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var meshNet = new Physijs.BoxMesh(geometry, pmaterial, 5000);
		meshNet.setDamping(0.1,0.1);
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
		switch (event.key){
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
			case "2": gameState.camera = avatarCam; break;
		}
	}
	function keyup(event)
	{
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

  function updateAvatar()
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
    }
	}

	function animate()
	{
		requestAnimationFrame( animate );
		switch(gameState.scene) {

			case "main":
				updateAvatar();
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;
			default:
			  console.log("don't know the scene "+gameState.scene);
		}
	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Score1: ' + gameState.score1 + '\n'+
		'Score2: ' + gameState.score2+ '</div>';

	}
