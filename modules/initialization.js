import {setProjHeight, setProjWidth, setProjTop} from "./projectile.js";
import {gamespace_height} from "./values.js";
import {ship, ship_height, ship_width} from "./ship.js";
import {
    addAsteroidStateFrame,
    addDestroyesAsteroidFrame,
    asteroid_base,
    destroyed_asteroid_frames,
    replaceDestroyesAsteroidFrame
} from "./asteroid.js";


function initialization() {
    init_player()
    init_projectile()
    init_meteorite()
}

function init_projectile() {
    setProjWidth(8);
    setProjHeight(24);
    setProjTop(gamespace_height-ship_height-50);
    $(projectile_base).css({
        top: proj_top,
        height: proj_height,
        width: proj_width})
}

function init_player() {
    $(ship).attr({hp:3})
    $(ship).css({
        height: ship_height,
        width: ship_width
    });
    $(ship).css({top:gamespace_height-ship_height-50});
}

function init_meteorite() {
    $(asteroid_base).css({
        top: -21,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
    for (let i=1; i <= 5; i++) {
        let frame=new Image()
        frame.src="assets/asteroid"+(i+1)+".png"
        addAsteroidStateFrame(frame)
    }

    for (let i=1; i <= 8; i++) {
        let frame=new Image()
        frame.src="assets/asteroid_destroyed"+(i+1)+".png"
        addDestroyesAsteroidFrame(frame)
    }
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[0],50],0)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[1],40],1)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[2],30],2)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[3],30],3)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[4],30],4)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[5],40],5)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[6],40],6)
    replaceDestroyesAsteroidFrame([destroyed_asteroid_frames[7],50],7)
}