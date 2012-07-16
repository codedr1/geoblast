/**
 * Created with JetBrains WebStorm.
 * User: michael
 * Date: 7/12/12
 * Time: 9:49 AM
 * To change this template use File | Settings | File Templates.
 */

var gb = gb || {};

gb.explosion = pulse.Sprite.extend({
    /**
     * Initializes the ship
     * @param  {object} params parameters for the explosion
     */
    init : function(params) {
        if(!params) {
            params = {};
        };
        params.src = gb.explosion.texture;

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
    }
});

var explodeAction = new pulse.AnimateAction({
    name : 'exploding',
    size : {width:55, height:60},
    bounds : {x: 2000, y: 60},
    frames : [7,8,9,10,11,12,13,14,15,16],
    frameRate : animationFrameRate
});

//TODO change filename to explosion png
gb.explosion.texture = new pulse.Texture({filename: 'ship.png'});

// Add the animation
this.addAction(explodeAction);

function explode(spriteID) {
    var initX = spriteID.position.x;
    var initY = spriteID.position.y;

    //flag for collision
    var collision = false;

    //put sprite in position out of view
    spriteID.position.x = 2000;
    spriteID.position.y = 2000;

    if ((spriteID.position.x == gb.spaceship.position.x) && (spriteID.position.y == gb.spaceship.position.y)) {
        explosionSize = "medium";
        collision = true;
    }
    else {
        switch (levelNum) {
            case 1,4,7:
                explosionSize = "small";
            case 2,5,8:
                explosionSize = "medium";
            case 3,6,9:
                explosionSize = "large";
        }
    }
    this.runAction('explosion'+explosionSize, this._private.oframe);
    if ((spareLives > 0) && (collision == true)) {
        lifeTotal -= 1;
        // Set the ship's state to beam her in
        playerShip.state = gb.spaceship.State.Intro;
    }
    else if (collision == true) {
        endGame();
    }
    else {
        var shapePick = math.random()*5-1;
        switch (shapePick) {
            case 0 : attackingShape = new gb.evilSquare;
            case 1 : attackingShape = new gb.evilTriangle;
            case 2 : attackingShape = new gb.evilPentagon;
            case 3 : attackingShape = new gb.evilCircle;
        }
    }
}