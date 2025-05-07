import {move_player} from "./gamelogic.js";
import {cloneProjectile, setShootInterval, shootInterval} from "./projectile.js";

export let ship, ship_height, ship_width, ship_shielded=false, ship_hit=false, ship_loaded=false

export function setShip(ship) {
    self.ship = ship
}

export function setShipLoaded(ship_loaded) {
    self.ship_loaded = ship_loaded
}

export function setShipHeight(ship_height) {
    self.ship_height = ship_height
}

export function setShipWidth(ship_width) {
    self.ship_width = ship_width
}

export function setShipShielded(ship_shielded) {
    self.ship_shielded = ship_shielded
}

export function setShipHit(ship_hit) {
    self.ship_hit = ship_hit
}

export function add_ship_eventhandlers() {
    $(window).on('mousemove', move_player);
    $(window).on('mousedown', function (event) {
        if (event.which===1) {
            if (shootInterval===0) {
                setShootInterval(setInterval(shoot_projectile, 125))
            }
        }
    });
    $(window).on('keydown', function (event) {
        if (parseInt(event.keyCode)===32) {
            if (shootInterval===0) {
                setShootInterval(setInterval(shoot_projectile, 125))
            }
        }
    });
    $(window).on('mouseup', function (event) {
        if (event.which===1) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            setShootInterval(0)
        }
    });
    $(window).on('keyup ', function (event) {
        if (event.keyCode===32) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            setShootInterval(0)
        }
    });
}

function shoot_projectile() {
    if (!ship_hit) {
        shotsdiv.append($(cloneProjectile()).css({
            left: Math.ceil(parseInt($(ship).css("left"))+ship_width/2-proj_width/2)
        }))
    }
}

export function register_ship_hit() {
    console.log("Ship hit")
    ship_shielded=true
    ship_hit=true
    $(player).attr({src: "spaceshiphit.gif"})
    setTimeout(function () {
        $(player).attr({src: "spaceshipshielded.png"})
        ship_hit=false
    }, 1000)
    setTimeout(function () {
        $(player).attr({src: "spaceship.png"})
        ship_shielded=false
    }, 4000)
}