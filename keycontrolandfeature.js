//key control: add this under the switch command of "keydown" after the codes from arrows.
case "q": avatarCam.translateX(-1);break;
case "e": avatarCam.translateX(1);break;

//additional feature: a npc that increases the health

function createNPC2(color){
  var geometry = new THREE.TorusKnotGeometry( 2.5, 0.75, 25, 4 );
  var material = new THREE.MeshLambertMaterial( { color: color } );
  mesh = new Physijs.BoxMesh( geometry, material,0 );
  //mesh = new Physijs.BoxMesh( geometry, material,0 );
  mesh.castShadow = true;
  return mesh;
}//Angel

//add this under createMainScene
    npc2 = createNPC2(0xffb6c1);
    npc2.position.set(-30,5,-40);
    this.__dirtyPosition = true;
    npc2.addEventListener('collision',
        function addNPC2Scores (other_object){
          if (other_object==avatar){
            console.log( "Avatar hits the NPC2");
            soundEffect('good.wav');
            gameState.health += 1;  // add one to the score
          }
        })
        scene.add(npc2); //Angel
