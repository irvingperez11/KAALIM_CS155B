//variables
var startScene, startCamera, startText;

function createStartScene(){
  startScene = initScene();
  startText = createSkyBox('start1.png',10);
  startScene.add(startText);
  var light1 = createPointLight();
  light1.position.set(0,200,20);
  startScene.add(light1);
  startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
  startCamera.position.set(0,50,1);
  startCamera.lookAt(0,0,0);
}

//under function init()

createStartScene();
      initPhysijs();//remove the original initPhysijs and put it here

//put it under keydown above the switch command
if (gameState.scene == 'start1' && event.key=='s') {
			gameState.scene = 'main';
			gameState.score = 0;
			addBalls();
			return;
		}


//put it under the switch command of function animate(), and it should be before the case "you won"
case "start1":
			//endText.rotateY(0.005);
			renderer.render( startScene, startCamera );
			break;

//under var controls =
//delete the original code for speed
speed:10, fly:false, reset:false, reset2:false,

//in keydown's switch, add this after case "h"
case "0": controls.reset2 = true; break;

//add this to function update avatar. it should be below if (controls.reset)
if (controls.reset2){
avatar.__dirtyPosition = true;
avatar.position.set(40,50,40);
}
