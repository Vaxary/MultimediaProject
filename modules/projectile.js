import {getShotsDiv} from "./gamelogic.js";

self.projectile_imgs=[]
self.projectiles=[]
self.projectile_hit_frames=[]

export class Projectile {
    constructor(pos, type) {
        this._$projectile=cloneProjectile()
        this.damage=0
        this.current_hit_animframe=0
        this.current_hit_animtime=0
        this.animtimeout=0
        this._markspeed=0
        this.asteroid=0
        switch (type) {
            case 1:
                this.damage=1
                $(this.$projectile).attr({src: getProjectileImg(0).src})
                break
            case 2:
                this.damage=1.5
                $(this.$projectile).attr({src: getProjectileImg(1).src})
                break
        }
        this.pos=pos
        $(this.$projectile).css({left: this.pos})
    }

    get $projectile() {
        return this._$projectile;
    }

    set markspeed(markspeed) {
        this._markspeed=markspeed
    }

    get markspeed() {
        return this._markspeed
    }

    remove() {
        $(this.$projectile).remove()
        getProjectiles().splice(getProjectiles().indexOf(this),1)
    }

    removeHit() {
        $(this.$projectile).remove()
        this.asteroid.hitmarkers.splice(this.asteroid.hitmarkers.indexOf(this),1)
    }

    addAnimationTime(time) {
        this.current_hit_animtime+=time
    }

    changeToHit(asteroid) {
        getProjectiles().splice(getProjectiles().indexOf(this),1)
        $(this.$projectile).removeClass("projectile")
        $(this.$projectile).addClass("hitmark")
        $(this.$projectile).stop(true)
        this.asteroid=asteroid

        let asteroidpos=asteroid.getAsteroidPosition()

        this.markspeed=asteroid.fallspeed

        let top=Math.sqrt(Math.pow(asteroid.size/2,2)-Math.pow(this.pos+parseInt($(this.$projectile).width())/2-asteroidpos[0],2))
        let size=12
        $(this.$projectile).css({
            width: size,
            height: size,
            top: top+asteroidpos[1],
            left: "-="+(size-parseInt($(this.$projectile).width()))/2
        })
        this.asteroid.addHitmarker(this)
    }

    startHitAnimation(fromframe=0,docontinue=false) {
        let current=this
        if (!docontinue) {
            current.current_hit_animframe=fromframe
            current.current_hit_animtime=0
            $(current.$projectile).attr({
                src: getProjectileHitFrames()[current.current_hit_animframe][0].src
            })
        }
        if (current.current_hit_animframe===getProjectileHitFrames().length-1) {
            current.animtimeout=setTimeout(function () {

                current.removeHit()
            }, getProjectileHitFrames()[current.current_hit_animframe][1]-current.current_hit_animtime)

        } else {
            this.animtimeout=setTimeout(function () {
                current.startHitAnimation(current.current_hit_animframe+1)
            }, getProjectileHitFrames()[current.current_hit_animframe][1]-current.current_hit_animtime)
        }
    }
}



export function getProjectileImg(i) {
    return self.projectile_imgs[i]
}

export function addProjectileImg(img) {
    self.projectile_imgs.push(img)
}

export function getProjectileHitFrames() {
    return self.projectile_hit_frames
}

export function addProjectileHitFrame(img) {
    self.projectile_hit_frames.push(img)
}

export function getProjectiles() {
    return self.projectiles
}

export function addProjectile(projectile) {
    self.projectiles.unshift(projectile)
    getShotsDiv().append(projectile.$projectile)
}

export function cloneProjectile() {
    return $(self.projectile_base)[0].cloneNode(true)
}

export function setProjectileBase(projectile_base) {
    self.projectile_base = projectile_base
}

export function getProjectileBase() {
    return self.projectile_base
}

export function setProjWidth(proj_width) {
    self.proj_width = proj_width
}

export function getProjWidth() {
    return self.proj_width
}

export function setProjHeight(proj_height) {
    self.proj_height = proj_height
}

export function getProjHeight() {
    return self.proj_height
}

export function setProjTop(proj_top) {
    self.proj_top = proj_top
}

export function getProjTop() {
    return self.proj_top
}