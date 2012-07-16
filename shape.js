/**
 * Created with JetBrains WebStorm.
 * User: michael
 * Date: 7/12/12
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */
// Namespace declaration
var gb = gb || {};

/**
 * evilShape.class that handles moving and animating the shape
 */
gb.evilShape = pulse.Sprite.extend({
    /**
     * Initializes the shape
     * @param  {object} params parameters for the shape
     */
    init : function(params) {
        if (!params) {
            params = {};
        }

        switch (shapeType) {
            case 'circle':
                params.src = gb.evilCircle.texture;
            case 'triangle':
                params.src = gb.evilTriangle.texture;
            case 'square':
                params.src = gb.evilSquare.texture;
            case 'pentagon':
                params.src = gb.evilPentagon.texture;
        }

        this._super(params);

        // Initialize the anchor to bottom center
        this.anchor = {
            x:0.5,
            y:1.0
        };

        bigShapeSize = 60;
        mediumShapeSize = 40;
        smallShapeSize = 25;

        function getSizeVar(levelNum) {
            return switch (levelNum) {
                case 1:
                case 2:
                case 3:
                    bigShapeSize;
                case 4:
                case 5:
                case 6:
                    mediumShapeSize;
                case 7:
                case 8:
                case 9:
                    smallShapeSize;
            }
        }

        var sizeVar = getSizeVar(levelNum);

        this.size = {
            width:sizeVar,
            height:sizeVar
        };

        this.physics = {
            basicShape:'circle',
            isStatic:false,
            isEnabled:true
        };

        this.position = {
            x:params.position.x || 0,
            y:params.position.y || 0
        };

        // Set a frame rate for animations
        var animationFrameRate = 20;
        var _self = this;

        this.textureFrame.width = 55;
        this.textureFrame.height = 60;

        // Save the original frame
        this._private.oframe = {
            x:0,
            y:0,
            width:55,
            height:60
        };

        //Init states
        this.state = gb.evilShape.State.Idle;
        this._private.statePrevious = gb.evilShape.State.Idle;

        this.direction = gb.evilShape.Direction.Right;
        this._private.directionPrevious = gb.evilShape.Direction.Right;

        // Create animation for the beaming in intro
        var introAction = new pulse.AnimateAction({
            name:'intro',
            size:{width:55, height:60},
            bounds:{x:2000, y:60},
            frames:[22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 24, 25, 26, 27, 28, 29],
            frameRate:animationFrameRate,
            plays:1
        });

        // When animation is complete set state back to Idle
        introAction.events.bind('complete', function () {
            _self.state = gb.evilShape.State.Idle;
        });

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
     * Resets all animations on the shape
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

        // If the shape is jumping make sure the correct state is set
        if(this.b2body.GetLinearVelocity().y > 0.01 ||
            this.b2body.GetLinearVelocity().y < -0.01) {
            if(this.state != gb.evilShape.State.Intro) {
                this.state = gb.evilShape.State.Jumping;
            }
        } else {
            // Jump complete or wasn't jumping, check if was jumping and update
            // state accordingly
            this.b2body.SetLinearVelocity(new b2Vec2(this.b2body.GetLinearVelocity().x, 0));
            if(this.state == gb.evilShape.State.Jumping) {
                this.state = gb.evilShape.State.Idle;
            }
        }

        // Check if shape has changed state
        if(this.state != this._private.statePrevious) {
            this.updateState(this.state);
            this._private.statePrevious = this.state;
        }

        // Check if shape is pointed in a new direction
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
            case gb.evilShape.State.Idle:
                this.textureFrame = this._private.oframe;
                this.updated = true;
                break;
/*            case gb.evilShape.State.Intro:
                this.runAction('intro', this._private.oframe);
                break;
            case gb.evilShape.State.Running:
                this.runAction('running', this._private.oframe);
                break;
            case gb.evilShape.State.Jumping:
                this.runAction('jumping');
                break;
            case gb.evilShape.State.Smile:
                this.runAction('smile', this._private.oframe);
                break;*/
        }
    }

});

// Static member to hold possible states
gb.evilShape.State = {};
/*gb.evilShape.State.Idle = 'idle';
gb.evilShape.State.Intro = 'intro';
gb.evilShape.State.Running = 'running';
gb.evilShape.State.Jumping = 'jumping';
gb.evilShape.State.Smile = 'smiling';*/

// Static member to hold possible spin directions (Right = clockwise)
gb.evilShape.Direction = {};
gb.evilShape.Direction.Right = 1;
gb.evilShape.Direction.Left = -1;

gb.evilCircle.texture = new pulse.Texture({filename: 'evilCircle.png'});
gb.evilSquare.texture = new pulse.Texture({filename: 'evilSquare.png'});
gb.evilTriangle.texture = new pulse.Texture({filename: 'evilTriangle.png'});
gb.evilPentagon.texture = new pulse.Texture({filename: 'evilPentagon.png'});