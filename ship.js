// Namespace declaration
var gb = gb || {};

/**
 * spaceship.class that handles moving and animating the ship
 */
gb.spaceship = pulse.Sprite.extend({
  /**
   * Initializes the ship
   * @param  {object} params parameters for the ship
   */
  init : function(params) {
    if(!params) {
      params = {};
    }
    params.src = gb.spaceship.texture;
    
    this._super(params);

    // Initialize the anchor to bottom center
    this.anchor = {
      x : 0.5,
      y : 1.0
    };

    this.size = {
      width : 55,
      height : 60
    };

    this.physics = {
          basicShape: 'circle',
              isStatic: false,
              isEnabled: true
    };

    this.position = {
      x : params.position.x || 0,
      y : params.position.y || 0
    };

    // Set a frame rate for animations
    var animationFrameRate = 20;
    var _self = this;

    this.textureFrame.width = 55;
    this.textureFrame.height = 60;

    // Save the original frame
    this._private.oframe = {
      x: 0,
      y: 0,
      width : 55,
      height : 60
    };

    //Init states
    this.state = gb.spaceship.State.Idle;
    this._private.statePrevious = gb.spaceship.State.Idle;

    this.direction = gb.spaceship.Direction.Right;
    this._private.directionPrevious = gb.spaceship.Direction.Right;

    // Create animation for the beaming in intro
    var introAction = new pulse.AnimateAction({
      name : 'intro',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [22,22,22,22,22,22,22,22,22,22,22,23,24,25,26,27,28,29],
      frameRate : animationFrameRate,
      plays : 1
    });
    
    // When animation is complete set state back to Idle
    introAction.events.bind('complete', function(){
      _self.state = gb.spaceship.State.Idle;
    });

    // Add the animation
    this.addAction(introAction);

    // Create animation for running
    var runningAction = new pulse.AnimateAction({
      name : 'running',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [7,8,9,10,11,12,13,14,15,16],
      frameRate : animationFrameRate
    });

    // Add the animation
    this.addAction(runningAction);

    // Create animation for jumping
    var jumpAction = new pulse.AnimateAction({
      name : 'jumping',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [17,18,19,20,21],
      frameRate : animationFrameRate,
      plays : 1
    });

    // Add the animation
    this.addAction(jumpAction);

    // Create animation for the head twitch smile thingy
    var smileAction = new pulse.AnimateAction({
      name : 'smile',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [1,2,3,4,5,6],
      frameRate : animationFrameRate,
      plays : 1
    });

    // When animation is complete set state back to Idle
    smileAction.events.bind('complete', function(){
      _self.state = gb.spaceship.State.Idle;
    });

    // Add the animation
    this.addAction(smileAction);

    // setup physics body
    this._private.b2world = params.b2world;

    var bodyDef = new b2BodyDef();
    var bw = Math.floor(0.636363636 * this.size.width) * gb.Box2DFactor;
    var bh = Math.floor(0.716666667 * this.size.height) * gb.Box2DFactor;
    bodyDef.position.Set(
      this.position.x * gb.Box2DFactor,
      this.position.y * gb.Box2DFactor + bw / 2
    );
    bodyDef.massData.mass = 2.0;
    bodyDef.massData.center.SetZero();
    bodyDef.massData.I = Number.POSITIVE_INFINITY;

    this.b2body = this._private.b2world.CreateBody(bodyDef);
    this.b2body.w = bw;
    this.b2body.h = bh;
    
    var shapeDef = new b2PolygonDef();
    shapeDef.SetAsBox(bw / 2, bh / 2);
    shapeDef.restitution = 0.0;
    shapeDef.density = 2.0;
    shapeDef.friction = 0.0;

    this.b2body.CreateShape(shapeDef);
  },

  /**
   * Resets all animations on the ship
   */
  reset : function() {
    for(var n in this.runningActions) {
      this.runningActions[n].stop();
    }
  },

  /**
   * Update function that runs on every update loop, we updated positions and
   * check for any change in state to react to it
   * @param  {number} elapsed the time elapsed since last update
   */
  update : function(elapsed) {

    // Set position based on the Box2D body position
    this.position = {
      x : Math.round(this.b2body.GetPosition().x / gb.Box2DFactor),
      y : Math.round((this.b2body.GetPosition().y + this.b2body.h / 2) / gb.Box2DFactor) + 1
    };

    // If the ship is jumping make sure the correct state is set
    if(this.b2body.GetLinearVelocity().y > 0.01 ||
       this.b2body.GetLinearVelocity().y < -0.01) {
      if(this.state != gb.spaceship.State.Intro) {
        this.state = gb.spaceship.State.Jumping;
      }
    } else {
      // Jump complete or wasn't jumping, check if was jumping and update
      // state accordingly
      this.b2body.SetLinearVelocity(new b2Vec2(this.b2body.GetLinearVelocity().x, 0));
      if(this.state == gb.spaceship.State.Jumping) {
        this.state = gb.spaceship.State.Idle;
      }
    }

    // Check if ship has changed state
    if(this.state != this._private.statePrevious) {
      this.updateState(this.state);
      this._private.statePrevious = this.state;
    }

    // Check if ship is pointed in a new direction
    if(this.direction != this._private.directionPrevious) {
      this.scale.x = this.direction;
      this._private.directionPrevious = this.direction;
    }

    this._super(elapsed);
  },

  /**
   * Updating animations based on change in state
   * @param  {string} state The new state
   */
  updateState : function(state) {
    this.reset();

    switch(state) {
      case gb.spaceship.State.Idle:
        this.textureFrame = this._private.oframe;
        this.updated = true;
        break;
      case gb.spaceship.State.Intro:
        this.runAction('intro', this._private.oframe);
        break;
      case gb.spaceship.State.Running:
        this.runAction('running', this._private.oframe);
        break;
      case gb.spaceship.State.Jumping:
        this.runAction('jumping');
        break;
      case gb.spaceship.State.Smile:
        this.runAction('smile', this._private.oframe);
        break;
    }
  }

});

// Static member to hold possible states
gb.spaceship.State = {};
gb.spaceship.State.Idle = 'idle';
gb.spaceship.State.Intro = 'intro';
gb.spaceship.State.Running = 'running';
gb.spaceship.State.Jumping = 'jumping';
gb.spaceship.State.Smile = 'smiling';

// Static member to hold possible directions
gb.spaceship.Direction = {};
gb.spaceship.Direction.Right = 1;
gb.spaceship.Direction.Left = -1;

// Static member to hold texture atlas for the ship
gb.spaceship.texture = new pulse.Texture({filename: 'ship.png'});