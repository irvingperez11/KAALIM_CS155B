
	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, blueAvatarCam, redAvatarCam;  // we have two cameras in the main scene
	//the avatars are changed here!
	var blueAvatar, redAvatar; //to distinguish the avatars
	var clock;
	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}
	var gameState =
	     {score:0, health:10, scene:'main', camera:'none' }

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

			// create the blue avatar, controls WASD to control him, button 2 for his camera
			blueAvatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			blueAvatar = createBlueAvatar();
			blueAvatar.translateY(20);
			blueAvatarCam.translateY(-4);
			blueAvatarCam.translateZ(3);
			scene.add(blueAvatar);
			gameState.camera = blueAvatarCam;

			//creates the red avatar, no controls yet, button 3 for his camera
			redAvatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			redAvatar = createRedAvatar();
			redAvatar.translateY(20);
			redAvatar.translateX(20);
			redAvatarCam.translateY(-4);
			redAvatarCam.translateZ(3);
			scene.add(redAvatar);

			//time to add balls
			addOrangeBalls();
			addPurpleBalls();

	}


	function randN(n){
		return Math.random()*n;
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


	function createBlueAvatar()
	{
		//this is just temporarily a box avatar for playing with and testing
		var geometry = new THREE.CylinderGeometry( 4, 4, 6, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0x44b4e2} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		blueAvatarCam.position.set(0,4,0);
		blueAvatarCam.lookAt(0,4,10);
		mesh.add(blueAvatarCam);
		return mesh;
	}
	function createRedAvatar()
	{
		var geometry = new THREE.CylinderGeometry( 4, 4, 6, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xfa2a2a} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		redAvatarCam.position.set(0,4,0);
		redAvatarCam.lookAt(0,4,10);
		mesh.add(redAvatarCam);
		return mesh;
	}

	function addPurpleBalls()
	{
		var numBalls = 15;
		for(i=0;i<numBalls;i++)
		{
			var ball = createBall(0x620bba);
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);
			/*ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
			to be added once the goals are made*/
		}
	}
	function addOrangeBalls()
	{
		var numBalls = 15;
		for(i=0;i<numBalls;i++)
		{
			var ball = createBall(0xff5753);
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);
		}
	}
	function createBall(color)
	{
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
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
			case "2": gameState.camera = blueAvatarCam; break; //designate the cameras
			case "3": gameState.camera = redAvatarCam; break; //designate the cameras
      case "ArrowLeft": blueAvatarCam.translateX(-1);break;
      case "ArrowRight": blueAvatarCam.translateX(1);break;
      case "ArrowUp": blueAvatarCam.translateY(1);break;
      case "ArrowDown": blueAvatarCam.translateY(-1);break;
      case "q": redAvatarCam.translateX(-1);break;
      case "e": redAvatarCam.translateX(1);break;
      case "z": redAvatarCam.translateY(-1);break;
      case "c": redAvatarCam.translateY(1);break;
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

  function updateAvatar(avatar) //edited here so both avatars will move
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
				updateAvatar(blueAvatar);
				updateAvatar(redAvatar);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;
			default:
			  console.log("don't know the scene "+gameState.scene);
		}
	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Score: ' + gameState.score + '</div>';

	}
