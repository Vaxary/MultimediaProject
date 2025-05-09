import {
    getGameSpace, getGameSpaceHeight, getPauseButton,
    getShotsDiv, pauseGame, updateShipHpBox
} from "./gamelogic.js";
import {cloneProjectile, getProjWidth} from "./projectile.js";

self.ship_states=[]
self.destroyed_ship_frames=[]
self.ship_hp_indicator_icons=[]

export class Ship {
    constructor() {
        this.$ship=$("<img src='../assets/spaceship.png' alt='player spaceship' id='player'>")
        console.log(this.$ship)
        this.hp=1
        this.planethp=10
        this.score=0
        this.shielded=false
        this.hit=false
        this.pos=0
        this.loaded=false
        this.width=0
        this.height=0
        this.top=0
        this.shootinterval=0
        this.animframe=0
        this.animtime=0
        this.animtimeout=0
    }

    updateSizeAndPos() {
        this.width=this.$ship.width()*4
        this.height=this.$ship.height()*4
        this.top=getGameSpaceHeight()-this.height-50
        this.$ship.css({
            width: this.width,
            height: this.height,
            top: this.top
        })
    }

    enableShipEventhandlers() {
        $(window).on('mousemove', e => getShip().move(e))

        $(window).on('mousedown', function (event) {
            if (event.which===1) {
                if (getShip().shootinterval===0) {
                    getShip().shootinterval=setInterval(function () {
                        getShip().shootProjectile()
                    }, 125)
                }
            }
        });
        $(window).on('keydown', function (event) {
            if (parseInt(event.keyCode)===32) {
                if (getShip().shootinterval===0) {
                    getShip().shootinterval=setInterval(function () {
                        getShip().shootProjectile()
                    }, 125)
                }
            }
        });
        $(window).on('mouseup', function (event) {
            if (event.which===1) {
                if (getShip().shootinterval !== 0) {
                    clearInterval(getShip().shootinterval)
                    getShip().shootinterval=0
                }
            }
        });
        $(window).on('keyup ', function (event) {
            if (event.keyCode===32) {
                if (getShip().shootinterval !== 0) {
                    clearInterval(getShip().shootinterval)
                    getShip().shootinterval=0
                }
            }
        });
    }

    disableShipEventhandlers() {
        $(window).off('mousemove mousedown mouseup keydown keyup')
    }

    startShipHitAnimation(fromframe=0) {
        this.animframe=fromframe
        this.animtime=0
        if (fromframe < 10) {
            this.$ship.attr({src: self.ship_states[fromframe%2].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipHitAnimation(fromframe+1)
            }, 100)
        } else {
            this.hit=false
            this.$ship.attr({src: self.ship_states[2].src})
            this.animtimeout=setTimeout(function () {
                getShip().$ship.attr({src: self.ship_states[0].src})
                getShip().shielded=false
            }, 4000)
        }
    }

    continueShipHitAnimation() {
        if (this.animframe < 10) {
            this.$ship.attr({src: self.ship_states[this.animframe%2].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipHitAnimation(getShip().animframe+1)
            }, 100-getShip().animtime)
        } else {
            this.hit=false
            this.$ship.attr({src: self.ship_states[2].src})
            this.animtimeout=setTimeout(function () {
                getShip().$ship.attr({src: self.ship_states[0].src})
                getShip().shielded=false
            }, 4000-getShip().animtime)
        }
    }

    startDestroyedShipHitAnimation(fromframe=0) {
        if (fromframe < 12) {
            this.$ship.attr({src: self.destroyed_ship_frames[fromframe][0].src})
            setTimeout(function () {
                getShip().startDestroyedShipHitAnimation(fromframe+1)
            }, self.destroyed_ship_frames[fromframe][1])
        } else {
            this.$ship.attr({src: self.destroyed_ship_frames[fromframe][0].src})
            setTimeout(function () {
                getShip().$ship.remove()
                pauseGame()

            }, self.destroyed_ship_frames[fromframe][1])
        }
    }

    addAnimationTime(time) {
        this.animtime+=time
    }

    shootProjectile() {
        if (!this.hit) {
            getShotsDiv().append($(cloneProjectile()).css({
                left: Math.ceil(getShip().pos+getShip().width/2-getProjWidth()/2)
            }))
        }
    }

    register_ship_hit() {
        console.log("Ship hit")
        this.shielded=true
        this.hit=true
        this.hp-=1
        updateShipHpBox()
        if (this.hp > 0) {
            this.startShipHitAnimation()
        } else {
            getPauseButton().hide()
            this.disableShipEventhandlers()
            this.$ship.css({
                "z-index": 2
            })
            this.startDestroyedShipHitAnimation()
        }
    }

    move(e) {
        let rel_mouse_pos_x = Math.ceil(e.clientX - self.$gamespace.offset().left - getShip().width / 2);
        rel_mouse_pos_x = Math.min(Math.max(rel_mouse_pos_x, -getShip().width / 2 + 20), self.gamespace_width - getShip().width / 2 - 20);
        this.$ship.css({
            left: rel_mouse_pos_x
        })
        this.pos=rel_mouse_pos_x
    }

    registerPlanetHit() {
        this.planethp-=1
    }

    addScore(score) {
        this.score+=score
    }
}

export function initializeShip() {
    self.ship = new Ship()
    getGameSpace().append(self.ship.$ship)
    self.ship.$ship.hide()
}

export function getShip() {
    return self.ship
}

export function getShipStates() {
    return self.ship_states
}

export function getShipState(i) {
    return self.ship_states[i]
}

export function addShipState(state) {
    return self.ship_states.push(state)
}

export function getShipHpIndicatorImg(i) {
    return self.ship_hp_indicator_imgs[i]
}

export function setShipHpIndicatorImgs(depleted_img, full_img) {
    self.ship_hp_indicator_imgs=[depleted_img, full_img]
}

export function getShipHpIndicatorIcon(i) {
    return self.ship_hp_indicator_icons[i]
}

export function setShipHpIndicatorIcon(i,icon) {
    self.ship_hp_indicator_icons[i]=icon
}

export function addShipHpIndicatorIcon($icon) {
    return self.ship_hp_indicator_icons.push($icon)
}

export function getDestroyedShipFrames() {
    return self.destroyed_ship_frames
}

export function getDestroyedShipFrame(i) {
    return self.destroyed_ship_frames[i]
}

export function addDestroyedShipFrame(frame) {
    return self.destroyed_ship_frames.push(frame)
}

export function setDestroyedShipFrame(frame,i) {
    self.destroyed_ship_frames[i]=frame
}