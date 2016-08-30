class p2DebugDraw{

    private sprite: egret.Sprite;
    private world: p2.World;
    private COLOR_D_SLEEP: number = 0x999999;
    private COLOR_D_WAKE: number = 0xe5b2b2;
    private COLOR_K: number = 0x7f7fe5;
    private COLOR_S: number = 0x7fe57f;
    private COLOR_BLACK: number = 0x000000;
    private COLOR_RED: number = 0xff0000;

    public isDrawAABB: boolean = false;
    public factor:number = 30;

    public constructor(world: p2.World,sprite:egret.Sprite) {
        this.world = world;
        this.sprite = sprite;
    }
    public drawDebug(): void {
        this.sprite.graphics.clear();

        var l: number = this.world.bodies.length;
        for (var i: number = 0; i < l; i++) {
            var body: p2.Body = this.world.bodies[i];
            for (var j: number = 0; j < body.shapes.length; j++) {
                var shape: p2.Shape = body.shapes[j];
                this.drawShape(shape, body);
                if (this.isDrawAABB) this.drawAABB(body);
            }
        }
        l = this.world.constraints.length;
        var jointType: number, joint: p2.Constraint;
        for (var j: number = 0; j < l; j++) {
            joint = this.world.constraints[j];
            switch (joint.type) {
                case p2.Constraint.DISTANCE:
                    this.drawDistanceJoint(<p2.DistanceConstraint>joint);
                    break;
                case p2.Constraint.REVOLUTE:
                    this.drawRevoluteJoint(<p2.RevoluteConstraint>joint);
                    break;
                case p2.Constraint.GEAR:
                    this.drawGearJoint(<p2.GearConstraint>joint);
                    break;
                case p2.Constraint.PRISMATIC:
                    this.drawPrismaticJoint(<p2.PrismaticConstraint>joint);
                    break;
                case p2.Constraint.LOCK:
                    this.drawLockJoint(<p2.LockConstraint>joint);
                    break;
            }
        }
        l = this.world.springs.length;
        var springType: number, spring: p2.Spring;
        for (var s: number = 0; s < l; s++) {
            spring = this.world.springs[s];
            if (spring instanceof p2.LinearSpring) {
                this.drawLinearSpring(<p2.LinearSpring>spring);
            } else if (spring instanceof p2.RotationalSpring) {
                this.drawRotationalSpring(<p2.RotationalSpring>spring);
            }
        }
    }
    private drawAABB(body: p2.Body): void {
        var vertices: number[][] = new Array();
        var lx: number = body.aabb.lowerBound[0];
        var ly: number = body.aabb.lowerBound[1];
        var ux: number = body.aabb.upperBound[0];
        var uy: number = body.aabb.upperBound[1];
        if (isFinite(lx) && isFinite(ly) && isFinite(ux) && isFinite(uy)) {
            vertices.push([lx, ly], [ux, ly], [ux, uy], [lx, uy]);
            this.drawConvex(vertices, this.COLOR_S,1,false);
        }
    }
    private drawDistanceJoint(joint: p2.DistanceConstraint): void {
        var pA: number[] = new Array(), pB: number[] = new Array(), distance: number;
        distance = joint.distance;
        if (joint.upperLimitEnabled && joint.upperLimit > distance) distance = joint.upperLimit;
        joint.bodyA.toWorldFrame(pA, joint.localAnchorA);
        joint.bodyB.toWorldFrame(pB, joint.localAnchorB);

        var segment: number[] = p2.vec2.subtract([], pB, pA);
        p2.vec2.normalize(segment, segment);
        p2.vec2.scale(segment, segment, distance);
        var anchorB: number[] = p2.vec2.add([], pA, segment);

        this.drawSegment(pA, joint.bodyA.position, this.COLOR_S);
        this.drawSegment(pB, joint.bodyB.position, this.COLOR_S);
        this.drawVecAt(segment, pA, this.COLOR_BLACK);
        //draw maxfore
        if(joint.position>distance) this.drawSegment(pB, anchorB, this.COLOR_RED);
        //draw anchorA
        this.drawCircle(pA, 3/this.factor, this.COLOR_BLACK);
        //draw upperlimit, which is also anchorB
        this.drawCircle(anchorB, 3/this.factor, this.COLOR_BLACK);
        //draw lowerlimit
        if (joint.lowerLimitEnabled) {
            p2.vec2.normalize(segment, segment);
            p2.vec2.scale(segment, segment, joint.lowerLimit);
            anchorB = p2.vec2.add([], pA, segment);
            this.drawCircle(anchorB, 2/this.factor, this.COLOR_BLACK);
        }
    }
    private drawRevoluteJoint(joint: p2.RevoluteConstraint): void {
        var anchorA: number[] = new Array(), anchorB: number[] = new Array();
        joint.bodyA.toWorldFrame(anchorA, joint.pivotA);
        joint.bodyB.toWorldFrame(anchorB, joint.pivotB);

        this.drawSegment(joint.bodyA.position, anchorA, this.COLOR_S);
        this.drawSegment(joint.bodyB.position, anchorB, this.COLOR_S);
        this.drawSegment(anchorA, anchorB, this.COLOR_RED);
        this.drawCircle(anchorA, 3/this.factor, this.COLOR_BLACK);
    }
    private drawGearJoint(joint: p2.GearConstraint): void {
        var pA: number[] = joint.bodyA.position;
        var pB: number[] = joint.bodyB.position;
        var pA1: number[] = new Array(), pB1: number[] = new Array();

        joint.bodyA.toWorldFrame(pA1, [20/this.factor, 0]);
        joint.bodyB.toWorldFrame(pB1, [20/this.factor, 0]);
        var v1: number[] = p2.vec2.subtract([], pA, pA1);
        var v2: number[] = p2.vec2.subtract([], pB, pB1);
        this.drawVecAt(v1, pA, this.COLOR_BLACK, true);
        this.drawVecAt(v2, pB, this.COLOR_BLACK, true);
        
        joint.bodyB.toWorldFrame(v2, [10 * (joint.bodyB.angle - joint.bodyA.angle - joint.angle)/this.factor, 0]);
        this.drawSegment(v2, pB, this.COLOR_RED);
    }
    private drawPrismaticJoint(joint: p2.PrismaticConstraint): void {
        var pA: number[] = joint.bodyA.position;
        var pB: number[] = joint.bodyB.position;
        var anchorA: number[] = new Array(), anchorB: number[] = new Array();

        joint.bodyA.toWorldFrame(anchorA, joint.localAnchorA);
        joint.bodyB.toWorldFrame(anchorB, joint.localAnchorB);
        var axis: number[] = new Array()
        axis = this.toWorldVector(joint.localAxisA, joint.bodyA);
        var lowerAxis: number[] = p2.vec2.copy([], axis);
        var upperAxis: number[] = p2.vec2.copy([], axis);
        if (joint.lowerLimitEnabled) {
            p2.vec2.scale(lowerAxis, axis, joint.lowerLimit);
        } else {
            p2.vec2.scale(lowerAxis, axis, 5000);
        }
        if (joint.upperLimitEnabled) {
            p2.vec2.scale(upperAxis, axis, joint.upperLimit);
        } else {
            p2.vec2.scale(upperAxis, axis, 5000);
        }
        this.drawVecAt(lowerAxis, anchorA, this.COLOR_BLACK, true);
        this.drawVecAt(upperAxis, anchorA, this.COLOR_BLACK, true);

        p2.vec2.add(lowerAxis, lowerAxis, anchorA);
        this.drawCircle(lowerAxis, 2/this.factor, this.COLOR_BLACK, 1, true);
        p2.vec2.add(upperAxis, upperAxis, anchorA);
        this.drawCircle(upperAxis, 2/this.factor, this.COLOR_BLACK, 1, true);
    }
    private drawLockJoint(joint: p2.LockConstraint): void {
        var offset: number[] = new Array(), pB: number[] = new Array();
        joint.bodyA.toWorldFrame(offset, joint.localOffsetB);

        this.drawSegment(offset, joint.bodyA.position, this.COLOR_S);
        this.drawSegment(offset, joint.bodyB.position, this.COLOR_RED);
        this.drawCircle(offset, 3/this.factor, this.COLOR_BLACK);

        var angleIndicator:number[] = new Array();
        joint.bodyA.toWorldFrame(angleIndicator, [20/this.factor, 0]);
        this.drawSegment(angleIndicator, joint.bodyA.position, this.COLOR_BLACK);
        joint.bodyB.toWorldFrame(angleIndicator, [20/this.factor, 0]);
        this.drawSegment(angleIndicator, joint.bodyB.position, this.COLOR_BLACK);
        
    }
    private drawLinearSpring(spring: p2.LinearSpring): void {
        var pA: number[] = new Array(), pB: number[] = new Array();
        spring.bodyA.toWorldFrame(pA, spring.localAnchorA);
        spring.bodyB.toWorldFrame(pB, spring.localAnchorB);

        var segment: number[] = p2.vec2.subtract([], pB, pA);
        p2.vec2.normalize(segment, segment);
        p2.vec2.scale(segment, segment, spring.restLength);
        var anchorB: number[] = p2.vec2.add([], spring.bodyA.position, segment);

        this.drawSegment(anchorB, spring.bodyB.position, this.COLOR_RED);
        this.drawVecAt(segment, pA, this.COLOR_BLACK);
        this.drawCircle(pA, 3/this.factor, this.COLOR_RED);
        this.drawCircle(anchorB, 3/this.factor, this.COLOR_RED);
    }
    private drawRotationalSpring(spring: p2.RotationalSpring): void {
        var pA: number[] = new Array(), pB: number[] = new Array();
        pA = spring.bodyA.position;
        pB = spring.bodyB.position;

        var pA1: number[] = new Array(), pB1: number[] = new Array();

        spring.bodyA.toWorldFrame(pA1, [20/this.factor, 0]);
        spring.bodyB.toWorldFrame(pB1, [10 * (spring.bodyB.angle - spring.bodyA.angle - spring.restAngle + 2)/this.factor, 0]);
        var v1: number[] = p2.vec2.subtract([], pA1, pA);
        var v2: number[] = p2.vec2.subtract([], pB1, pB);
        this.drawVecAt(v1, pA, this.COLOR_RED, true);
        this.drawVecAt(v2, pB, this.COLOR_RED, true);

        spring.bodyB.toWorldFrame(pB1, [20/this.factor, 0]);
        this.drawCircle(pA1, 2/this.factor, this.COLOR_RED);
        this.drawCircle(pB1, 2/this.factor, this.COLOR_RED);
    }
    public drawShape(shape: p2.Shape, body: p2.Body, color?: number, fillColor?: boolean): void {
        var color: number = color==undefined ?this.getColor(body):color;
        var fillColor: boolean = fillColor==undefined ? true:fillColor;

        if (shape instanceof p2.Convex) {
            this.drawConvexShape(<p2.Convex>shape, body, color, fillColor);
        }
        else if (shape instanceof p2.Plane) {
            this.drawPlaneShape(<p2.Plane>shape, body, color, fillColor);
        }
        else if (shape instanceof p2.Circle) {
            this.drawCircleShape(<p2.Circle>shape, body, color, fillColor);
        }
        else if (shape instanceof p2.Capsule) {
            this.drawCapsule(<p2.Capsule>shape, body,color);
        }
        else if (shape instanceof p2.Particle) {
            this.drawParticle(<p2.Particle>shape, body,color);
        }
        else if (shape instanceof p2.Line) {
            this.drawLine(<p2.Line>shape, body,color);
        }
        else if (shape instanceof p2.Heightfield) {
            this.drawHeightfeild(<p2.Heightfield>shape, body,color);
        }
    }
    private drawConvexShape(shape: p2.Convex, b: p2.Body, color: number,fillColor:boolean): void {
        var indexofShape: number = b.shapes.indexOf(shape);
        var offset: number[] = shape.position;
        var angle: number = shape.angle;

        var shapeCenter: number[] = [];
        var worldPoint: number[] = this.transformVec(shape.vertices[0], offset, angle);
        b.toWorldFrame(shapeCenter, offset);
        b.toWorldFrame(worldPoint, worldPoint);
        this.drawSegment(shapeCenter, worldPoint, color);

        var worldVertices: number[][] = new Array();
        var l: number = shape.vertices.length;
        for (var i: number = 0; i < l; i++) {
            worldPoint = this.transformVec(shape.vertices[i], offset, angle);
            b.toWorldFrame(worldPoint, worldPoint);
            worldVertices.push(worldPoint);
        }
        //console.log(worldVertices[0]);
        this.drawConvex(worldVertices, color, 0.5, fillColor);
    }
    private drawParticle(shape: p2.Particle, b: p2.Body, color: number): void {
        this.drawCircle(b.position, 1/this.factor, color, 0.5);
        this.drawCircle(b.position, 5/this.factor, color, 1,false);
    }
    private drawLine(shape: p2.Line, b: p2.Body,color:number): void {
        var len: number = shape.length;
        var p1: number[] = new Array(), p2: number[] = new Array();

        b.toWorldFrame(p1, [-len / 2, 0]);
        b.toWorldFrame(p2, [len / 2, 0]);
        this.drawSegment(p1, p2, color);
    }
    private drawHeightfeild(shape: p2.Heightfield, b: p2.Body,color:number): void {
        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);

        var data: number[] = shape.heights;
        var elementWidth: number = shape.elementWidth;
        var x: number;
        var worldPoint: number[] = new Array();
        var worldVertices: number[][] = new Array();
        
        data.forEach(function (y: number, i: number) {
            x = i * elementWidth;
            worldPoint = new Array();
            b.toWorldFrame(worldPoint, [x, y]);
            worldVertices.push(worldPoint);
        });
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [x, -500]);
        worldVertices.push(worldPoint);
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [0, -500]);
        worldVertices.push(worldPoint);
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [0, 0]);
        worldVertices.push(worldPoint);
        this.drawConvex(worldVertices, color, 0.5);
    }
    private drawCapsule(shape: p2.Capsule, b: p2.Body,color:number): void {
        var len: number = shape.length;
        var radius: number = shape.radius;

        var p1: number[] = new Array(), p2: number[] = new Array(), p3: number[] = new Array(), p4: number[] = new Array();
        var a1: number[] = new Array(), a2: number[] = new Array();

        b.toWorldFrame(p1, [-len / 2, -radius]);
        b.toWorldFrame(p2, [len / 2, -radius]);
        b.toWorldFrame(p3, [len / 2, radius]);
        b.toWorldFrame(p4, [-len / 2, radius]);
        b.toWorldFrame(a1, [len / 2, 0]);
        b.toWorldFrame(a2, [-len / 2, 0]);

        this.drawCircle(a1, radius, color, 0.5);
        this.drawCircle(a2, radius, color, 0.5);

        this.drawConvex([p1,p2,p3,p4], color, 0.5);
    }
    private drawCircleShape(shape: p2.Circle, b: p2.Body, color?:number,solid?:boolean): void {
        var offset: number[] = shape.position;
        var angle: number = shape.angle;

        var pos: number[] = new Array();
        b.toWorldFrame(pos, offset);
        this.drawCircle(pos, shape.radius, color, 0.5,solid);
        
        var edge: number[] = this.transformVec([shape.radius, 0], offset, angle);
        b.toWorldFrame(edge, edge);
        this.drawSegment(pos, edge, color);
    }
    private drawPlaneShape(shape: p2.Plane, b: p2.Body,color:number,fillColor:boolean): void {
        var worldPoint: number[] = new Array();
        var worldVertices: number[][] = new Array();
        var i: number = b.shapes.indexOf(shape);

        b.toWorldFrame(worldPoint, [1000, 0]);
        worldPoint = this.transformVec(worldPoint, shape.position, shape.angle);
        worldVertices.push(worldPoint);
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [1000, -100000]);
        worldPoint = this.transformVec(worldPoint, shape.position, shape.angle);
        worldVertices.push(worldPoint);
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [-1000, -100000]);
        worldPoint = this.transformVec(worldPoint, shape.position, shape.angle);
        worldVertices.push(worldPoint);
        worldPoint = new Array();
        b.toWorldFrame(worldPoint, [-1000, 0]);
        worldPoint = this.transformVec(worldPoint, shape.position, shape.angle);
        worldVertices.push(worldPoint);
        
        this.drawConvex(worldVertices, color, 0.5, fillColor);
    }
    private getColor(b: p2.Body): number {
        var color: number = this.COLOR_D_SLEEP;

        if (b.type == p2.Body.KINEMATIC) {
            color = this.COLOR_K;
        } else if (b.type == p2.Body.STATIC) {
            color = this.COLOR_S;
        } else if (b.sleepState == p2.Body.AWAKE) {
            color = this.COLOR_D_WAKE;
        }
        return color;
    }
    public drawVecAt(v: number[], at: number[], color: number, markStart: boolean = false): void {
        var pa: number[] = p2.vec2.copy([], at);
        var pb: number[] = p2.vec2.add([], v, at);
        if (markStart) this.drawCircle(pa, 3/this.factor, color);
        this.drawSegment(pa, pb, color);
    }
    public drawVecTo(v: number[], to: number[], color: number, markStart: boolean = false): void {
        var pa: number[] = p2.vec2.copy([], to);
        var pb: number[] = p2.vec2.subtract([], to, v);
        if (markStart) this.drawCircle(pa, 3/this.factor, color);
        this.drawSegment(pa, pb, color);
    }
    public drawSegment(start: number[], end: number[], color: number): void {
        this.sprite.graphics.lineStyle(1, color);
        this.sprite.graphics.moveTo(start[0]*this.factor, start[1]*this.factor);
        this.sprite.graphics.lineTo(end[0]*this.factor, end[1]*this.factor);
    }

    public drawCircle(pos: number[], radius: number, color: number, alpha: number= 1,fillColor?:boolean): void {
        this.sprite.graphics.lineStyle(1, color);
        if (fillColor || fillColor==undefined) this.sprite.graphics.beginFill(color, alpha);
        this.sprite.graphics.drawCircle(pos[0]*this.factor, pos[1]*this.factor, radius*this.factor);
        this.sprite.graphics.endFill();
    }

    public drawConvex(vertices: number[][], color: number, alpha: number= 1,fillColor:boolean=true): void {
        this.sprite.graphics.lineStyle(1, color);
        if(fillColor) this.sprite.graphics.beginFill(color, alpha);

        var l: number = vertices.length;
        var worldPoint: number[] = vertices[0];
        this.sprite.graphics.moveTo(worldPoint[0]*this.factor, worldPoint[1]*this.factor);
        for (var i: number = 1; i <= l; i++) {
            worldPoint = vertices[i % l];
            this.sprite.graphics.lineTo(worldPoint[0]*this.factor, worldPoint[1]*this.factor);
        }
        this.sprite.graphics.endFill();
    }
    public toWorldVector(v: number[], b: p2.Body): number[]{
        var out: number[] = new Array();
        p2.vec2.rotate(out, v, b.angle);
        return out;
    }
    public transformVec(v: number[], offset: number[], angle: number): number[]{
        var nv: number[] = new Array();
        p2.vec2.rotate(nv, v, angle);
        p2.vec2.add(nv, nv, offset);
        return nv;
    }
    public drawDotLine(vertices: number[][], color: number=0, smoothly: boolean= false, segmentLength: number= 30): void {
        if (vertices.length < 2) return;
        var dotSize: number = 2 / this.factor;
        var firstPoint: number[] = [];
        p2.vec2.copy(firstPoint,vertices[0]);
        
        this.drawCircle(firstPoint, dotSize, color, 1, false);

        for (var i: number = 0; i < vertices.length-2; i++) {
            var p: number[] = vertices[i];

            if (smoothly) {
                var distance: number = p2.vec2.distance(firstPoint,p);

                while (distance > (segmentLength / this.factor)) {

                    var distanceVector: number[] = [];
                    p2.vec2.subtract(distanceVector, p, firstPoint);
                    p2.vec2.scale(distanceVector, distanceVector, segmentLength / this.factor / distance);
                    p2.vec2.add(firstPoint, firstPoint, distanceVector);

                    this.drawCircle(firstPoint, dotSize, color, 1, false);

                    distance = p2.vec2.distance(firstPoint, p);
                    
                }
            } else {
                this.drawCircle(p, dotSize, color,1,false);
            }
        }
    }
}


