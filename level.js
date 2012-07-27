// Namespace declaration
var gb = gb || {};

/**
 * Platform brick class that handles placement, size and texture
 */
gb.Brick = pulse.Sprite.extend({
  /**
   * Initializes the brick
   * @param  {pulse.Texture} texture The texture to use for the brick
   * @param  {pulse.Layer} layer The layer the brick should be added to
   */
  init: function(texture, layer) {
    this.layer = layer;
    this._super( { src: texture });
    this.anchor = { x: 0, y: 0 };
    this.size = { width: gb.Brick.Size.width, height: gb.Brick.Size.height };
  },
  /**
   * Creates the Box2D body for this brick
   * @return {[type]}
   */
  createBody: function() {
    this.body = gb.createBody(
      { x: this.position.x,
        y: this.position.y,
        size: {
          width: gb.Brick.Size.width,
          height: gb.Brick.Size.height },
        physics: {
            basicShape: 'box',
            isStatic: true,
            isEnabled: true
        }
      },
        this.layer.world);

      return 0;
  }
});

// Creating brick textures and setting them to static members
gb.Brick.GroundTextureLeft = new pulse.Texture( { filename: 'brick_ground_left.png'} );
gb.Brick.GroundTextureRight = new pulse.Texture( { filename: 'brick_ground_right.png'} );
gb.Brick.PlatformTexture = new pulse.Texture( { filename: 'brick_platform.png'} );
gb.Brick.PlatformTextureLeft = new pulse.Texture( { filename: 'brick_platform_left.png'} );
gb.Brick.PlatformTextureRight = new pulse.Texture( { filename: 'brick_platform_right.png'} );
gb.Brick.GroundTexture = new pulse.Texture( { filename: 'brick_ground.png'} );
gb.Brick.GroundTopTexture = new pulse.Texture( { filename: 'ground_top.png'} );

// Setting the size for bricks as a static member
gb.Brick.Size = { width: 25, height: 25 };

/**
 * Level class that handles creating the platforms and ground chunks
 * @class Level
 */
gb.Level = pulse.Layer.extend({
  /**
   * Initializes the level based off of gb.Level.Layout
   * @param  {object} params parameter object
   * @config {b2World} world Box2D world
   */
  init: function(params) {
    
    this.world = params.world;
    
    this._super(params);
    
    for(var idx in gb.Level.Layout) {
      // Platform
      if(gb.Level.Layout[idx].p) {
        var platform = new gb.Platform(gb.Level.Layout[idx].p, this);
      }
      // Chunk
      else if(gb.Level.Layout[idx].c) {
        var chunk = new gb.Chunk(gb.Level.Layout[idx].c, this);
      }
    }
  }
});

/**
 * Static function for creating a platforms
 * @param  {object} params parameter object
 * @config {number} size The size, width and height, of the platform to create
 * @config {number} x The x position to start the platform
 * @config {number} y the y position to start the platform
 * @param {pulse.Layer} layer The layer to add the platform to
 */
gb.Platform = function(params, layer) {
  // loop through the width of the platform
  for(var i = 0; i < params.size.width; i++) {

    // determine the texture based on the position in the platform
    var texture = gb.Brick.PlatformTexture;
    if(i === 0) {
      texture = gb.Brick.PlatformTextureLeft;
    }
    else if (i == params.size.width - 1) {
      texture = gb.Brick.PlatformTextureRight;
    }
    
    // create a brick and set its position
    var brick = new gb.Brick(texture, layer);
    brick.position.x = (gb.Brick.Size.width - 1) * params.x + i * (gb.Brick.Size.width - 1);
    brick.position.y = layer.size.height - (gb.Brick.Size.height * params.y) - gb.Brick.Size.height;

    // add the brick to the layer
    layer.addNode(brick);
  }
  
  /**
   * Calculate the width, height, x, and y position of the Box2D body that
   * needs to be created
   */
  var width = (gb.Brick.Size.width - 1) * params.size.width;
  var height = (gb.Brick.Size.height - 1);
  var xPos = (gb.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - (gb.Brick.Size.height * params.y) - gb.Brick.Size.height + height / 2;

  // Create a single body to represent the platform
  gb.createBody({ x: xPos, y: yPos, size: {width: width, height: height}, physics: {basicShape: 'box',
      isStatic: true,
      isEnabled: true
  }}, layer.world);
};

/**
 * Static function for creating a chunk of land
 * @param  {object} params parameter object
 * @config {number} width The width of the chunk to create
 * @config {number} height The height of the chunk to create
 * @config {number} x The x position to start the chunk
 * @config {number} y the y position to start the chunk
 * @param {pulse.Layer} layer The layer to add the chunk to
 */
gb.Chunk = function(params, layer) {
  // Loop through the width and height of the chunk to create all the bricks
  for(var rowIdx = 0; rowIdx < params.size.width; rowIdx++) {
    for(var colIdx = 0; colIdx < params.size.height; colIdx++) {

      // Determine if the brick is on the top layer of the chunk
      var top = colIdx == params.size.height - 1;

      // Determine the texture based on location of the brick
      var texture = gb.Brick.GroundTexture;
      if(top) {
        texture = gb.Brick.GroundTopTexture;
      }
      else if(rowIdx === 0) {
        texture = gb.Brick.GroundTextureLeft;
      }
      else if(rowIdx == params.size.width - 1) {
        texture = gb.Brick.GroundTextureRight;
      }

      // Create new brick and set its position
      var brick = new gb.Brick(texture, layer);
      brick.position.y =
        layer.size.height -
        colIdx * (gb.Brick.Size.height - 1) -
        gb.Brick.Size.height;
      brick.position.x = (gb.Brick.Size.width - 1) * (params.x + rowIdx);

      // Add the brick to the layer
      layer.addNode(brick);
    }
  }
  
  /**
   * Calculate the width, height, x, and y position of the Box2D body that
   * needs to be created
   */
  var width = (gb.Brick.Size.width - 1) * params.size.width;
  var height = (gb.Brick.Size.height - 1) * params.size.height;
  var xPos = (gb.Brick.Size.width - 1) * params.x + width / 2;
  var yPos = layer.size.height - ((params.size.height) * (gb.Brick.Size.height - 1)) + height / 2;
  
  // Create a single body to represent the chunk
  gb.createBody({ x: xPos, y: yPos, size: {width: width, height: height}, physics: {basicShape: 'box',
            isStatic: true,
            isEnabled: true
    }}, layer.world);
};

/**
 * Helper static function for creating Box2D body
 * @config {number} width The width of the body to create
 * @config {number} height The height of the body to create
 * @config {number} x The x position of the body
 * @config {number} y the y position of the body
 * @param  {b2World} world The Box2D world to add the body to
 * @return {b2Body}
 */
gb.createBody = function(params, world) {
  // Box2D body definition and shape definition creation
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(params.x * gb.Box2DFactor, params.y * gb.Box2DFactor);
  var body = world.CreateBody(bodyDef);
  var shapeDef = new b2PolygonDef();
  shapeDef.restitution = 0.0;
  shapeDef.friction = 0.0;
  shapeDef.density = 2.0;
  shapeDef.SetAsBox(
    (params.size.width * gb.Box2DFactor) / 2,
    (params.size.height * gb.Box2DFactor) / 2);
  body.CreateShape(shapeDef);

  return 0;
};

/**
 * Static list of the layout for the level for the demo
 * @type {Array}
 */
gb.Level.Layout = [
 // Chunks - the ground
// L
 
 
 // Platforms
 { p: { size: {width: 4}, x: 6, y: 5}}    // a
// q
];