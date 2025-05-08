import {getShip, getShipHeight, getShipWidth} from "./ship.js";
import {getGameSpaceHeight} from "./gamelogic.js";
import {
    getProjectileBase,
    getProjHeight,
    getProjTop,
    getProjWidth,
    setProjHeight,
    setProjTop,
    setProjWidth
} from "./projectile.js";
import {
    addAsteroidStateFrame,
    addDestroyedAsteroidFrame,
    getAsteroidBase, getDestroyedAsteroidStateFrame,
    replaceDestroyedAsteroidFrame
} from "./asteroid.js";

export function initialization() {
    init_player()
    init_projectile()
    init_meteorite()
}

function init_projectile() {
    setProjWidth(8);
    setProjHeight(24);
    setProjTop(getGameSpaceHeight()-getShipHeight()-50);
    $(getProjectileBase()).css({
        top: getProjTop(),
        height: getProjHeight(),
        width: getProjWidth()})
}

function init_player() {
    $(getShip()).attr({hp:3})
    $(getShip()).css({
        height: getShipHeight(),
        width: getShipWidth()
    });
    $(getShip()).css({top:getGameSpaceHeight()-getShipHeight()-50});
}

function init_meteorite() {
    $(getAsteroidBase()).css({
        top: -100,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
    for (let i=1; i <= 6; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid"+i+".png"
        addAsteroidStateFrame(frame)
    }

    for (let i=1; i <= 8; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid_destroyed"+i+".png"
        addDestroyedAsteroidFrame(frame)
    }
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(0),50],0)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(1),40],1)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(2),30],2)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(3),30],3)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(4),30],4)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(5),40],5)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(6),40],6)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(7),50],7)
}