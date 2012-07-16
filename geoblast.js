// Namespace declaration
var gb = gb || { };

/**
 * Pulse ready callback, makes sure the HTML content is loaded before starting
 * the game.
 */
pulse.ready(function() {
  // Ratio of Box2D physics to pulse
  gb.Box2DFactor = 0.01;

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
  //Zero gravity.  This is space, yo!
  world.SetGravity(new Box2D.Common.Math.b2Vec2(0, 0));

  // The base engine object for this demo with passed in id of game div
  var engine = new pulse.Engine({ 
    gameWindow: 'gameWindow', size: {width: 800, height: 600}});

  // The main scene for the demo
  var scene = new pulse.Scene();

  var bg1 = new pulse.Layer({size: { width: 1024, height: 768 }});
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
  var shipLayer = new pulse.Layer({size: {width: 1024, height: 768}});
      shipLayer.anchor = { x: 0, y: 0 };
      shipLayer.position.x = -112;
      shipLayer.position.y = -84;

  // Layer for the UI, text
  var uiLayer = new pulse.Layer({size: {width : 600, height: 400}});
  uiLayer.position = {x: 300, y: 200};

  // Texture for the mountain and for the clouds
  var bg1Texture = new pulse.Texture( { filename: 'mountain.png' });
  var bg2Texture = new pulse.Texture( { filename: 'clouds.png' });

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
  var playerShip = new gb.spaceship({
    b2world : world,
    position : {
      x : 500,
      y : 650
    }
  });
  shipLayer.addNode(playerShip);


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

  /**
   * Updates the camera and parallax backgrounds based on position of ship
   */
  function updateCamera() {
    var nx = 300 - Math.max(playerShip.position.x, 300);
    var dx = level.position.x - nx;
    var ny = 200 - Math.min(playerShip.position.y, 600);
    var dy = level.position.y - ny;

    level.position.x -= dx;
    shipLayer.position.x -= dx;
    bg1.position.x -= dx / 2;
    //bg2.position.x -= dx / 3;

    level.position.y -= dy;
    shipLayer.position.y -= dy;
    bg1.position.y -= dy / 2;
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
    
    /**
     * If the left arrow is down update the state of the ship if needed
     */
    if(arrowLeft) {
      if(playerShip.direction == gb.spaceship.Direction.Right) {
        playerShip.direction = gb.spaceship.Direction.Left;
      }
      if(playerShip.state != gb.spaceship.State.Jumping) {
        playerShip.state = gb.spaceship.State.Running;
      }
      // Box2d wake up call
      playerShip.b2body.WakeUp();
      // Gives the ship a linear velocity in the direction on the move
      playerShip.b2body.SetLinearVelocity(new b2Vec2(-2, playerShip.b2body.GetLinearVelocity().y));
    }
    
    /**
     * If the right arrow is down update the state of the ship if needed
     */
    if(arrowRight) {
      if(playerShip.direction == gb.spaceship.Direction.Left) {
        playerShip.direction = gb.spaceship.Direction.Right;
      }
      if(playerShip.state != gb.spaceship.State.Jumping) {
        playerShip.state = gb.spaceship.State.Running;
      }
      // Box2d wake up call
      playerShip.b2body.WakeUp();
      // Gives the ship a linear velocity in the direction on the move
      playerShip.b2body.SetLinearVelocity(new b2Vec2(2, playerShip.b2body.GetLinearVelocity().y));
    }

      /**
       * If the up arrow is down update the state of the ship if needed
       */
      if(arrowUp) {
          if(playerShip.direction !== gb.spaceship.Direction.Up) {
              playerShip.direction = gb.spaceship.Direction.Left;
          }
          if(playerShip.state != gb.spaceship.State.Jumping) {
              playerShip.state = gb.spaceship.State.Running;
          }
          // Box2d wake up call
          playerShip.b2body.WakeUp();
          // Gives the ship a linear velocity in the direction on the move
          playerShip.b2body.SetLinearVelocity(new b2Vec2(-2, playerShip.b2body.GetLinearVelocity().y));
      }

      /**
       * If the down arrow is down update the state of the ship if needed
       */
      if(arrowDown) {
          if(playerShip.direction == gb.spaceship.Direction.Left) {
              playerShip.direction = gb.spaceship.Direction.Right;
          }
          if(playerShip.state != gb.spaceship.State.Jumping) {
              playerShip.state = gb.spaceship.State.Running;
          }
          // Box2d wake up call
          playerShip.b2body.WakeUp();
          // Gives the ship a linear velocity in the direction on the move
          playerShip.b2body.SetLinearVelocity(new b2Vec2(2, playerShip.b2body.GetLinearVelocity().y));
      }

    // Update the camera based on the position of the ship
    updateCamera();

    // If the ship collides with a shape, explode, check lives and take appropriate action
    // TODO change to collision test
    if(playerShip.position.y > 2000) {
      // Box2d wake up call
      playerShip.b2body.WakeUp();
      // Set position and remove any linear velocity
      playerShip.b2body.SetXForm(new b2Vec2(50 * gb.Box2DFactor, 600 * gb.Box2DFactor), 0);
      playerShip.b2body.SetLinearVelocity(new b2Vec2(0, 0));
      // Set the ship's state to beam him in
      playerShip.state = gb.spaceship.State.Intro;
    }

    // If no arrow button is pressed than set the ship to Idle
    if(!arrowLeft && !arrowRight) {
      if(playerShip.state == gb.spaceship.State.Running) {
        playerShip.state = gb.spaceship.State.Idle;
      }
    }
  }

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
    // Jump with space key
    //TODO Change to fire missile
    if(e.keyCode == 32) {
      if(playerShip.state != gb.spaceship.State.Jumping) {
        playerShip.state = gb.spaceship.State.Jumping;
        // Apply an impulse in Box2D
        playerShip.b2body.ApplyImpulse(new b2Vec2(0, -8), playerShip.b2body.GetPosition());
      }
    }
  });

  /**
   * Update the state of the keys
   */
  scene.events.bind('keyup', function(e) {
    if(e.keyCode == 37) {
        playerShip.b2body.SetLinearVelocity(new b2Vec2(0, playerShip.b2body.GetLinearVelocity().y));
        arrowLeft = false;
    }
    if(e.keyCode == 39) {
        playerShip.b2body.SetLinearVelocity(new b2Vec2(0, playerShip.b2body.GetLinearVelocity().y));
        arrowRight = false;
    }
    if(e.keyCode == 38) {
        playerShip.b2body.SetLinearVelocity(new b2Vec2(playerShip.b2body.GetLinearVelocity().x, 0));
        arrowUp = false;
    }
    if(e.keyCode == 40) {
        playerShip.b2body.SetLinearVelocity(new b2Vec2(playerShip.b2body.GetLinearVelocity().x, 0));
        arrowDown = false;
    }
  });

  // Start the game engine and tell it run at 48fps if possible
  engine.go(48, update);
});

function endGame() {
    alert("Game Over!  Click OK to play again.");
    window.location.reload();
}