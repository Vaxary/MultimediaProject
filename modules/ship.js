import {
    animateButton,
    getGameSpace,
    getGameSpaceHeight,
    getGameSpaceWidth,
    resetSaveSystem,
    restartGame, saveScore
} from "./gamelogic.js";
import {addProjectile, getProjWidth, Projectile} from "./projectile.js";
import {
    getPauseButton,
    getRestartButton, getRestartOverlay,
    getScoreSaveButton, getScoreSystem,
    getShipHpBox,
    getSoundSlider, pauseWithoutAnimations,
    updateShipHpBox
} from "./uilogic.js"
import {setIsThereSpecial} from "./asteroid.js";
self.ship_states=[]
self.destroyed_ship_frames=[]
self.ship_hp_indicator_icons=[]
self.shootpatterns= [ //first num is offset from centre, second is type of bullet
    [[0, 1]],
    [[0, 2]],
    [[-10, 1], [+10, 1]],
    [[-10, 2], [+10, 2]],
]

export class Ship {
    constructor() {
        this.$ship=$("<img src='../assets/spaceship.png' alt='player spaceship' id='player'>")
        this.hp=3
        //this.planethp=10
        this.score=0
        this.debug_mode=false
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
        this.lvl=0
        this.currentanimation=""
        if (this.debug_mode) {
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
            if (event.which===2 && getShip().debug_mode) {
                getShip().lvl+=1
                getShip().lvl%=self.shootpatterns.length
            }
        });
        $(window).on('keydown', this.shootWithSpace);
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
        $(window).off('mousemove mousedown mouseup keyup')
        $(window).off("keydown", this.shootWithSpace)
        clearInterval(getShip().shootinterval)
    }

    shootWithSpace(key) {
        if (parseInt(key.keyCode)===32) {
            if (getShip().shootinterval===0) {
                getShip().shootinterval=setInterval(function () {
                    getShip().shootProjectile()
                }, 125)
            }
        }
    }

    startShipHitAnimation(fromframe=0, docontinue=false) {
        if (!docontinue) {
            this.animframe=fromframe
            this.animtime=0
            this.currentanimation="hit"
        }
        if (fromframe < 10) {
            this.$ship.attr({src: self.ship_states[(fromframe+1)%2].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipHitAnimation(fromframe+1)
            }, 100-getShip().animtime)
        } else {
            this.hit=false
            this.$ship.attr({src: self.ship_states[2].src})
            this.animtimeout=setTimeout(function () {
                getShip().$ship.attr({src: self.ship_states[0].src})
                getShip().shielded=false
                this.currentanimation=""
            }, 4500-getShip().animtime)
        }
    }

    startShipLvlUpAnimation(fromframe=0, docontinue=false) {
        if (!docontinue) {
            this.animframe=fromframe
            this.animtime=0
            this.currentanimation="lvlup"
        }
        if (fromframe < 10) {
            this.$ship.attr({src: self.ship_states[fromframe%2===0?3:0].src})
            this.animtimeout=setTimeout(function () {
                getShip().startShipLvlUpAnimation(fromframe+1)
            }, 120-fromframe/2*10-getShip().animtime)
        } else {
            this.currentanimation=""
            this.levelUp()
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
            if (this.debug_mode) {
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
            audio.playbackRate=1.5
            let pos=Math.ceil(getShip().pos+getShip().width/2-getProjWidth()/2)

            self.shootpatterns[this.lvl].forEach(pattern => {
                addProjectile(new Projectile(pos+pattern[0], pattern[1]))
            })

            audio.play()
        }
    }

    destroyShip() {
        $(window).off("keydown")
        $(getPauseButton()).off("click")
        getShip().$ship.remove()
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
    }

    register_ship_hit() {
        this.shielded=true
        this.hit=true


        if (this.hp > 1) {
            if (this.currentanimation!=="lvlup") {
                this.hp-=1
                updateShipHpBox()
            }

            clearTimeout(this.animtimeout)
            this.startShipHitAnimation()
        } else {
            this.hp-=1
            updateShipHpBox()
            getPauseButton().hide()
            this.disableShipEventhandlers()
            this.$ship.css({
                "z-index": 2
            })
            this.startDestroyedShipHitAnimation()
        }
    }

    move(e) {
        let scale=parseFloat(getGameSpace().css("scale"))
        let rel_mouse_pos_x = Math.ceil(e.clientX - self.$gamespace.offset().left - getShip().width*scale / 2)/scale
        rel_mouse_pos_x = Math.min(Math.max(rel_mouse_pos_x, -getShip().width / 2 + 20), self.gamespace_width - getShip().width / 2 - 20);
        this.$ship.css({
            left: rel_mouse_pos_x
        })
        this.pos=rel_mouse_pos_x
        if (this.debug_mode) {
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

    levelUp() {
        this.lvl+=1
        setIsThereSpecial(false)
    }

    getHitboxPositions() {
        return {
            "left" : [
                this.pos+this.width/3.75,
                this.top+this.height/7*5,
                this.width/3.6
            ],
            "right" : [
                this.pos+(this.width-this.width/3.75),
                this.top+this.height/7*5,
                this.width/3.6
            ],
            "middle" : [
                this.pos+this.width/2,
                this.top+this.height/4,
                this.width/4
            ]}
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

export function getShootpatterLength() {
    return self.shootpatterns.length-1
}