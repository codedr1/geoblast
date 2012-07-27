var gb = gb || { };

gb.Missile = pulse.Sprite.extend({
   init : function(params){
       params = params || {};

       var theShip = params.ship;

       // this.worldBounds = params.bounds;

       // var layer = params.layer;

       params.src = 'brick_platform.png';
       params.size = {width: 50, height: 50};
       params.physics = {
           basicShape : 'box'
       };

       this._super(params);

       //ensure missile starts off ship
        var xAlt = 0;
        var yAlt = 0;
        switch(params.direction) {
            case 'left': xAlt = -((params.size.width+theShip.size.width)/2 + 1)*gb.Box2DFactor;
                break;
            case 'right': xAlt = ((params.size.width+theShip.size.width)/2 + 1)*gb.Box2DFactor;
                break;
            case 'up': yAlt = -((params.size.height+theShip.size.height)/2 + 1)*gb.Box2DFactor;
                break;
            case 'down': yAlt = ((params.size.height+theShip.size.height)/2 + 1)*gb.Box2DFactor;
                break;
        }

       this.position = {
           x : Math.round((params.position.x + xAlt) / gb.Box2DFactor),
           y : Math.round((params.position.y + yAlt
               //+ this.b2body.h / 2
               )  / gb.Box2DFactor)
       };
/*
       var b2BodyDef = new Box2D.Dynamics.b2BodyDef();
       b2BodyDef.position.Set(this.position.x, this.position.y);*/

/*       var bodyDef = new b2BodyDef();
       //var bw = Math.floor(0.636363636 * this.size.width) * gb.Box2DFactor;
       //var bh = Math.floor(0.716666667 * this.size.height) * gb.Box2DFactor;
       bodyDef.position.Set(
           this.position.x * gb.Box2DFactor,
           this.position.y * gb.Box2DFactor  //+ bw / 2
       );
       bodyDef.massData.mass = 2.0;
       bodyDef.massData.center.SetZero();
       bodyDef.massData.I = Number.POSITIVE_INFINITY;*/



/*       function log(msg) {
           setTimeout(function() {
               throw new Error(msg);
           }, 0);
       }

       for (i in params) {
           log(i + ": " + JSON.stringify(params[i]));
       }*/
       //alert(JSON.stringify(params.direction, null, 4));

       //this.b2body = pulse.physics.WORLD.CreateBody(bodyDef);

       // this._physics.b2body.WakeUp();

   },
     update : function(elapsed) {

/*       this.position = {
           x : Math.round(this.b2body.GetPosition().x / gb.Box2DFactor),
           y : Math.round((this.b2body.GetPosition().y
               //+ this.b2body.h / 2
               ) / gb.Box2DFactor) + 1
       };*/
         //

      this._super(elapsed);

  /*       if((this.position.x > this.parent.size.width) ||
             (this.position.x < 0) ||
             (this.position.y > this.parent.size.height) ||
             (this.position.y < 0)) {
             this.parent.removeNode(this);
         }*/

   }
});