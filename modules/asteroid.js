import {getGameSpaceWidth} from "./gamelogic.js";
import {getShip} from "./ship.js";
import {getSoundSlider, updateScoreLabel} from "./uilogic.js"
self.destroyed_asteroid_frames={"basic":[], "special":[]}
self.asteroid_states={"basic":[], "special":[]}
self.hplevels={"basic":[2,4,6,8,10,12], "special":[3,6,9,12,15,18]}
self.asteroids=[]
self.destroyed_asteroids=[]
self.istherespecial=false
self.powerups=[]

export class Asteroid {
    constructor(size, fallspeed, rotationspeed, type) {
        this.current_destroyed_animframe=0
        this.current_destroyed_animtime=0
        this._hitmarkers=[]
        this._$asteroid=cloneAsteroid()
        this.animtimeout=0
        this.asteroid_destroyed_sound = new Audio("../assets/asteroid_destroyed.wav");
        this.type=type
        this.$powerup=0
        if (this.type==="special") {
            self.istherespecial=true
            this._hp=18
            this._score=9
            this.size = getAsteroidBase().width()*5
            this._img=getAsteroidStateFrame(0, "special").src
        } else if (size <= 0.2) {
            this._hp=4
            this._score=2
            this.size =  getAsteroidBase().width()*2
            this._img=getAsteroidStateFrame(4,"basic").src
        } else if (size <= 0.4) {
            this._hp=6
            this._score=3
            this.size = getAsteroidBase().width()*2.5
            this._img=getAsteroidStateFrame(3,"basic").src
        } else if (size <= 0.6) {
            this._hp=8
            this._score=4
            this.size = getAsteroidBase().width()*3
            this._img=getAsteroidStateFrame(2,"basic").src
        } else if (size <= 0.8) {
            this._hp=10
            this._score=5
            this.size = getAsteroidBase().width()*3.5
            this._img=getAsteroidStateFrame(1,"basic").src
        } else {
            this._hp=12
            this._score=6
            this.size = getAsteroidBase().width()*4
            this._img=getAsteroidStateFrame(0,"basic").src
        }

        $(this._$asteroid).attr({
            src: this._img
        }).css({
            height: this.size,
            width: this.size,
            top: -this.size,
            left: Math.round(Math.random()*(getGameSpaceWidth()-this.size))
        })
        this._fallspeed = fallspeed;
        this._rotationspeed = rotationspeed;
        this.$score_earned_label=$("<div class='asteroidscorebox'><p class='asteroidscore'>+"+this.score+"</p></div>")[0].cloneNode(true)
    }

    get hitmarkers() {
        return this._hitmarkers;
    }

    addHitmarker(hitmarker) {
        this._hitmarkers.unshift(hitmarker);
    }

    get $asteroid() {
        return this._$asteroid;
    }

    get fallspeed() {
        return this._fallspeed;
    }

    get rotationspeed() {
        return this._rotationspeed;
    }

    get hp() {
        return this._hp;
    }

    get score() {
        return this._score;
    }

    registerHit(projectile) {
        this._hp-=projectile.damage
        projectile.changeToHit(this)
        projectile.startHitAnimation()
        this.updateAsteroidState()
    }

    updateAsteroidDestroyedCurrentAnimtime(time) {
        this.current_destroyed_animtime+=time
    }

    getAsteroidDestroyedCurrentAnimtime() {
        return this.current_destroyed_animtime
    }

    removeMarkers() {
        this.hitmarkers.forEach(function (current_marker) {
            clearTimeout(current_marker.animtimeout)
            $(current_marker.$projectile).remove()
        })
        this.hitmarkers.splice(0,this.hitmarkers.length)
    }

    updateMarkerTimes(time) {
        this.hitmarkers.forEach(function (current_marker) {
            current_marker.addAnimationTime(time)
        })
    }

    stopMarkers() {
        this.hitmarkers.forEach(function (current_marker) {
            clearTimeout(current_marker.animtimeout)
            $(current_marker.$projectile).stop(true)
        })
    }

    startMarkers() {
        this.hitmarkers.forEach(function (current_marker) {
            current_marker.startHitAnimation(current_marker.current_hit_animframe, true)
        })
    }

    updateAsteroidState() {
        if (this.hp <= 0) {
            getShip().addScore(this.score)
            updateScoreLabel()
            this.changeToDestroyed()


            this.asteroid_destroyed_sound.volume = getSoundSlider().val() / 100
            this.asteroid_destroyed_sound.play()
            getDestroyedAsteroids().push(this)

            this.removeMarkers()

            $(this.$asteroid).stop(true)


            this.spawnScorePopup()

            if (this.type==="special") {
                this.spawnPowerup()
            }



            this.startAsteroidDestroyAnimation()
        } else if (this.hp <= self.hplevels[this.type][0]) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(5,this.type).src
            })
        } else if (this.hp <= self.hplevels[this.type][1]) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(4,this.type).src
            })
        } else if (this.hp <= self.hplevels[this.type][2]) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(3,this.type).src
            })
        } else if (this.hp <= self.hplevels[this.type][3]) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(2,this.type).src
            })
        } else if (this.hp <= self.hplevels[this.type][4]) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(1,this.type).src
            })
        } else {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(0,this.type).src
            })
        }
    }

    startAsteroidDestroyAnimation(fromframe=0, docontinue=false) {
        let current=this

        if (!docontinue) {
            current.current_destroyed_animframe=fromframe
            current.current_destroyed_animtime=0
            $(current.$asteroid).attr({
                src: destroyed_asteroid_frames[this.type][current.current_destroyed_animframe][0].src
            })
        }
        if (current.current_destroyed_animframe===getDestroyedAsteroidStateFrames(this.type).length-1) {
            let time=destroyed_asteroid_frames[this.type][current.current_destroyed_animframe][1]*$(current.$score_earned_label).css("opacity")
            $(current.$score_earned_label).animate({opacity: "0", rotate: Math.sign(current.rotationspeed)*90+"deg", scale: this.size/160}, time, "linear")
            current.animtimeout=setTimeout(function () {

                current.$score_earned_label.remove()
                current.removeDestroyed()

            }, destroyed_asteroid_frames[this.type][current.current_destroyed_animframe][1]-current.current_destroyed_animtime)

        } else {
            this.animtimeout=setTimeout(function () {
                current.startAsteroidDestroyAnimation(current.current_destroyed_animframe+1)
            }, destroyed_asteroid_frames[this.type][current.current_destroyed_animframe][1]-current.current_destroyed_animtime)
        }
    }

    remove() {
        $(this.$asteroid).remove()
        asteroids.splice(asteroids.indexOf(this), 1)
    }

    removeDestroyed() {
        $(this.$asteroid).remove()
        destroyed_asteroids.splice(destroyed_asteroids.indexOf(this), 1)
    }

    changeToDestroyed() {
        $(this.$asteroid).removeClass("asteroid")
        $(this.$asteroid).addClass("explosion")
        getAsteroids().splice(getAsteroids().indexOf(this), 1)
    }

    spawnPowerup() {
        let asteroidsize=this.size
        let pos= [parseFloat($(this.$asteroid).css("top")), parseFloat($(this.$asteroid).css("left"))]
        this.size=20
        this._fallspeed=1
        this.$powerup=$("<img src='"+getPowerupImg().src+"' alt='powerup' class='powerup'>")[0].cloneNode(true)
        $(this.$powerup).css({
            top: pos[0]+(asteroidsize-this.size)/2,
            left: pos[1]+(asteroidsize-this.size)/2,
            width: this.size,
            height: this.size
        })
        self.powerups.push(this)
        getAsteroidDiv().append(this.$powerup)
    }

    spawnScorePopup() {
        $(this.$score_earned_label).css({
            width: this.size,
            height: this.size,
            left: parseFloat($(this.$asteroid).css("left")),
            top: parseFloat($(this.$asteroid).css("top")),
            scale: this.size / 40,
            opacity: 1
        })
        getAsteroidDiv().append(this.$score_earned_label)
    }

    removePowerup() {
        $(this.$powerup).remove()
        powerups.splice(powerups.indexOf(this), 1)
        setIsThereSpecial(false)
    }

    getAsteroidPosition() {
        return [
            parseFloat($(this.$asteroid).css("left"))+parseInt($(this.$asteroid).css("width"))/2,
            parseFloat($(this.$asteroid).css("top"))+parseInt($(this.$asteroid).css("height"))/2,
            parseInt($(this.$asteroid).css("width"))/2
        ]
    }

    getPowerupPosition() {
        return [
            parseFloat($(this.$powerup).css("left"))+parseInt($(this.$powerup).css("width"))/2,
            parseFloat($(this.$powerup).css("top"))+parseInt($(this.$powerup).css("height"))/2,
            parseInt($(this.$powerup).css("width"))/2*0.9
        ]
    }
}

export function getIsThereSpecial() {
    return self.istherespecial
}

export function setIsThereSpecial(isspecial) {
    self.istherespecial=isspecial
}

export function setAsteroidDiv($asteroiddiv) {
    self.$asteroiddiv=$asteroiddiv
}

export function getAsteroidDiv() {
    return self.$asteroiddiv
}

export function cloneAsteroid(){
    return $(self.asteroid_base)[0].cloneNode(true)
}

export function setAsteroidBase(asteroid_base) {
    self.asteroid_base=asteroid_base
}

export function getAsteroidBase() {
    return self.asteroid_base
}

export function addAsteroid(asteroid) {
    asteroids.push(asteroid)
    getAsteroidDiv().append($(asteroid.$asteroid))
}

export function getAsteroids() {
    return asteroids
}

export function getAsteroid(i) {
    return asteroids[i]
}

export function addDestroyedAsteroid(destroyed_asteroid) {
    destroyed_asteroids.push(destroyed_asteroid)
}

export function getDestroyedAsteroid(i) {
    return destroyed_asteroids[i]
}

export function getDestroyedAsteroids() {
    return destroyed_asteroids
}

export function addAsteroidStateFrame(asteroidframe, asteroidtype) {
    asteroid_states[asteroidtype].push(asteroidframe)
}

export function getAsteroidStateFrame(i, asteroidtype) {
    return asteroid_states[asteroidtype][i]
}

export function addDestroyedAsteroidFrame(asteroidframe, asteroidtype) {
    destroyed_asteroid_frames[asteroidtype].push(asteroidframe)
}

export function getDestroyedAsteroidStateFrame(i, asteroidtype) {
    return destroyed_asteroid_frames[asteroidtype][i]
}

export function getDestroyedAsteroidStateFrames(asteroidtype) {
    return destroyed_asteroid_frames[asteroidtype]
}

export function setPowerupImg(img) {
    self.powerup_img=img
}

export function getPowerupImg() {
    return self.powerup_img
}

export function getPowerups() {
    return self.powerups
}