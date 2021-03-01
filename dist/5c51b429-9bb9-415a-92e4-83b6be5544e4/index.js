// forked from sawa-zen's "【three.jsのヘルパー解説集】 ④BoxHelperの使い方" http://jsdo.it/sawa-zen/mPb2
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        _super.call(this, 45, window.innerWidth / window.innerHeight, 1, 1000);
        this._angle = 0;
        this._radius = 4;
        this.position.set(this._radius, 4, 0);
        Camera._instance = this;
    }
    Camera.getInstance = function () {
        return Camera._instance || new Camera();
    };
    Camera.prototype.rotate = function () {
        this._angle -= 0.1;
    };
    Camera.prototype.update = function () {
        var lad = this._angle * Math.PI / 180;
        //this.position.x = this._radius * Math.sin(lad);
        //this.position.z = this._radius * Math.cos(lad);
        this.lookAt(new THREE.Vector3(0, 0, 0));
        
    };
    return Camera;
}(THREE.PerspectiveCamera));
exports.__esModule = true;
exports["default"] = Camera;

},{}],2:[function(require,module,exports){
"use strict";
var Camera_1 = require('./Camera');
var BoxHelper_1 = require('./helper/BoxHelper');
window.addEventListener('load', function () {
    new Main();
});
document.addEventListener('touchmove', function (e) {
    if (window.innerHeight >= document.body.scrollHeight) {
        e.preventDefault();
    }
}, false);
var Main = (function () {
    function Main() {
        this._frame = 0;
        this._scene = new THREE.Scene();
        this._camera = Camera_1["default"].getInstance();
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setClearColor(0x000000);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._resize();
        document.body.appendChild(this._renderer.domElement);
        var ambientLight = new THREE.AmbientLight(0x333333);
        this._scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 0);
        this._scene.add(directionalLight);
        var boxHelper = new BoxHelper_1["default"]();
        this._scene.add(boxHelper);
        this._tick();
        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
    }
    Main.prototype._tick = function () {
        var _this = this;
        requestAnimationFrame(function () { _this._tick(); });
        this._frame++;
        this._camera.rotate();
        this._camera.update();
        if (this._frame % 2) {
            return;
        }
        this._renderer.render(this._scene, this._camera);
    };
    Main.prototype._onResize = function (event) {
        this._resize();
    };
    Main.prototype._resize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this._renderer.domElement.setAttribute('width', String(width));
        this._renderer.domElement.setAttribute('height', String(height));
        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    };
    return Main;
}());

},{"./Camera":1,"./helper/BoxHelper":3}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BoxHelper = (function (_super) {
    __extends(BoxHelper, _super);
    function BoxHelper() {
        _super.call(this);
        var sphere = new THREE.BoxGeometry(1,1,1);
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        var object = new THREE.Mesh(sphere, sphereMaterial);
        this.add(object);
        var box = new THREE.BoxHelper(object);
        setInterval(function() {
            object.rotation.x += 0.02;
            object.rotation.y += 0.04;
            box.update(object);
        }, 30);
        this.add(box);
    }
    return BoxHelper;
}(THREE.Object3D));
exports.__esModule = true;
exports["default"] = BoxHelper;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2FtZXJhLnRzIiwic3JjL01haW4udHMiLCJzcmMvaGVscGVyL0JveEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0dBO0lBQW9DLDBCQUF1QjtJQWdCekQ7UUFDRSxrQkFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztRQVR0RCxXQUFNLEdBQVUsQ0FBQyxDQUFDO1FBRWxCLFlBQU8sR0FBVSxDQUFDLENBQUM7UUFTekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQW5CYSxrQkFBVyxHQUF6QjtRQUNFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQXVCTSx1QkFBTSxHQUFiO1FBQ0UsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7SUFDckIsQ0FBQztJQUtNLHVCQUFNLEdBQWI7UUFDRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFD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QUFLLENBQUMsSUFBSSxDQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpCLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBRSxNQUFNLENBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFSCxnQkFBQztBQUFELENBbEJBLEFBa0JDLENBbEJzQyxLQUFLLENBQUMsUUFBUSxHQWtCcEQ7QUFsQkQ7OEJBa0JDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiDjgqvjg6Hjg6njga7jgq/jg6njgrnjgafjgZnjgIJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEge1xuXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTpDYW1lcmE7XG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTpDYW1lcmEge1xuICAgIHJldHVybiBDYW1lcmEuX2luc3RhbmNlIHx8IG5ldyBDYW1lcmEoKTtcbiAgfVxuXG4gIC8qKiDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgavnlKjjgYTjgovop5Lluqbjga7lgKTjgafjgZnjgIIgKi9cbiAgcHJpdmF0ZSBfYW5nbGU6bnVtYmVyID0gMDtcbiAgLyoqIOOCouODi+ODoeODvOOCt+ODp+ODs+OBruWGhui7jOmBk+OBruWNiuW+hOOBp+OBmeOAgiAqL1xuICBwcml2YXRlIF9yYWRpdXM6bnVtYmVyID0gNDtcblxuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/44O844Gn44GZ44CCXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoNDUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAgMTAwMCk7XG5cbiAgICB0aGlzLnBvc2l0aW9uLnNldCh0aGlzLl9yYWRpdXMsIDQsIDApO1xuXG4gICAgQ2FtZXJhLl9pbnN0YW5jZSA9IHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5Zue6Lui44GV44Gb44G+44GZ44CCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb25cbiAgICovXG4gIHB1YmxpYyByb3RhdGUoKSB7XG4gICAgdGhpcy5fYW5nbGUgLT0gMC4xO1xuICB9XG5cbiAgLyoqXG4gICAqIOavjuODleODrOODvOODoOOBruabtOaWsOOCkuOBi+OBkeOBvuOBmeOAglxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBsZXQgbGFkID0gdGhpcy5fYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMuX3JhZGl1cyAqIE1hdGguc2luKGxhZCk7XG4gICAgdGhpcy5wb3NpdGlvbi56ID0gdGhpcy5fcmFkaXVzICogTWF0aC5jb3MobGFkKTtcbiAgICB0aGlzLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL0NhbWVyYSc7XG5cbmltcG9ydCBBcnJvd0hlbHBlciBmcm9tICcuL2hlbHBlci9BcnJvd0hlbHBlcic7XG5pbXBvcnQgQXhpc0hlbHBlciBmcm9tICcuL2hlbHBlci9BeGlzSGVscGVyJztcbmltcG9ydCBCb3VuZGluZ0JveEhlbHBlciBmcm9tICcuL2hlbHBlci9Cb3VuZGluZ0JveEhlbHBlcic7XG5pbXBvcnQgQm94SGVscGVyIGZyb20gJy4vaGVscGVyL0JveEhlbHBlcic7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBuZXcgTWFpbigpO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCA+PSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxufSwgZmFsc2UpO1xuXG4vKipcbiAqIOODh+ODouOBruODoeOCpOODs+OCr+ODqeOCueOBp+OBmeOAglxuICovXG5jbGFzcyBNYWluIHtcblxuICAvKiog44K344O844Oz44Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCICovXG4gIHByaXZhdGUgX3NjZW5lOlRIUkVFLlNjZW5lO1xuICAvKiog44Kr44Oh44Op44Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCICovXG4gIHByaXZhdGUgX2NhbWVyYTpDYW1lcmE7XG4gIC8qKiDjg6zjg7Pjg4Djg6njg7zjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIIgKi9cbiAgcHJpdmF0ZSBfcmVuZGVyZXI6VEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgLyoqIEZQU+ihqOekuiAqL1xuICBwcml2YXRlIF9zdGF0czpTdGF0cztcblxuICAvKiog44OV44Os44O844Og44Kr44Km44Oz44OIICovXG4gIHByaXZhdGUgX2ZyYW1lOm51bWJlciA9IDA7XG4gIC8qKiDjgqvjg6Hjg6njga7np7vli5XlkJHjgY0gKi9cbiAgcHJpdmF0ZSBfbW92ZURpcmVjdGlvbjpzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvOOBp+OBmeOAglxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy8g44K344O844OzXG4gICAgdGhpcy5fc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIC8vIOOCq+ODoeODqVxuICAgIHRoaXMuX2NhbWVyYSA9IENhbWVyYS5nZXRJbnN0YW5jZSgpO1xuXG4gICAgLy8g44Os44Oz44OA44Op44O8XG4gICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7YW50aWFsaWFzOiB0cnVlfSk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgdGhpcy5fcmVzaXplKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIC8vIOeSsOWig+WFiVxuICAgIGxldCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4MzMzMzMzKTtcbiAgICB0aGlzLl9zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcblxuICAgIC8vIOWFiVxuICAgIGxldCBkaXJlY3Rpb25hbExpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNSk7XG4gICAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoNSwgNSwgMCk7XG4gICAgdGhpcy5fc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xuXG4gICAgLy8gLy8g55+i5Y2w44OY44Or44OR44O8XG4gICAgLy8gbGV0IGFycm93SGVscGVyID0gbmV3IEFycm93SGVscGVyKCk7XG4gICAgLy8gdGhpcy5fc2NlbmUuYWRkKGFycm93SGVscGVyKTtcbiAgICAvLyAvLyDkuInou7jjg5jjg6vjg5Hjg7xcbiAgICAvLyBsZXQgYXhpc0hlbHBlciA9IG5ldyBBeGlzSGVscGVyKCk7XG4gICAgLy8gdGhpcy5fc2NlbmUuYWRkKGF4aXNIZWxwZXIpO1xuICAgIC8vIC8vIOWig+eVjOOCqOODquOCouODmOODq+ODkeODvFxuICAgIC8vIGxldCBib3VuZGluZ0JveEhlbHBlciA9IG5ldyBCb3VuZGluZ0JveEhlbHBlcigpO1xuICAgIC8vIHRoaXMuX3NjZW5lLmFkZChib3VuZGluZ0JveEhlbHBlcik7XG4gICAgLy8g44Oc44OD44Kv44K544OY44Or44OR44O8XG4gICAgbGV0IGJveEhlbHBlciA9IG5ldyBCb3hIZWxwZXIoKTtcbiAgICB0aGlzLl9zY2VuZS5hZGQoYm94SGVscGVyKTtcblxuICAgIC8vIOabtOaWsOWHpueQhlxuICAgIHRoaXMuX3RpY2soKTtcblxuICAgIC8vIOODquOCteOCpOOCuuOCkuebo+imllxuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODleODrOODvOODoOavjuOBruOCouODi+ODoeODvOOCt+ODp+ODs+OBruabtOaWsOOCkuOBi+OBkeOBvuOBmeOAglxuICAgKi9cbiAgcHJpdmF0ZSBfdGljaygpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyB0aGlzLl90aWNrKCkgfSk7XG5cbiAgICAvLyDjg5Xjg6zjg7zjg6Djgqvjgqbjg7Pjg4jjgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcbiAgICB0aGlzLl9mcmFtZSsrO1xuXG4gICAgLy8g44Kr44Oh44Op44Gu5pu05pawXG4gICAgdGhpcy5fY2FtZXJhLnJvdGF0ZSgpO1xuICAgIHRoaXMuX2NhbWVyYS51cGRhdGUoKTtcblxuICAgIC8vIEZQU+OCkjMw44GrXG4gICAgaWYodGhpcy5fZnJhbWUgJSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5o+P55S7XG4gICAgdGhpcy5fcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCB0aGlzLl9jYW1lcmEpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODquOCteOCpOOCuuaZguOBruODj+ODs+ODieODqeODvOOBp+OBmeOAglxuICAgKi9cbiAgcHJvdGVjdGVkIF9vblJlc2l6ZShldmVudDpFdmVudCk6dm9pZCB7XG4gICAgdGhpcy5fcmVzaXplKCk7XG4gIH1cblxuICAvKipcbiAgICog44Oq44K144Kk44K65Yem55CGXG4gICAqL1xuICBwcml2YXRlIF9yZXNpemUoKSB7XG4gICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcod2lkdGgpKTtcbiAgICB0aGlzLl9yZW5kZXJlci5kb21FbGVtZW50LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGhlaWdodCkpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5fY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgIHRoaXMuX2NhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH1cbn1cbiIsIi8qKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3hIZWxwZXIgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+ODvFxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgMzAsIDMwKTtcbiAgICB2YXIgc3BoZXJlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge2NvbG9yOiAweDAwZmYwMH0gKTtcbiAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goIHNwaGVyZSwgc3BoZXJlTWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkKG9iamVjdCk7XG5cbiAgICB2YXIgYm94ID0gbmV3IFRIUkVFLkJveEhlbHBlciggb2JqZWN0ICk7XG4gICAgdGhpcy5hZGQoYm94KTtcbiAgfVxuXG59XG4iXX0=
