import {
    animateButton,
    getGameSpace,
    getGameSpaceHeight,
    getGameSpaceWidth,
    getPauseButton,
    getRestartButton,
    getRestartOverlay, getScoreSaveButton, getScoreSystem, getShipHpBox,
    getShotsDiv, getSoundSlider, pauseWithoutAnimations, resetSaveSystem,
    restartGame, saveScore,
    updateShipHpBox
} from "./gamelogic.js";
import {cloneProjectile, getProjWidth} from "./projectile.js";

self.ship_states=[]
self.destroyed_ship_frames=[]
self.ship_hp_indicator_icons=[]

export class Ship {
    constructor() {
        this.$ship=$("<img src='../assets/spaceship.png' alt='player spaceship' id='player'>")
        this.hp=3
        //this.planethp=10
        this.score=0
        this.debuging_hitbox=false
        this.shielded=false
        this.hit=false
        this.pos=0
        this.width=0
        this.shoot_sound=new Audio("../assets/shipshootsound.mp3")
        this.height=0
        this.top=0
        this.shootinterval=0
        this.animframe=0
        this.animtime=0
        this.animtimeout=0
        if (this.debuging_hitbox) {
            this.setupDebugHitboxes()
        }
    }

    updateSizeAndPos() {
        this.width=this.$ship.width()*4
        this.height=this.$ship.height()*4
        this.top=getGameSpaceHeight()-this.height-50
        this.pos=getGameSpaceWidth()/2-this.width/2
        this.$ship.css({
            width: this.width,
            height: this.height,
            left: this.pos,
            top: this.top
        })
    }

    deleteDebugHitboxes() {
        this.debughitboxes[0].remove()
        this.debughitboxes[1].remove()
        this.debughitboxes[2].remove()
    }

    setupDebugHitboxes() {
        let debughitboxleft=$("<div class='debughitbox'></div>")
        let debughitboxright=$("<div class='debughitbox'></div>")
        let debughitboxtop=$("<div class='debughitbox'></div>")
        getGameSpace().append(debughitboxleft)
        getGameSpace().append(debughitboxright)
        getGameSpace().append(debughitboxtop)
        this.debughitboxes=[
            debughitboxleft,
            debughitboxright,
            debughitboxtop
        ]
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
        clearInterval(getShip().shootinterval)
    }

    startShipHitAnimation(fromframe=0) {
        this.animframe=fromframe
        this.animtime=0
        if (fromframe < 10) {
            this.$ship.attr({src: self.ship_states[(fromframe+1)%2].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipHitAnimation(fromframe+1)
            }, 100)
        } else {
            this.hit=false
            this.$ship.attr({src: self.ship_states[2].src})
            this.animtimeout=setTimeout(function () {
                getShip().$ship.attr({src: self.ship_states[0].src})
                getShip().shielded=false
            }, 4500)
        }
    }

    continueShipHitAnimation() {
        if (this.animframe < 10) {
            this.$ship.attr({src: self.ship_states[(this.animframe+1)%2].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipHitAnimation(getShip().animframe+1)
            }, 100-getShip().animtime)
        } else {
            this.hit=false
            this.$ship.attr({src: self.ship_states[2].src})
            this.animtimeout=setTimeout(function () {
                getShip().$ship.attr({src: self.ship_states[0].src})
                getShip().shielded=false
            }, 4500-getShip().animtime)
        }
    }

    startDestroyedShipHitAnimation(fromframe=0) {
        if (fromframe < destroyed_ship_frames.length-1) {
            this.$ship.attr({src: self.destroyed_ship_frames[fromframe][0].src})
            setTimeout(function () {
                getShip().startDestroyedShipHitAnimation(fromframe+1)
            }, self.destroyed_ship_frames[fromframe][1])
        } else {
            this.$ship.attr({src: self.destroyed_ship_frames[fromframe][0].src})
            if (this.debuging_hitbox) {
                this.deleteDebugHitboxes()
            }
            setTimeout(getShip().destroyShip, self.destroyed_ship_frames[fromframe][1])
        }
    }

    addAnimationTime(time) {
        this.animtime+=time
    }

    shootProjectile() {
        if (!this.hit) {
            let audio = new Audio()
            audio.src=getShip().shoot_sound.src

            audio.volume=getSoundSlider().val()/100
            //console.log(audio.volume)
            audio.playbackRate=1.5
            getShotsDiv().append($(cloneProjectile()).css({
                left: Math.ceil(getShip().pos+getShip().width/2-getProjWidth()/2)
            }))
            audio.play()
        }
    }

    destroyShip() {
        $(getPauseButton()).off("click")
        getShip().$ship.remove()
        setTimeout(function () {
            pauseWithoutAnimations()
            resetSaveSystem()
            getShipHpBox().hide()

            $(getScoreSystem()).show()
            $(getScoreSaveButton()).on("click", saveScore)

            $(getRestartOverlay()).show()
            $(getRestartButton()).on("click", function () {
                animateButton(getRestartButton())
                $(getRestartButton()).off("click")
                $(getScoreSaveButton()).off("click")
                setTimeout(restartGame, 200)
            })
        }, 1000)

    }

    register_ship_hit() {
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
        if (this.debuging_hitbox) {
            this.moveDebugHitboxes()
        }

    }

    moveDebugHitboxes() {
        let shipposleft=[
            getShip().pos+getShip().width/3.75,
            getShip().top+getShip().height/7*5,
            getShip().width/3.6
        ]
        let shipposright=[
            getShip().pos+(getShip().width-getShip().width/3.75),
            getShip().top+getShip().height/7*5,
            getShip().width/3.6
        ]
        let shippostop=[
            getShip().pos+getShip().width/2,
            getShip().top+getShip().height/4,
            getShip().width/4
        ]
        $(this.debughitboxes[0]).css({
            left: shipposleft[0]-shipposleft[2],
            top: shipposleft[1]-shipposleft[2],
            width: shipposleft[2]*2,
            height: shipposleft[2]*2
        })
        $(this.debughitboxes[1]).css({
            left: shipposright[0]-shipposright[2],
            top: shipposright[1]-shipposright[2],
            width: shipposright[2]*2,
            height: shipposright[2]*2
        })
        $(this.debughitboxes[2]).css({
            left: shippostop[0]-shippostop[2],
            top: shippostop[1]-shippostop[2],
            width: shippostop[2]*2,
            height: shippostop[2]*2
        })
    }

    /*registerPlanetHit() {
        this.planethp-=1
    }*/

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