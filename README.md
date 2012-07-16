Geoblast dev plan
-----------------

Geoblast is being built with [Pulse].

Graphics:

1) a spaceship (height 40px, width 40px) and a version of the spaceship with a force field around it (to fit within 45px from the spaceship's center)
2) four different shapes, with large (fits in 50x50), medium (fits in 40x40), and small (fits in 25x25) sizes of each.  The shapes are:

   - square
   - circle
   - triangle
   - pentagon

3) three sizes (fitting in 25x25, 40x40, and 60x60) of fireballs with different shapes (or maybe explosion animations instead).
4) a missile (30x8)
5) a 1024x768 star field (black sky with stars in random locations).

The framerate will be 48fps.

Gameplay:

The game will be played within a canvas that will be 800x600 (the star field will move around if moving layers slowly does not strain the browser too much).  The spaceship will be able to fly and shoot missiles in any direction while shapes come from different directions and try to collide with it.  One collision will destroy the spaceship.  The player will start with three spaceships ("lifes").
 
In Level 1, the shapes will be large and move slowly.  
In Level 2, the shapes will be medium size and move slowly.  
In Level 3, the shapes will be small and move slowly.  
In Level 4, the shapes will be large and move at medium speed.  
In Level 5, the shapes will be medium size and move at medium speed.  
In Level 6, the shapes will be small and move at medium speed.  
In Level 7, the shapes will be large and move quickly.  
In Level 8, the shapes will be medium size and move quickly.  
In Level 9, the shapes will be small and move quickly.  

In each level, shapes will be worth 100 points.  To get to the next level requires destroying 30 shapes in a row (without a collision).  Force fields will be awarded after the player destroys A shapes in a row, and they're good for C collisions or 10 shape kills, whichever comes first.  For levels 1, 2, and 3, A=20 and C=1.  For levels 4, 5, and 6, A=18 and C=2.  For levels 7, 8, and 9, A=15 and C=3.

A new spaceship "life" will be awarded at 20,000-point intervals.

[Pulse]: http://www.withpulse.com/