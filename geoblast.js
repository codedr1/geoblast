// Namespace declaration
var gb = gb || { };
/**
 * Pulse ready callback, makes sure the HTML content is loaded before starting
 * the game.
 */
pulse.ready(function() {
    
    function pausecomp(ms) {
        ms += new Date().getTime();
        while (new Date() < ms){}
    } 

    gb.player1score = 0;
    gb.lifeTotal = 3;
    gb.levelNum = 1;
  // Ratio of Box2D physics to pulse
  gb.Box2DFactor = 0.01;

    var lastFire = lastFire || 0;

    var contactListener = new Box2D.Dynamics.b2ContactListener;

    contactListener.BeginContact = function(contact) {
        if ((typeof contact.GetFixtureA().GetBody()._node !== 'undefined') && (typeof contact.GetFixtureB().GetBody()._node !== 'undefined')
            && (typeof gb.playerShip !== 'undefined')) {
            var nodeA = contact.GetFixtureA();  //.GetBody()._node;
            var nodeB = contact.GetFixtureB();  //.GetBody()._node;
            
            // check that colliding bodies are not missile and playerShip
            if (!((nodeA.GetBody()._node.size.height == 50) && (nodeB.GetBody()._node.size.height == 60) ||
                  (nodeA.GetBody()._node.size.height == 60) && (nodeB.GetBody()._node.size.height == 50))) {
                if (gb.playerShip) {
                    var explodeA = new gb.explode(nodeA, shipLayer, gb.playerShip);
                }// alert("here");
                if (gb.playerShip) {
                    var explodeB = new gb.explode(nodeB, shipLayer, gb.playerShip);
                }
                else {
                    var explodeB = new gb.explode(nodeB, shipLayer, null);
                }
                // alert("there");
            }
        }
    };

      pulse.physics.WORLD.SetContactListener(contactListener);

  /**
   * Create Box2D bounding box to learn more about Box2D Javascript
   * check out https://github.com/thinkpixellab/pl
   */
  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-10000.0, -10000.0);
  worldAABB.upperBound.Set(10000.0, 10000.0);

  // Setup gravity vector and world for Box2D
   var gravity = new b2Vec2(0.0, 0);
   var world = new b2World(worldAABB, gravity, true);

  //  world.SetContactListener(contactListener);
  //Zero gravity.  This is space!
    pulse.physics.WORLD.SetGravity(new Box2D.Common.Math.b2Vec2(0, 0));

    // The base engine object for this demo with passed in id of game div
  var engine = new pulse.Engine({ 
    gameWindow: 'gameWindow', size: {width: 800, height: 600}});

  // The main scene for the demo
  var scene = new pulse.Scene();

  var bg1 = new pulse.Layer({size: { width: 1024, height: 768 }, physics : { isEnabled: false }});
  bg1.anchor = { x: 0, y: 0 };
    bg1.position.x = -112;
    bg1.position.y = -84;

  // Level layer object extends from layer see layer.js
  var level = new gb.Level({size: {width: 1024, height: 768}, world: world });
      level.anchor = { x: 0, y: 0 };
      level.position.x = -112;
      level.position.y = -84;

  /**
   * The spaceship layer, she's on a separate layer so we don't redraw everything
   * when he moves
   */
  var shipLayer = new pulse.Layer({size: {width: 1024, height: 768}, physics : { isEnabled: false }});
      shipLayer.anchor = { x: 0, y: 0 };
      shipLayer.position.x = -112;
      shipLayer.position.y = -84;

      // Layer for the UI, text
      var uiLayer = new pulse.Layer({size: {width : 600, height: 400}, physics : { isEnabled: false }});
      uiLayer.position = {x: 300, y: 200};

      // Texture for the mountain and for the clouds
      var bg1Texture = new pulse.Texture( { filename: 'mountain.png' });
      //var bg2Texture = new pulse.Texture( { filename: 'clouds.png' });

  // Add 10 sprites to the background for multiple mountains and clouds
/*  for(var i = 0; i < 10; i++) {
    var bgTile = new pulse.Sprite( { src: bg1Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 700 * i - 1;
    
    bg1.addNode(bgTile);
    
    bgTile = new pulse.Sprite( { src: bg2Texture } );
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg2.addNode(bgTile);
  }*/
  // The ship, along with initialized position
    function createPlayerShip() {
      var playerShip = new gb.spaceship({
            b2world : pulse.physics.WORLD,  //world, //
            position : {
                x : 500,
                y : 650
            }
        });
      shipLayer.addNode(playerShip);
      playerShip._physics.body._node = playerShip;
      return playerShip;
  }
  
  function createStone() {
        switch (gb.levelNum) {
            case 1:
            case 4:
            case 7:
                alert('sdfswdf');
                stoneSize = "large";
            case 2:
            case 5:
            case 8:
                stoneSize = "medium";
            case 3:
            case 6:
            case 9:
                stoneSize = "small";
        }
        switch (gb.levelNum) {
            case 1:
            case 2:
            case 3:
                stoneSpeed = "slow";
            case 4:
            case 5:
            case 6:
                stoneSpeed = "moderate";
            case 7:
            case 8:
            case 9:
                stoneSpeed = "fast";
        }
        alert(gb.levelNum);
        var attackingStone = new gb.evilStone(stoneSize, stoneSpeed);
        shipLayer.addNode(attackingStone);
        attackingStone._physics.body._node = attackingStone;
        return attackingStone;
  }

    var playerShip2 = new gb.spaceship({
        b2world : pulse.physics.WORLD,  //world, //
        position : {
            x : 200,
            y : 250
        }
    });
    shipLayer.addNode(playerShip2);
    playerShip2._physics.body._node = playerShip2;
//playerShip._physics.bodyDef.m
//    playerShip._physics.bodyDef.massData.mass = 2.0;
//    playerShip._physics.bodyDef.massData.center.SetZero();
//    playerShip._physics.bodyDef.massData.I = Number.POSITIVE_INFINITY;

  // Setup UI
  //var font = new pulse.BitmapFont({filename:'eboots.fnt'});
  //var l = new pulse.BitmapLabel({font: font, text: 'Built With Pulse'});
  //l.position = {x: 5, y: 5};
  //l.anchor = {x: 0, y: 0};
  //uiLayer.addNode(l);

  // Add the layers to our scene
  // scene.addLayer(bg2);
  scene.addLayer(bg1);
  scene.addLayer(level);
  scene.addLayer(shipLayer);
  scene.addLayer(uiLayer);

  // Add the scene to the engine scene manager and activate it
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var arrowLeft = false;
  var arrowRight = false;
  var arrowUp = false;
  var arrowDown = false;

  var speed = 0.15;
  
  //initX = 200;
  //initY = 200;
  //
  //  var explode1 = new gb.explosion({
  //      b2world : pulse.physics.WORLD,  //world, //
  //      position : {
  //          x : initX,
  //          y : initY
  //      }
  //  });
  //  shipLayer.addNode(explode1);
  //  explode1.runAction('exploding');

  /**
   * Updates the camera and parallax backgrounds based on position of ship
   */
  function updateCamera() {
/*    var nx = 300 - Math.max(playerShip.position.x, 300);
    var dx = level.position.x - nx;
    var ny = 200 - Math.min(playerShip.position.y, 600);
    var dy = level.position.y - ny;

    level.position.x -= dx;
    shipLayer.position.x -= dx;
    bg1.position.x -= dx / 2;
    //bg2.position.x -= dx / 3;

    level.position.y -= dy;
    shipLayer.position.y -= dy;
    bg1.position.y -= dy / 2;*/
    //bg2.position.y -= dy / 3;
  }

  /**
   * Update callback from engine on each update loop
   * @param  {pulse.SceneManager} sceneManager scene manager for the engine
   * @param  {Number} elapsed the time since last update loop
   */
  function update(sceneManager, elapsed) {
    
    // update the Box2D physics world
    world.Step(elapsed / 1000, 10);
    // if (gb.lifeTotal < 3) { pausecomp(5000); alert(typeof gb.playerShip);}
      if ((typeof gb.playerShip === 'undefined') || (gb.playerShip._physics.body == null) || (gb.playerShip.visible == false)) {  //(typeof gb.playerShip === 'undefined') || (typeof gb.playerShip === 'null')) {
          alert('make it');
          gb.playerShip = createPlayerShip();
      }
      if ((typeof gb.attackingStone === 'undefined') || (gb.attackingStone._physics.body == null) || (gb.attackingStone.visible == false)) {  //(typeof gb.playerShip === 'undefined') || (typeof gb.playerShip === 'null')) {
          //gb.attackingStone = createStone();
      }
       // var gb.playerShip = gb.playerShip;
       var newAngle = gb.playerShip._physics.body.GetAngle();
       var newXvec = gb.playerShip._physics.body.GetLinearVelocity().x;
       var newYvec = gb.playerShip._physics.body.GetLinearVelocity().y;
       var xAng = 0;
       var yAng = 0;
         if (arrowLeft) {
             xAng = 3.1415927;
             newXvec = -2;
         }
         if (arrowRight) {
             xAng = 2*3.1415927;
             newXvec = 2;
         }
         if (arrowDown) {
             yAng = 3.1415927/2;
             newYvec = 2;
         }
         if (arrowUp) {
             yAng = -3.1415927/2;
             newYvec = -2;
         }

         if (arrowLeft || arrowDown || arrowRight || arrowUp) {
             newAngle = (xAng + yAng);
             if (xAng * yAng != 0) {
                 newAngle /= 2;
                 if (!(arrowLeft && arrowDown)) {
                     newAngle += 3.1415927;
                 }
             }
             newAngle += (3.1415927/2);
         }

      gb.playerShip._physics.body.SetAngle(newAngle);
      gb.playerShip._physics.body.SetAwake(true);
      // Gives the ship a linear velocity in the direction on the move
      gb.playerShip._physics.body.SetLinearVelocity(new b2Vec2(newXvec, newYvec));

    // Update the camera based on the position of the ship
    // updateCamera();

    // If no arrow button is pressed than set the ship to Idle
    if(!arrowLeft && !arrowRight && !arrowDown && !arrowUp) {
      if(gb.playerShip.state == gb.spaceship.State.Running) {
        gb.playerShip.state = gb.spaceship.State.Idle;
      }
    }
  }

    var createMissile = function(pos, dir, lyr) {
        //var missile = "";
        if (((engine.masterTime - lastFire) > 300) || (lastFire == 0)) {
            var missile =        //new pulse.Sprite({
                new gb.Missile({ position: pos, direction: dir, layer: lyr, ship: gb.playerShip });
    //            src: 'brick_platform.png',
    //            physics: {
    //                basicShape : 'box'
    //            },
    //            size : { width: 35, height: 35 }
    //        });
            lyr.addNode(missile);
            missile._physics.body._node = missile;
            if (dir == 'left') {
                missile._physics.body.SetLinearVelocity(new b2Vec2(-1.8, 0));
            }
            else if (dir == 'right') {
                missile._physics.body.SetLinearVelocity(new b2Vec2(1.8, 0));
            }
            else if (dir == 'up') {
                missile._physics.body.SetLinearVelocity(new b2Vec2(0, -1.8));
            }
            else if (dir == 'down') {
                missile._physics.body.SetLinearVelocity(new b2Vec2(0, 1.8));
            }
            lastFire = engine.masterTime;
        }
        return missile;
    };

    /**
     * Binds the key down event on this scene
     * We keep the state of the button in side the handler
     */


  scene.events.bind('keydown', function(e) {
    
    
    if(e.keyCode == 37) {
      arrowLeft = true;
    }
    if(e.keyCode == 39) {
      arrowRight = true;
    }
    if(e.keyCode == 38) {
      arrowUp = true;
    }
    if(e.keyCode == 40) {
      arrowDown = true;
    }
    // Special cases
    if(e.keyCode == 13) {  // enter key
      // playerShip.state = gb.spaceship.State.Intro;
    }
    if(e.keyCode == 73) {  // i key
      // playerShip.state = gb.spaceship.State.Idle;
    }
    if(e.keyCode == 83) {  // s key
      // playerShip.state = gb.spaceship.State.Smile;
    }
    
    if ((gb.playerShip._physics.body !== 'undefined') && (gb.playerShip._physics.body !== 'null'))  {
        if(e.keyCode == 86) {  // v key - fire missile left
            //alert(JSON.stringify(playerShip._physics.body.GetPosition(), null, 4));
            var newMissile = createMissile(gb.playerShip._physics.body.GetPosition(), 'left', shipLayer);
            //missileGen._physics.body.ApplyImpulse(new b2Vec2(-8, 0), missileGen._physics.body.GetPosition());
        }
        if(e.keyCode == 66) {  // b key
            var missileGen = createMissile(gb.playerShip._physics.body.GetPosition(), 'up', shipLayer);
        }
        if(e.keyCode == 78) {  // n key
            var missileGen = createMissile(gb.playerShip._physics.body.GetPosition(), 'right', shipLayer);
        }
      // fire missile down with space key
      if(e.keyCode == 32) {
          var missileGen = createMissile(gb.playerShip._physics.body.GetPosition(), 'down', shipLayer);
      }
    }
  });

  /**
   * Update the state of the keys
   */
  scene.events.bind('keyup', function(e) {
        if ((typeof gb.playerShip !== 'undefined') && (typeof gb.playerShip !== 'null'))  {
            if(e.keyCode == 37) {
                gb.playerShip._physics.body.SetLinearVelocity(new b2Vec2(0, gb.playerShip._physics.body.GetLinearVelocity().y));
                arrowLeft = false;
            }
            if(e.keyCode == 39) {
                gb.playerShip._physics.body.SetLinearVelocity(new b2Vec2(0, gb.playerShip._physics.body.GetLinearVelocity().y));
                arrowRight = false;
            }
            if(e.keyCode == 38) {
                gb.playerShip._physics.body.SetLinearVelocity(new b2Vec2(gb.playerShip._physics.body.GetLinearVelocity().x, 0));
                arrowUp = false;
            }
            if(e.keyCode == 40) {
                gb.playerShip._physics.body.SetLinearVelocity(new b2Vec2(gb.playerShip._physics.body.GetLinearVelocity().x, 0));
                arrowDown = false;
            }
        }
  });

  // Start the game engine and tell it run at 48fps if possible
  engine.go(48, update);
});

function endGame() {
    alert("Game Over!  Click OK to play again.");
    window.location.reload();
}