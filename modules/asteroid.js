import {getGameSpaceWidth} from "./gamelogic.js";
import {getShip} from "./ship.js";
import {getSoundSlider, updateScoreLabel} from "./uilogic.js"
self.destroyed_asteroid_frames=[]
self.asteroid_states=[]
self.asteroids=[]
self.destroyed_asteroids=[]

export class Asteroid {
    constructor(size, fallspeed, rotationspeed) {
        this.current_destroyed_animframe=0
        this.current_destroyed_animtime=0
        this._hitmarkers=[]
        this._$asteroid=cloneAsteroid()
        this.animtimeout=0
        this.asteroid_destroyed_sound = new Audio("../assets/asteroid_destroyed.wav");
        if (size <= 0.2) {
            this._hp=4
            this._score=2
            this.size =  getAsteroidBase().width()*2
            this._img=getAsteroidStateFrame(4).src
        } else if (size <= 0.4) {
            this._hp=6
            this._score=3
            this.size = getAsteroidBase().width()*2.5
            this._img=getAsteroidStateFrame(3).src
        } else if (size <= 0.6) {
            this._hp=8
            this._score=4
            this.size = getAsteroidBase().width()*3
            this._img=getAsteroidStateFrame(2).src
        } else if (size <= 0.8) {
            this._hp=10
            this._score=5
            this.size = getAsteroidBase().width()*3.5
            this._img=getAsteroidStateFrame(1).src
        } else {
            this._hp=12
            this._score=6
            this.size = getAsteroidBase().width()*4
            this._img=getAsteroidStateFrame(0).src
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
        if (this.hp<=0) {
            getShip().addScore(this.score)
            updateScoreLabel()
            this.changeToDestroyed()

            this.asteroid_destroyed_sound.volume=getSoundSlider().val()/100
            this.asteroid_destroyed_sound.play()
            getDestroyedAsteroids().push(this)

            this.removeMarkers()

            $(this.$asteroid).stop(true)

            this.startAsteroidDestroyAnimation()
        } else if (this.hp<=2) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(5).src
            })
        } else if (this.hp<=4) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(4).src
            })
        } else if (this.hp<=6) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(3).src
            })
        } else if (this.hp<=8) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(2).src
            })
        } else if (this.hp<=10) {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(1).src
            })
        } else {
            $(this.$asteroid).attr({
                src: getAsteroidStateFrame(0).src
            })
        }
    }

    startAsteroidDestroyAnimation(fromframe=0, docontinue=false) {
        let current=this

        if (!docontinue) {
            current.current_destroyed_animframe=fromframe
            current.current_destroyed_animtime=0
            $(current.$asteroid).attr({
                src: destroyed_asteroid_frames[current.current_destroyed_animframe][0].src
            })
        }

        if (current.current_destroyed_animframe===getDestroyedAsteroidStateFrames().length-1) {
            current.animtimeout=setTimeout(function () {

                current.removeDestroyed()
            }, destroyed_asteroid_frames[current.current_destroyed_animframe][1]-current.current_destroyed_animtime)

        } else {
            this.animtimeout=setTimeout(function () {
                current.startAsteroidDestroyAnimation(current.current_destroyed_animframe+1)
            }, destroyed_asteroid_frames[current.current_destroyed_animframe][1]-current.current_destroyed_animtime)
        }
    }

    remove() {
        $(this.$asteroid).remove()
        asteroids.splice(asteroids.indexOf(this), 1)
    }

    removeDestroyed() {
        let current=this
        $(this.$asteroid).remove()
        current.hitmarkers.splice(0,current.hitmarkers.length)
        destroyed_asteroids.splice(destroyed_asteroids.indexOf(this), 1)
    }

    changeToDestroyed() {
        $(this.$asteroid).removeClass("asteroid")
        $(this.$asteroid).addClass("explosion")
        getAsteroids().splice(getAsteroids().indexOf(this), 1)
    }
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

export function replaceAsteroid(asteroid, i) {
    asteroids[i]=asteroid
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

export function replaceDestroyedAsteroid(destroyed_asteroid, i) {
    destroyed_asteroids[i]=destroyed_asteroid
}

export function addAsteroidStateFrame(asteroidframe) {
    asteroid_states.push(asteroidframe)
}

export function getAsteroidStateFrame(i) {
    return asteroid_states[i]
}

export function replaceAsteroidStateFrame(asteroidframe, i) {
    asteroid_states[i]=asteroidframe
}

export function addDestroyedAsteroidFrame(asteroidframe) {
    destroyed_asteroid_frames.push(asteroidframe)
}

export function getDestroyedAsteroidStateFrame(i) {
    return destroyed_asteroid_frames[i]
}

export function getDestroyedAsteroidStateFrames() {
    return destroyed_asteroid_frames
}

export function replaceDestroyedAsteroidFrame(asteroidframe, i) {
    destroyed_asteroid_frames[i]=asteroidframe
}