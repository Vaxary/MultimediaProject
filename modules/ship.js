import {getShotsDiv, move_player} from "./gamelogic.js";
import {cloneProjectile, getProjWidth, getShootInterval, setShootInterval} from "./projectile.js";

export function setShip(ship) {
    self.ship = ship
}

export function getShip() {
    return self.ship
}

export function setShipLoaded(ship_loaded) {
    self.ship_loaded = ship_loaded
}

export function isShipLoaded() {
    return self.ship_loaded
}

export function setShipHeight(ship_height) {
    self.ship_height = ship_height
}

export function getShipHeight() {
    return self.ship_height
}

export function setShipWidth(ship_width) {
    self.ship_width = ship_width
}

export function getShipWidth() {
    return self.ship_width
}

export function setShipShielded(ship_shielded) {
    self.ship_shielded = ship_shielded
}

export function isShipShielded() {
    return self.ship_shielded
}

export function setShipHit(ship_hit) {
    self.ship_hit = ship_hit
}

export function isShipHit() {
    return self.ship_hit
}

export function add_ship_eventhandlers() {
    $(window).on('mousemove', move_player);
    $(window).on('mousedown', function (event) {
        if (event.which===1) {
            if (getShootInterval()===0) {
                setShootInterval(setInterval(shoot_projectile, 125))
            }
        }
    });
    $(window).on('keydown', function (event) {
        if (parseInt(event.keyCode)===32) {
            if (getShootInterval()===0) {
                setShootInterval(setInterval(shoot_projectile, 125))
            }
        }
    });
    $(window).on('mouseup', function (event) {
        if (event.which===1) {
            if (getShootInterval() !== 0) {
                clearInterval(getShootInterval())
            }
            setShootInterval(0)
        }
    });
    $(window).on('keyup ', function (event) {
        if (event.keyCode===32) {
            if (getShootInterval() !== 0) {
                clearInterval(getShootInterval())
            }
            setShootInterval(0)
        }
    });
}

function shoot_projectile() {
    if (!isShipHit()) {
        getShotsDiv().append($(cloneProjectile()).css({
            left: Math.ceil(parseInt($(getShip()).css("left"))+getShipWidth()/2-getProjWidth()/2)
        }))
    }
}

export function register_ship_hit() {
    console.log("Ship hit")
    setShipShielded(true)
    setShipHit(true)
    $(getShip()).attr({src: "../assets/spaceshiphit.gif"})
    setTimeout(function () {
        $(getShip()).attr({src: "../assets/spaceshipshielded.png"})
        setShipHit(false)
    }, 1000)
    setTimeout(function () {
        $(getShip()).attr({src: "../assets/spaceship.png"})
        setShipShielded(false)
    }, 4000)
}