npc = createBoxMesh2(0x0000ff,1,2,4);
npc.position.set(30,5,-30);
npc.addEventListener('collision',function(other_object){
  if (other_object==avatar){
    gameState.health -= 1;
    npc.__dirtyPosition = true;
    npc.position.set(randN(30), randN(20), randN(40));     }
})
scene.add(npc);

extrafeature = createConeMesh(10, 5);
extrafeature.position.set(0, 10, 3);
scene.add(extrafeature);

function updateNPC(){
  if (avatar.position.distanceTo(npc.position) <= 20) {
    npc.__dirtyPosition = true;
    npc.lookAt(avatar.position);
    npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(0.5))
  }
}

//In function animate don't forget : updateNPC();
