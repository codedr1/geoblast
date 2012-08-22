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
        }
        params.src = gb.explosion.texture;
        params.physics = {
            basicShape : 'box',
            isEnabled : false,
            isStatic : true
        };

        this._super(params);

        // Initialize the anchor to bottom center
        this.anchor = {
            x : 0.5,
            y : 0.5
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
        var animationFrameRate = 48;
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

        var explodeAction = new pulse.AnimateAction({
            name : 'exploding',
            size : {width:42, height:42},
            bounds : {x: 42, y: 42},
            frames : [1,1,1],
            frameRate : animationFrameRate,
            plays : 1
        });

        //TODO change filename to explosion png
        gb.explosion.texture = new pulse.Texture({filename: 'explosionsmall.png'});

        // Add the animation
        this.addAction(explodeAction);
    }
});

gb.explode = function(explodingObject, layer, ship) {
    // var d = 0;
    var explodingBody = explodingObject.GetBody();
    var initX = explodingBody._node.position.x;
    var initY = explodingBody._node.position.y;

    //flag for collision
    var collision = false;

if ((ship != null) && (initX == ship.position.x) && (initY == ship.position.y)) {
        explosionSize = "small";
        collision = true;
        // explodingBody.SetPosition(2000, 2000);
  //      layer.removeNode(explodingBody._node.name);  //
        delete gb.playerShip;
       // ship.visible = false;
        layer.removeNode(explodingBody._node);
        // ._physics.body.SetAwake(false);
        // ship._physics.body.SetLinearVelocity(new b2Vec2(0, 0));
//        ship.physics.isEnabled = false;
//        ship.physics.isStatic = true;
        // layer.removeNode(ship);
    }
    else {
        switch (gb.levelNum) {
            case 1:
            case 4:
            case 7:
                explosionSize = "small";
            case 2:
            case 5:
            case 8:
                explosionSize = "medium";
            case 3:
            case 6:
            case 9:
                explosionSize = "large";
        }
    }

    var explode1 = new gb.explosion({
        b2world : pulse.physics.WORLD,  //world, //
        position : {
            x : initX,
            y : initY
        }
    });
    layer.addNode(explode1);
    explode1.runAction('exploding');  //('explosion'+explosionSize, gb.explosion._private.oframe);
    if ((gb.lifeTotal >= 0) && (collision == true)) {
        gb.lifeTotal -= 1;
        // Set the ship's state to beam her in
        // playerShip.state = gb.spaceship.State.Intro;
        alert("Next life!");
//        layer.addNode(explodingBody._node);
//        explodingBody._node._physics.body.GetPosition();
        // explodingBody._node._physics.body.SetPosition();
    }
    else if (collision == true) {
        endGame();
    }
    else {
        gb.player1score += 100;
    }
}