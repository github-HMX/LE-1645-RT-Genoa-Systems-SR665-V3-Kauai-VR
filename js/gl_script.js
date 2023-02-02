// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//


Vector3 = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};
Vector3.prototype = {
    constructor: Vector3,
    set: function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    setX: function (x) {
        this.x = x;
        return this;
    },
    setY: function (y) {
        this.y = y;
        return this;
    },
    setZ: function (z) {
        this.z = z;
        return this;
    },
    setComponent: function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    getComponent: function (index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    copy: function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },
    add: function (v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },
    addScalar: function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    },
    addVectors: function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    },
    sub: function (v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },
    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    },
    multiply: function (v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
        }
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    },
    multiplyScalar: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },
    multiplyVectors: function (a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    },
    applyEuler: function () {
        var quaternion;
        return function (euler) {
            if (euler instanceof Euler === false) {
                console.error('Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
            }
            if (quaternion === undefined) quaternion = new Quaternion();
            this.applyQuaternion(quaternion.setFromEuler(euler));
            return this;
        };
    }(),
    applyAxisAngle: function () {
        var quaternion;
        return function (axis, angle) {
            if (quaternion === undefined) quaternion = new Quaternion();
            this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
            return this;
        };
    }(),
    applyMatrix3: function (m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    },
    applyMatrix4: function (m) {
        // input: Matrix4 affine matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return this;
    },
    applyProjection: function (m) {
        // input: Matrix4 projection matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
        return this;
    },
    applyQuaternion: function (q) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    },
    transformDirection: function (m) {
        // input: Matrix4 affine matrix
        // vector interpreted as a direction
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        this.normalize();
        return this;
    },
    divide: function (v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    },
    divideScalar: function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    },
    min: function (v) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        if (this.y > v.y) {
            this.y = v.y;
        }
        if (this.z > v.z) {
            this.z = v.z;
        }
        return this;
    },
    max: function (v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }
        if (this.z < v.z) {
            this.z = v.z;
        }
        return this;
    },
    clamp: function (min, max) {
        // This function assumes min < max, if this assumption isn't true it will not operate correctly
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }
        if (this.y < min.y) {
            this.y = min.y;
        } else if (this.y > max.y) {
            this.y = max.y;
        }
        if (this.z < min.z) {
            this.z = min.z;
        } else if (this.z > max.z) {
            this.z = max.z;
        }
        return this;
    },
    clampScalar: (function () {
        var min, max;
        return function (minVal, maxVal) {
            if (min === undefined) {
                min = new Vector3();
                max = new Vector3();
            }
            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);
            return this.clamp(min, max);
        };
    })(),
    floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    },
    ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    },
    round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    },
    roundToZero: function () {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    },
    negate: function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    lengthSq: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function () {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function () {
        return this.divideScalar(this.length());
    },
    setLength: function (l) {
        var oldLength = this.length();
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength);
        }
        return this;
    },
    lerp: function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    },
    cross: function (v, w) {
        if (w !== undefined) {
            console.warn('Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
        }
        var x = this.x,
            y = this.y,
            z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    },
    crossVectors: function (a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    },
    projectOnVector: function () {
        var v1, dot;
        return function (vector) {
            if (v1 === undefined) v1 = new Vector3();
            v1.copy(vector).normalize();
            dot = this.dot(v1);
            return this.copy(v1).multiplyScalar(dot);
        };
    }(),
    projectOnPlane: function () {
        var v1;
        return function (planeNormal) {
            if (v1 === undefined) v1 = new Vector3();
            v1.copy(this).projectOnVector(planeNormal);
            return this.sub(v1);
        }
    }(),
    reflect: function () {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        var v1;
        return function (normal) {
            if (v1 === undefined) v1 = new Vector3();
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
        }
    }(),
    angleTo: function (v) {
        var theta = this.dot(v) / (this.length() * v.length());
        // clamp, to handle numerical problems
        return Math.acos(Math.clamp(theta, -1, 1));
    },
    distanceTo: function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    },
    distanceToSquared: function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    },
    setEulerFromRotationMatrix: function (m, order) {
        console.error('Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
    },
    setEulerFromQuaternion: function (q, order) {
        console.error('Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
    },
    getPositionFromMatrix: function (m) {
        console.warn('Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
        return this.setFromMatrixPosition(m);
    },
    getScaleFromMatrix: function (m) {
        console.warn('Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
        return this.setFromMatrixScale(m);
    },
    getColumnFromMatrix: function (index, matrix) {
        console.warn('Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
        return this.setFromMatrixColumn(index, matrix);
    },
    setFromMatrixPosition: function (m) {
        this.x = m.elements[12];
        this.y = m.elements[13];
        this.z = m.elements[14];
        return this;
    },
    setFromMatrixScale: function (m) {
        var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
        var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
        var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    },
    setFromMatrixColumn: function (index, matrix) {
        var offset = index * 4;
        var me = matrix.elements;
        this.x = me[offset];
        this.y = me[offset + 1];
        this.z = me[offset + 2];
        return this;
    },
    equals: function (v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    },
    fromArray: function (array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        return this;
    },
    toArray: function () {
        return [this.x, this.y, this.z];
    },
    clone: function () {
        return new Vector3(this.x, this.y, this.z);
    }
};
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//
var first = false;
var second = false;
var third = false;
var fourth = false;
var cat4 = false;
var cat5 = false;
var fourth = false;
var onComplete = true;
var currneAnim;

var preLoadImage1 = new Image();
var preLoadImage2 = new Image();
var preLoadImage3 = new Image();

var preLoadImage4 = new Image();
var preLoadImage5 = new Image();
var preLoadImage6 = new Image();
var preLoadImage7 = new Image();
var preLoadImage8 = new Image();

function load_img() {
    preLoadImage1.src = 'images_gl/loaderblock.jpg';
    preLoadImage5.onload = afterLoad;
}

function afterLoad() {
    $('#transPatch').css('display', 'block');
    $('.fullScreenBox,#close_btn,#logoAdidas,#logoPredator').css('visibility', 'visible');
}

$(document).ready(function () {
    load_img();
    $(document).on('click', '.playAll', autoPlayAllAnimations)
    $(document).on('click', '.pauseAll', autoPauseAllAnimations)
});

$(window).load(function () {
});

function closeSuperblaze() {
    scene.stop();
    $(window.parent).unbind('resize');
    setTimeout(function () {
        window.top.stopAutoplay();
        autoplayCatalog = window.top.autoplayCatalog;
        window.top.superblazeClosed();
    }, 300);
}

$(function () {
    resizePage(window.innerWidth, window.innerHeight);
    resizePage(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
    if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
        $("#close").css('display', 'none');
        $("#fullScreen").css('display', 'none');
    } else {
        $("#fullScreen").css('display', 'block');
    }

})
function closeOption() {
    for (i = 1; i <= 17; i++) {
        $("#colors" + i).css("display", "none");
        $("#forselectcolor" + i).css("display", "none");
    }
    $("#colorTextforcat5").css("display", "none");
}

$(window).load(function () {
    resizePage(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
    $(window).live('resize', function () {
        resizePage(window.innerWidth, window.innerHeight);
    });
    window.onresize = function (event) {
        resizePage(window.innerWidth, window.innerHeight);
    }

});

function onReset() {
    onResetCameraClickGL(); //in _ui.js
}

function onZoomSlide(event, ui) {
    var val = -20 * (ui.value / 100) + 10;
    NavSetDolly(val);
    updateZoomBar(val);
    scene.clearRefine();
}

$(function () {
    $('#zoom_slider').slider({
        orientation: "vertical",
        value: 155,
        min: 0,
        max: 205,
        slide: onZoomSlide
    });
    $('nodrag').on('dragstart', function (event) {
        event.preventDefault();
    });
    $('.nodrag').mousedown(function () {
        return false
    });
});

function buttonsZoom(value) {
    var delta = value;
    var deltaScene = (delta * 0.03) * (0.3);
    deltaScene = -deltaScene;
    if (NavSetDolly(g_navDolly + deltaScene)) {
        scene.clearRefine();
        updateZoomBar(g_navDolly - 10);
    }
}

var updateEnabled = true;
var canvas = null,
    canvas2 = null;
var scene = null,
    scene2 = null;
var _scenePollInterval;
var outstandingJobs;
var totalJobs;
var firstTime = true;
var tempW = 5;
var animationLoading;
var autoplayAnim = false;


$(document).ready(function () {
    animationLoading = setInterval(function () {
        tempW = tempW + 1;
        if (tempW > 30) tempW = 30;
        $("#loaderbar").css("width", tempW + "px");

    }, 100);
})

function isSuperblazeReady() {
    if (scene) {
        scene.start();
        outstandingJobs = scene.getOutstandingJobs();
        scene.gotoPosInTime(0.310710362172653, 0.09103607346410204, -2.384132972905103, -1.070085900494059, 170, 1);
        if (!(scene._projectparsed)) {
            if (firstTime) {
                firstTime = false;
            }
        } else if (outstandingJobs <= 0 && scene._prepared) {
            onSuperBlazeReady();
            clearInterval(_scenePollInterval);
        } else if (scene._projectparsed) {
            clearInterval(animationLoading);
            updateProgressBar();
        }
    }

}

function updateProgressBar() {
    totalJobs = scene.getTotalJobs();
    outstandingJobs = scene.getOutstandingJobs();
    var perc = 100 - Math.round(outstandingJobs / totalJobs * 100);
    var newwidth = 50 + 141 * perc / 100;
    if (newwidth < 30) newwidth = 30;
    $("#loaderbar").css("width", newwidth + "px");
}

$(function () {
    $(".accordion").accordion({
        heightStyle: "content",
        collapsible: true,
        speed: 'slow',
        active: false
    });
    $('.accordion h3#autoPlays').addClass('ui-state-disabled').off('click');
    $('.accordion h3#menu2').addClass('ui-state-disabled').off('click');
    $('.accordion h3#menu5').addClass('ui-state-disabled').off('click');
    $(".accordion h3#menu7").addClass("ui-state-disabled").off('click');
    $('.accordion h3#menu9').addClass('ui-state-disabled').off('click');
    $(".accordion h3#menu10").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu11").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu12").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu4").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu6").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu8").addClass("ui-state-disabled").off('click');
    $(".accordion h3#menu99").addClass("ui-state-disabled").off('click');
});

$(document).ready(function () {
});

var animStoped = true;
var animCntrlBlock = true;
$(window).load(function () {
    var fc = true;

    $(".menuitemsBase").click(function () {
        $("#panel").fadeToggle(200);
        autoPauseAllAnimations();
    });

    $(".menuitems").click(function () {
        if (!clickEventActive && !autoRotateState) return;

        scene._nav._navMinDolly = 90;
        scene._nav._navMaxDolly = 250;
        setTimeout(Autoplayfive, 5000);
        autoRotateStop();
        clearInterval(autoRotateInterval);
        clearTimeout(autoPlayInt);
        clearTimeout(myVar);
        clearTimeout(startAutorot);
        $("#dummy-canvas").css("pointer-events", "all");
        $("#rightAnim").css("display", "block");
        $("#point10text").css("display", "none");
        $('#point14text').css('display', 'none');
        $('#point13text').css('display', 'none');
        $('#point21text').css('display', 'none');
        $("#transPatch5").css('display', 'none');
        $("#cpHeading").show();
        firstAnim = true;
        animblockStopped = false;
        setTimeout(function () {
            animblockStopped = true;
        }, 2000)
        animStoped = false;
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];

        $(".menuitems").removeClass('active');

        $(".menuitems").css("background-color", "").css("opacity", "");
        var newId = this.id;
        if (newId == "menu4") {
            $(this).removeClass('active');
            $(this).parents().prev(".menuitems").addClass('active');
        }
        $(this).addClass('active');
        for (var j = 1; j <= 22; j++) { translateOut(j); }
        $(".noselect.pointcontent").removeClass("BlockClass");

        var a = "This is where the active feature text is shown -in a space saving place";
        $("#point2text .descriptionDemo").html(a);
        $("#point3text .descriptionDemo").html(a);
        $("#point7text .descriptionDemo").html(a);
        $("#point5text .descriptionDemo").html(a);
        $(".greyOutBox").removeClass("disabled");
        $(".animPlayBtns .greyOutBox, .greyOutBox").removeClass("redOutBox");
        $("#cpSubHeading").text("");
        if (autoplayAnim) autoPauseAllAnimations();
        currneAnim = Number(newId.slice(4));
        console.log("currneAnim", currneAnim);
        console.log("id", newId, "currentAnimation", currneAnim);
        objectHide();
        switch (newId) {
            case "menu2":
                $(".accordion").accordion("option", "active", false);
                menu2Click();
                break;
            case "menu3":
                $(".accordion").accordion("option", "active", false);
                $("#accordion3").accordion("option", "active", 0);
                menu3Click();
                break;
            case "menu4":
                menu4Click();
                break;
            case "menu14":
                menu14Click();
                break;
            case "menu17":
                $(".accordion").accordion("option", "active", false);
                menu17Click();
                break;
            case "menu18":
                menu18Click();
                break;
            case "menu7":
                $(".accordion").accordion("option", "active", false);
                $("#accordion1").accordion("option", "active", 1);
                menu7Click();
                break;
            case "menu13":
                menu13Click();
                break;
            case "menu9":
                menu9Click();
                break;
            case "menu8":
                menu8Click();
                break;
            case "menu5":
                $(".accordion").accordion("option", "active", false);
                menu5Click();
                break;
            case "menu6":
                $(".accordion").accordion("option", "active", false);
                $("#accordion1").accordion("option", "active", 2);
                menu6Click();
                break;
            case "menu16":
                menu16Click();
                break;

            case "menu12":
                $(".accordion").accordion("option", "active", false);
                $("#accordion2").accordion("option", "active", 0);
                menu12Click();
                break;
            case "menu20":
                menu20Click();
                break;
            case "menu10":
                $(".accordion").accordion("option", "active", false);
                $("#accordion2").accordion("option", "active", 2);
                menu10Click();
                break;
            case "menu11":
                $(".accordion").accordion("option", "active", false);
                menu11Click();
                break;
            case "menu21":
                menu21Click();
                break;
        }
    });

    $(".point11click").click(function () {
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        if (autoplayAnim) autoPauseAllAnimations();
        menu11Fadeout();
        $("#point13text2").fadeIn(500);
        $("#point13text3").fadeIn(500);
        $("#point13text4").fadeIn(500);
        $("#point13text7").fadeIn(500);
        var pointId = this.id;
        console.log("pointId", pointId);
        if (pointId == "point13text2") {
            console.log("point13text2");
            point11anim1();
        } else if (pointId == "point13text3") {
            console.log("point13text3");
            point11anim2();
        } else if (pointId == "point13text4") {
            console.log("point13text4");
            point11anim3();
        }
        else if (pointId == "point13text7") {
            console.log("point13text7");
            point11anim4();
        }
    });

    $(".point13click").click(function () {
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        if (autoplayAnim) autoPauseAllAnimations();
        menu11Fadeout();
        notrepeat = false;

        var pointId = this.id;
        console.log("pointId", pointId);
        if (pointId == "point13text2") {
            point11anim1();
        } else if (pointId == "point13text3") {
            point11anim2();
        } else if (pointId == "point13text4") {
            point11anim3();
        } else if (pointId == "point13text5") {
            point11anim4();
        } else if (pointId == "point13text6") {
            point11anim5();
        } else if (pointId == "point13text7") {
            point11anim6();
        } else if (pointId == "point13text8") {
            point11anim7();
        }
    });
});


var firstAnim = true;
function fadingEffect(selector) {
    //    animStoped = false;
    firstAnim = false;
    var width = $("#" + selector).width();
    console.log("width", width);
    for (i = 100; i > 0; i--) {
        $("#" + selector).animate({ width: i + "%" }, 0.5);
    }
}

function imgPreLoader() {
    $.preloadImages = function () {
        for (var i = 0; i < arguments.length; i++) {
            $("<img />").attr("src", arguments[i]);
        }
    }

    $.preloadImages(
        "./images_gl/Play.svg",
        "./images_gl/Lenovo.svg",

    );
}

function UiLoader() {

    $("#hamb img").attr("src", "./images_gl/hamburger.png");
    $("#resetBtn img").attr("src", "./images_gl/reset.svg");
    $("#lenovo_logo img").attr("src", "./images_gl/Lenovo.svg");
    $("#pauseplayImg img").attr("src", "./images_gl/Play.svg");
    $("#pauseplayImg img").attr("src", "./images_gl/Play.svg");
    $("#lenovo_logo img").attr("src", "./images_gl/Lenovo.svg");

    $("#hotspot1plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot2plus.plus").attr("src","./images_gl/NVMe/2X110.png");
    $("#hotspot3plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot4plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot52plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot62plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot72plus.plus").attr("src","./images_gl/NVMe/1.png");
    $("#hotspot5plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot6plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot7plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot8plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot9plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot10plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot11plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot111plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot1111plus.plus").attr("src","./images_gl/PCIe/23X137.png");
    $("#hotspot112plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot113plus.plus").attr("src", "./images_gl/PCIe/23X137.png");
    $("#hotspot12plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot13plus.plus").attr("src","./images_gl/NVMe/2X110.png");
    $("#hotspot14plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot15plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot155plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot16plus.plus").attr("src","./images_gl/NVMe/23_60.png");
    $("#hotspot114plus.plus").attr("src","./images_gl/NVMe/1.png");
    $("#hotspot17plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot18plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot19plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot20plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot21plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot22plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot23plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot24plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot25plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot26plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot27plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot28plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot29plus.plus").attr("src", "./images_gl/PCIe/120X16.png");
    $("#hotspot30plus.plus").attr("src", "./images_gl/PCIe/120X16.png");
    $("#hotspot31plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot32plus.plus").attr("src", "./images_gl/PCIe/4.png");
    $("#hotspot33plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot34plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot35plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot36plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot37plus.plus").attr("src", "./images_gl/PCIe/23X119.png");
    $("#hotspot38plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot39plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot40plus.plus").attr("src", "./images_gl/PCIe/44.png");
    $("#hotspot41plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot42plus.plus").attr("src", "./images_gl/PCIe/4.png");
    $("#hotspot43plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot211plus.plus").attr("src", "./images_gl/PCIe/90X23.png");
    $("#hotspot212plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot213plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot213plus1.plus1").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot214plus.plus").attr("src", "./images_gl/NVMe/1.png");
    $("#hotspot215plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot216plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot217plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot311plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot312plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot313plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot314plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot315plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot316plus.plus").attr("src", "./images_gl/NVMe/90X23.png");
    $("#hotspot317plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot318plus.plus").attr("src", "./images_gl/PCIe/1.png");
    $("#hotspot319plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot320plus.plus").attr("src", "./images_gl/NVMe/23X137.png");
    $("#hotspot321plus.plus").attr("src", "./images_gl/NVMe/23X137.png");
    $("#hotspot322plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot411plus.plus").attr("src", "./images_gl/PCIe/4-1.png");
    $("#hotspot412plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot413plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot414plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot415plus.plus").attr("src", "./images_gl/PCIe/2X110.png");
    $("#hotspot416plus.plus").attr("src", "./images_gl/NVMe/23_60.png");
    $("#hotspot417plus.plus").attr("src", "./images_gl/PCIe/2X110.png");


    $("#hotspot91plus.plus").attr("src","./images_gl/PCIe/90X23.png");
    $("#hotspot92plus.plus").attr("src","./images_gl/PCIe/90X23.png");
    $("#hotspot93plus.plus").attr("src","./images_gl/PCIe/90X23.png");
    $("#hotspot94plus.plus").attr("src","./images_gl/PCIe/23X119.png");
    $("#hotspot95plus.plus").attr("src","./images_gl/PCIe/2X110.png");
    $("#hotspot96plus.plus").attr("src","./images_gl/PCIe/2X110.png");
    $("#hotspot97plus.plus").attr("src","./images_gl/NVMe/4.png");
    $("#hotspot98plus.plus").attr("src","./images_gl/NVMe/1.png");

    $("#point10image1 img").attr("src", "./images_gl/lenovo-clarity.svg");

    $("#home img").attr("src", "./superblaze_demo_images/reset.png");

    $("#point7image1 img").attr("src", "images_gl/Amd.svg");
    $("#point8image1 img").attr("src", "images_gl/Amd.svg");
    $("#point1image2 img").attr("src", "images_gl/Amd.svg");

    $("#point21img2 img").attr("src", "./images_gl/remote.png");
    $("#point21img1 img").attr("src", "./images_gl/lenovo-clarity.svg");
    $("#point21webimg1").attr("src", "./images_gl/mobile/screen1.jpg");
    $("#point21webimg2").attr("src", "./images_gl/mobile/screen2.jpg");
    $("#point21webimg3").attr("src", "./images_gl/mobile/screen3.jpg");
    $("#point21webimg4").attr("src", "./images_gl/mobile/screen4.jpg");

    $("#point111_server_img1 img").attr("src","./images_gl/server/front.png");
    $("#point111_server_img2 img").attr("src","./images_gl/server/rear.png");

    imgPreLoader();
	var img = new Image();
      img.onload = function(){
    }

    loadScreens();
}

function menuFading() {
}

function onSuperBlazeReady() {
    scene._jitRadius = 3;
    scene._zNearMin = 5.0;
    // if (mob) scene._bDoF = false;
    window.addEventListener('focus', onWindowFocus, false);
    window.addEventListener('blur', onWindowBlur, false);

    end = new Date().getTime();
    var time = end - start;
    if (time < 60000) {
        // RT_RecordTiming("Load", time, "ThinkSystem SR550");
    }
    console.log('End time: ' + time);

    if (autoplayCatalog) {
        setTimeout(function () {
            autoPlayAllAnimations();
        }, 8000);
    }

    setTimeout(function () {
        showScene();
        scene.instanceSet("Hot_spot", "visible", false);
        $("#reset").css("visibility", "visible");
        $("#transPatch2").css("display", "none");
        $("#loader,#loader1,#loader2,#transPatch").css("display", "none");
        $("#canvasContainer").css("visibility", "visible");
        $("#superblazeWrapper").css('display', 'block');
        $("#superblaze").css('display', 'block');
        $("#pointtext1 div, #pointtext1 ul").css("display", "none");
        $("#transPatch5").css('display', 'none');
        $('#reset').css('visibility', 'visible');
        $("#point3Div").css('display', 'none');
        $("#point5Div").css('display', 'none');
        $("#transPatchDiv").css('display', 'none');
        $("#HeadingDiv").css('display', 'none');
        if ((navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
            //console.log("ie")
            $("#fullScreen").css('display', 'none');
            $("#loader,#loader1,#loader2,#transPatch").css("display", "none");
        } else {
            $("#fullScreen").css('display', 'block');
        }
    }, 500);

    UiLoader();
}

$(document).ready(function () {
    try {
        parent.document;
        // accessible
        resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);
        if (window.parent.parent.bandwidth) {
            autoplayCatalog = window.parent.autoplayCatalog;
            ////console.log("content window"+autoplayCatalog);
        } else {
            autoplayCatalog = false;
            $("#home").css("display", "none");
            $("#backText").css("display", "none");
        }
        $(window.parent).bind('resize', function () {
            resizePage(window.parent.innerWidth, window.parent.innerHeight);
        });
        window.onresize = function (event) {
            resizePage(window.parent.innerWidth, window.parent.innerHeight);
        }
        $(window).bind("fullscreen-toggle", function (e, state) {
            ////console.log("full toggle");
            resizePage(window.parent.document.documentElement.clientWidth, window.parent.document.documentElement.clientHeight);
        });
    } catch (e) {
        // not accessible
        resizePage(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
        autoplayCatalog = false;
        $("#home").css("display", "none");
        $("#backText").css("display", "none");
        $(window).bind('resize', function () {
            resizePage(window.innerWidth, window.innerHeight);
        });
        window.onresize = function (event) {
            resizePage(window.innerWidth, window.innerHeight);
        }
        $(window).bind("fullscreen-toggle", function (e, state) {
            ////console.log("full toggle");
            resizePage(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
        });
    }
});


function SuperblazeStart(gl) {
    try {
        parent.document;
        resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);
        $(window).resize(function () {
            resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);

        });

    } catch (e) {
        resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);
        $(window).resize(function () {
            resizePage(document.documentElement.clientWidth, document.documentElement.clientHeight);

        });

    }
    canvas = document.getElementById("superblaze-canvas");
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1)) {
        scene = new infinityrt_scene({ rtgl: gl, useDraco: false }, "model_gl/", canvas.width, canvas.height, undefined, undefined, undefined, InitialSceneState, AllGeometryComplete);
        //console.log("mob");
     } else {
        scene = new infinityrt_scene({ rtgl: gl, useDraco: false }, "model_gl/", canvas.width, canvas.height, undefined, undefined, undefined, InitialSceneState, AllGeometryComplete);
        //console.log("desk");
     }
    scene.fnLoadProgress = updateProgressBar;
    scene.start();
    scene._nav = new infinityrt_navigation(scene, canvas.width, canvas.height);
    _scenePollInterval = setInterval(isSuperblazeReady, 100);
    start = new Date().getTime();
    //    NavInit(canvas.width, canvas.height);
    var canvasDummy = document.getElementById("superblaze-canvas");
    addMouseListeners(canvasDummy);
    /* scene._slowinoutfac = 0.9;*/
    if (scene != null) {

        window.requestAnimationFrame(frameUpdate);
        $(this).bind("contextmenu", onRightClick); //prevents a right click     
        document.body.oncontextmenu = onRightClick;
    }
    initDragCursor();
}
var mob = (navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPod') != -1);
var FullscreenOff = false;

function launchFullscreen(element) {
}
var AllgeoIntl = false;
var InHotspot = false;

function InitialSceneState() {
    InHotspot = true;
    scene.groupApplyState('INTERNAL_HIDE');
    scene.clearRefine();
 }

function AllGeometryComplete() {
    AllgeoIntl = true;
    console.log('All time: ' + (new Date().getTime() - start));
 }

function exitFullscreen() {
}

window.document.onkeyup = function (e) {
    // console.log("ECS pressed IE1");
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        var iE = 0;
        var _intervalEsc = setInterval(function () {
            if (iE < 5) {
                // console.log("func"+iE);
                //                exitFullscreen(window.parent.document.documentElement);
                iE++;
            } else {
                clearInterval(_intervalEsc);
            }
        }, 10);
    }
}

var FullscreenOn = false;
function resizePage1(width, height) {

}
function resizePage(width, height) {
    var s;

    try {
        parent.document;
        if (window.parent.parent.bandwidth == "high") {
            if (width > 1080) {
                width = 1080;
            }
            if (height > 1920) {
                height = 1920;
            }

        } else {
            if (width > 1080) {
                width = 1080;
            }
            if (height > 1920) {
                height = 1920;
            }

        }

    } catch (e) {
        // not accessible
        if (width > 1080) {
            width = 1080;
        }
        if (height > 1920) {
            height = 1920;
        }

    }
    var w = eval(width / 1080);
    var h = eval(height / 1920);

    if (w < h) {
        s = w;

        var div = document.getElementById("superblaze-canvas");
        if (div.getBoundingClientRect) {        // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+
            var rect = div.getBoundingClientRect();
            new_w = rect.right - rect.left;
            new_h = rect.bottom - rect.top;
        }
        else {
            ////console.log("Your browser does not support this example!");
        }
        try {
            parent.document;
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.parent.innerHeight - new_h) / 2
            });
        } catch (e) {
            // not accessible

            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });
        }

    }
    else {

        s = h;
        var div = document.getElementById("superblaze-canvas");
        if (div.getBoundingClientRect) {        // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+
            var rect = div.getBoundingClientRect();
            new_w = rect.right - rect.left;
            new_h = rect.bottom - rect.top;
        }
        else {
            ////console.log("Your browser does not support this example!");
        }
        try {
            parent.document;
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.parent.innerHeight - new_h) / 2
            });

        } catch (e) {
            // not accessible
            $('#superblaze').css({
                'margin-left': (($(window).width() - new_w) / 2),
                'margin-top': parseInt(window.innerHeight - new_h) / 2
            });

        }
    }
    $("#superblaze").css({
        'transform': 'scale(' + s + ')',
        'transform-origin': '0% 0%',

        '-webkit-transform': 'scale(' + s + ')',
        '-webkit-transform-origin': '0% 0%',

        '-moz-transform': 'scale(' + s + ')',
        '-moz-transform-origin': '0% 0%',

        '-o-transform': 'scale(' + s + ')',
        '-o-transform-origin': '0% 0%',

        '-ms-transform': 'scale(' + s + ')',
        '-ms-transform-origin': '0% 0%',
    });
}

function addMouseListeners(canvas) {
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousewheel', mouseWheel, false);
    canvas.addEventListener('DOMMouseScroll', mouseWheel, false);
    canvas.addEventListener('mouseout', mouseOut, false);
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchend', touchEndCan, false);
    //  document.getElementById('rightAnim').addEventListener('mousedown', rightAnimClick, false);
    // document.getElementById("home").addEventListener("mousedown", closeSuperblaze);
}

var rightAnimToggle = true;
var animblockStopped = true;
var timeoutsnew = [];
var timeouts = [];
/*abhijitend*/

function rightAnimClick() {
    //	reversAll();
    if (rightAnimToggle) {
        $("#rightAnim").animate({ right: '0px' }, "slow");
        rightAnimToggle = false;
    } else {
        $("#rightAnim").animate({ right: '-235px' }, "slow");
        rightAnimToggle = true;
    }
}

function mouseDownHide() {
    $(".point3headingText").css("opacity", "0");
    $(".point6headingText").css("opacity", "0");
    $(".point7headingText").css("opacity", "0");
    $(".point7text1").css("opacity", "0");
    $("#point7image1").css("opacity", "0");
    $(".point8headingText").css("opacity", "0");
    $(".point8text1").css("opacity", "0");
    $("#point8image1").css("opacity", "0");

}

function mouseWheelHide() {
    $("#point17text").css('display', 'none');
    $("#point19text").css('display', 'none');
    $('#point4text').css("display", "none");
    $('#point5text').css("display", "none");
    $('#point6text').css("display", "none");
    $('#point7text').css("display", "none");
    $('#point8text').css("display", "none");
    $('#point9text').css("display", "none");
    $("#point13text").css('display', 'none');
    $("#point14text").css('display', 'none');
    $("#point15text").css('display', 'none');
    $("#point16text").css('display', 'none');
    $("#hotspot155").css('display', 'none');
    $("#hotspot1").css('display', 'none');
    $("#hotspot2").css('display', 'none');
    $("#hotspot3").css('display', 'none');
    $("#hotspot4").css('display', 'none');
    $("#hotspot4040").css('display', 'none');
    $("#hotspot5050").css('display', 'none');
    $("#hotspot6060").css('display', 'none');
    $("#hotspot17").css('display', 'none');
    $("#hotspot18").css('display', 'none');
    $("#hotspot19").css('display', 'none');
    $("#hotspot20").css('display', 'none');
    $("#hotspot21").css('display', 'none');
    $("#hotspot211").css('display', 'none');
    $("#hotspot212").css('display', 'none');
    $("#hotspot213").css('display', 'none');
    $("#hotspot214").css('display', 'none');
    $("#hotspot5").css('display', 'none');
    $("#hotspot6").css('display', 'none');
    $("#hotspot7").css('display', 'none');
    $("#point6text9").css('display', 'none');
    $("#point12text").css('display', 'none');
    $("#point11text").css('display', 'none');
    $("#point111text").css('display', 'none');
    $("#point18text").css('display', 'none');
    $("#point20text").css('display', 'none');
    
}

function divHide() {
}

function objectHide() {
    topCover = false;
    mouseWheelHide();
    scene.animPlayInTime("Chassi_Top",0,1);
    scene.animPlayInTime("NVME_back",0,1);
    scene.animPlayInTime("Handel_metal",0,1);
    scene.animPlayInTime("STATUS_DASHBOARD",0,1);
    scene.animPlayInTime("Net_Screen",0,1);
    
    // scene.groupApplyState('REMOTE_WIRE_OFF');
    // scene.groupApplyState('Remote_with_Cable_OFF');
    scene.groupApplyState('Wire_Hide');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Remote_hide');
    scene.groupApplyState('Top_Cover_on');
    scene.groupApplyState('REF_VERTICAL');
    scene.groupApplyState('MB_OFF');
    scene.groupApplyState('Server_show_new');
    scene.clearRefine();
    setTimeout(function () {
        clickEventActive = true;
    }, 100);
}

var open = false;
var close = false;

function objectsHidenew() {
    scene.animPlayInTime("Cover", 0, 1);
    scene.animPlayInTime("Trey_Handle", 0, 1);
    scene.animPlayInTime("Ex_Tray", 0, 1);
    scene.animPlayInTime("lcd_tray", 0, 1);
    scene.animPlayInTime("lcd_hing", 0, 1);
    scene.animPlayInTime("Ex_Tray_center", 0, 1000);

    scene.instanceSet("Cover", "visible", false);
    scene.instanceSet("Ex_Tray", "visible", false);
    scene.instanceSet("Trey_Handle", "visible", false);
    scene.instanceSet("body", "visible", true);
}


function menu2Click() {
    console.log("menu2Clicked");
    // objectsHidenew();
    animStoped = false;
    $("#cpHeading").text("Thinksystem SR650 V3");
    $("#cpHeading").css("color", "black");
    $("#cpHeading").show();
    $("#onloadCopy").css('display', 'block');
    $("#transparentPatch").css('display', 'none');
    $("#transPatch5").css('display', 'none');

    objectHide();
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');

    scene.gotoPosInTime(0.310710362172653, 0.09103607346410204, -2.384132972905103, -1.070085900494059, 170, 1000);
    startAutorot = timeouts.push(setTimeout(function () {
        autoRotateCall();
        console.log("autoRotateCall");
    }, 2100));

    timeouts.push(setTimeout(function () {
        $("#onloadCopy").fadeIn(400);

        timeouts.push(setTimeout(function () {
            translateIn(2);
            animComplete();
        }, 200));

        if (autoplayAnim) {
            animCompeteAuto();
        }

        $("#onloadCopy").css({
            "webkitTransform": "translate(0,-5px)",
            "MozTransform": "translate(0,-5px)",
            "msTransform": "translate(0,-5px)",
            "OTransform": "translate(0,-5px)",
            "transform": "translate(0,-5px)",
            "opacity": 1
        });

    }, 2050));

    top_cover = false;
    scene.clearRefine();

}

function menu3Click() {
    console.log("menu3_click");
    animStoped = false;
    objectHide();
    scene.groupApplyState('Server_show_new');
    $("#cpHeading").text("2.5-inch Drive Configuration");
    $("#cpHeading").show();
    $("#onloadCopy").css('display','none');

    $("#menu4").removeClass("active");
    $("#menu4 .greyOutBox").addClass("redOutBox");

    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
 
    //check ref
    scene.groupApplyState('REMOTE_WIRE_OFF');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Remote_hide');
    scene.groupApplyState('Top_Cover_ON');
    scene.animPlayInTime("HDD_CAGE_SR655",0,0);
    scene.animPlayInTime("NVME_back",0,0);
    scene.animPlayInTime("Handel_metal",0,0);
    scene.animPlayInTime("Chassi_Top",0,1000);
 
    scene.groupApplyState("GP_ON");
    scene.gotoPosInTime(6.216692405045265, 0.005304073464102062, 1.4692997072480447, -1.3848181741363663, 175.14432637717911, 1000, function () {
        $("#point19text").css('display', 'block');
        $(".cur").css('display', 'block');

    });
    timeouts.push(setTimeout(function () {

        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));

        if (autoplayAnim) {
            animCompeteAuto();
        }

    }, 2000));
    // } 

    scene.clearRefine();
}
var storage_dfr = false;
var menu9Clicked = false;

function menu4Click() {
    console.log("menu4Clicked");
    animStoped = false;
    scene.groupApplyState('Server_show_new');
    $("#transPatch5").css('display', 'none');
    $("#cpHeading").text("2.5-inch Drive Configuration");
    $("#onloadCopy").css('display', 'none');
    $("#menu3").addClass('active');
    $("#menu4").removeClass('active');
    $("#menu4").removeClass("disabled");
    $("#menu4").removeClass('active');
    $(".greyOutBox").removeClass('redOutBox');
    $("#menu4 .greyOutBox").addClass('redOutBox');

    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
 
    //check ref
    scene.groupApplyState('REMOTE_WIRE_OFF');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Remote_hide');
    scene.groupApplyState('Top_Cover_ON');
    scene.animPlayInTime("HDD_CAGE_SR655",0,0);
    scene.animPlayInTime("NVME_back",0,0);
    scene.animPlayInTime("Handel_metal",0,0);
    scene.animPlayInTime("Chassi_Top",0,1000);
 
    scene.groupApplyState("GP_ON");

    scene.gotoPosInTime(6.216692405045265, 0.005304073464102062, 1.4692997072480447, -1.3848181741363663, 175.14432637717911, 1000, function () {
        $("#point19text").css('display', 'block');
        $(".cur").css('display', 'block');
        animComplete();
    });
    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
            animCompeteAuto();
        }

    }, 2600));

    top_cover = false;
    
    scene.clearRefine();

}

function menu5Click() {
    console.log("menu5_click");
    animStoped = false;
    $("#cpHeading").text(" GPU-Rich Configuration");
    $("#menu5").addClass('active');
    $("#transPatch5").css('display', 'none');
    $("#menu5 .greyOutBox").addClass('redOutBox');
    $("#transparentPatch").css('display', 'none');
    $("#onloadCopy").css('display', 'none');
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('GPU_Rich_Configuration');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
    scene.groupApplyState('Internal_on');
    scene.groupApplyState('Top_Cover_OFF');
    scene.groupApplyState('NVME_2.5_3.5_OFF');
    scene.groupApplyState('GPU_Card_ON');
    scene.groupApplyState("GP_ON");
    scene.groupApplyState("NVME_off")
    scene.groupApplyState("HDD_NVME_4x2_off")

    scene.gotoPosInTime(0.8111365159615644, 0.5210535844213426, 1.1429460823097803, -1.9315143182667007, 210, 1000, function () {

        $("#point15text").show();
        $("#point15text1").css('display', 'block');
        $(".cur").css('display', 'block');
    });

    timeouts.push(setTimeout(function () {
        animComplete();
        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2000));
    scene.clearRefine();
}
var ScreenAnimInterval2;
var animCounter2 = 0;

function menu6Click() {
    console.log("menu6Clicked");

    $("#transPatch5").css('display', 'none');
    $("#onloadCopy").css('display', 'none');
    animStoped = false;
    menu6clicked = true;
    objectHide();
    animStoped = false;
    $("#cpHeading").html("Integrated Diagnostics Panel");

    scene._nav._navMinDolly = 60;
    scene._nav._panMin = [-15, -5]; //rigth top
    scene._nav._panMax = [15, 15]; //left bottom
    animCounter2 = 0;
    ScreenAnimInterval2 = setInterval(function () {
        TestChangeTexture(screens[animCounter2]);
        animCounter2++;
        if (animCounter2 == 8) {
            animCounter2 = 0;
        }
    }, 2000);
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Front_Panel_C_Net_HDD');
    scene.gotoPosInTime(0.4126661705418002, 0.25492599775761343, 2.357616790500371, -3.490444065753773, 71.9715567005837, 1500, function () {
        $("#point16text").css('display', 'block');
        $("#point16text1").show();
        scene.groupApplyState("3.5_inch_Drive_Configuation")
        scene.animPlayInTime("STATUS_DASHBOARD", 0.4580000, 1200);
        scene.animPlayInTime("Net_Screen", 0.8330000, 1200);
    });
    timeouts.push(setTimeout(function () {
        animComplete();
        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2600));
    scene.clearRefine();
}



function menu16Click() {
    console.log("menu_16_clicked");
    scene._nav._navMinDolly = 30;
    scene._nav._navMaxDolly = 70;
    scene._nav._panMin = [-5, -5]; //rigth top
    scene._nav._panMax = [5, 5]; //left bottom
    animStoped = false;
    $("#cpHeading").html("External Diagnostics Handset");
    $("#cpHeading").show();
    $("#onloadCopy").css('display','none');
    $("#menu6").addClass('active');
    $("#menu16").removeClass("disabled");
    $("#menu16").removeClass('active');
    $(".greyOutBox").removeClass('redOutBox');
    $("#menu16 .greyOutBox").addClass('redOutBox');
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
    scene.groupApplyState('Remote_with_Cable_ON');
    scene.animPlayInTime("REMOTE_SR650_V02", 0, 1000);
    animCounter2 = 0;
    ScreenAnimInterval2 = setInterval(function () {
        TestChangeTexture(screens[animCounter2]);
        animCounter2++;
        if (animCounter2 == 8) {
            animCounter2 = 0;
        }
    }, 2000);
    timeouts.push(setTimeout(function () {
        scene.groupApplyState('Front_Panel_B_Vertical_HDD');
        scene.groupApplyState('Remote_only_on');
        scene.groupApplyState('Remote_with_Cable_ON');
        scene.gotoPosInTime(6.078237040726571, 0.09876771980702823, 4.168175941877074, 2.0515981418242575, 140.737350348993808, 1000);

    }, 300));
    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            scene.gotoPosInTime(6.078237040726571, 0.09876771980702823, 4.168175941877074, 2.0515981418242575, 180, 1000);
        }, 600));
        scene.animPlayInTime("REMOTE_SR650_V02", 0, 600);
        scene.clearRefine();
    }, 2000));
    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            scene.gotoPosInTime(0.2335021332552908, 0.3582267498421072, -0.3501516641343965, 0.533717480557064, 40, 1000);
        }, 500));
        scene.groupApplyState('Server_hide_new');
        scene.groupApplyState('Remote_with_Cable_OFF');
        scene.groupApplyState('Remote_only_on');
        scene.animPlayInTime("REMOTE_SR650_V02", 0.7910000, 500);
        scene.clearRefine();
    }, 5000));
    timeouts.push(setTimeout(function () {
        $("#point20text").css('display', 'block');
        $("#point20text1").show();
    }, 1300));
    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
           animCompeteAuto();
        } 
     },6000));
     animComplete();
    scene.clearRefine();
}

function menu7Click() {
    console.log("menu7_click");
    animStoped = false;
    $("#cpHeading").html("3.5-inch Drive Configuration");
    $("#cpHeading").show();
    $("#onloadCopy").css('display', 'none');
    $("#menu7").addClass('active');
    $("#menu13").removeClass("active");
    $("#menu13 .greyOutBox").addClass("redOutBox");
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Card_Show');
    scene.groupApplyState('Top_Cover_ON');
    scene.groupApplyState('3.5_Inch_Drive_ON');
    scene.groupApplyState("GP_ON");
    scene.groupApplyState("REF_HORIZONTAL");
    scene.groupApplyState("3.5_inch_Drive_Configuation");
    scene.groupApplyState('Front_Panel_A_Horizontal_HDD');

    scene.gotoPosInTime(6.216692405045265, 0.005304073464102062, 1.4692997072480447, -1.3848181741363663, 175.14432637717911, 1000, function () {
        $("#point4text").css('display', 'block');
        $(".cur").css('display', 'block');
    });
    animComplete();
    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2500));
    scene.clearRefine();
}

function menu13Click() {
    console.log("menu13_click");
    animStoped = false;
    $("#cpHeading").html("3.5-inch Drive Configuration");
    $("#cpHeading").show();
    $("#onloadCopy").css('display', 'none');
    $("#menu7").addClass('active');
    $("#menu13").removeClass("active");
    $("#menu13 .greyOutBox").addClass("redOutBox");
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Card_Show');
    scene.groupApplyState('Top_Cover_ON');
    scene.groupApplyState('3.5_Inch_Drive_ON');
    scene.groupApplyState("GP_ON");
    scene.groupApplyState("REF_HORIZONTAL");
    scene.groupApplyState("3.5_inch_Drive_Configuation");
    scene.groupApplyState('Front_Panel_A_Horizontal_HDD');

    scene.gotoPosInTime(6.216692405045265, 0.005304073464102062, 1.4692997072480447, -1.3848181741363663, 175.14432637717911, 1000, function () {
        $("#point4text").css('display', 'block');
        $(".cur").css('display', 'block');
        animComplete();
    });
    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
            animCompeteAuto();
        }

    }, 2600));
    scene.clearRefine();
}

function menu14fadeOut() {
    $("#animdiv1").css('display', 'none');
    $("#animdiv2").css('display', 'none');
    $("#animdiv3").css('display', 'none');
    $("#animdiv4").css('display', 'none');
    $("#animdiv5").css('display', 'none');
    $("#animdiv6").css('display', 'none');
    $("#animdiv7").css('display', 'none');
    $("#animdiv8").css('display', 'none');
    $("#div1crossline").css('display', 'none');
    $("#div2crossline").css('display', 'none');
    $("#ringText").css('display', 'none');
    $("#meshText").css('display', 'none');
    $("#div1line").css('display', 'none').animate({ 'height': '0px' }, 10);
    $("#div2line").css('display', 'none').animate({ 'width': '0px', 'left': '550px' }, 10);
    $("#div3line").css('display', 'none').animate({ 'height': '0px', 'top': '350px' }, 10);
    $("#div4line").css('display', 'none').animate({ 'width': '0px' }, 10);
    $("#div5line").css('display', 'none').animate({ 'width': '0px' }, 10);
    $("#div6line").css('display', 'none').animate({ 'height': '0px', 'top': '350px' }, 10);
    $("#div7line").css('display', 'none').animate({ 'width': '0px', 'left': '980px' }, 10);
    $("#div8line").css('display', 'none').animate({ 'height': '0px' }, 10);
}

function menu8Click() {
    console.log("menu8click");
    animStoped = false;
    $("#onloadCopy").css('display','none');
    $("#cpHeading").text("3.5-inch Drive Configuration-Rear View");
    $("#menu7").addClass('active');
    $("#menu8").removeClass('active');
    $("#menu8 .greyOutBox").addClass('redOutBox');
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Card_Show');
    scene.groupApplyState('Top_Cover_ON');
    scene.groupApplyState('3.5_Inch_Drive_ON');
    scene.groupApplyState("GP_ON");
    scene.groupApplyState("REF_HORIZONTAL");
    scene.groupApplyState("3.5_inch_Drive_Configuation");
    scene.groupApplyState('Front_Panel_A_Horizontal_HDD');
    scene.gotoPosInTime(3.1228533775245864, 0.024000652723075104, 0.014641735671303, -1.3848181741363663, 165.14432637717911, 1000, function () {
        $("#point8text").css('display', 'block');
        $(".cur").css('display', 'block');
        translateIn(8);
    });
    timeouts.push(setTimeout(function () {

        animComplete();
        if (autoplayAnim) {
            animCompeteAuto();
        }

    }, 2000));
    scene.clearRefine();
}

function menu9Click() {
    console.log("menu9Clicked");
    animStoped = false;
    $("#point18text").css('display', 'none');
    $("#menu7").addClass('active');
    $("#menu9").removeClass("active");
    $("#menu9 .greyOutBox").addClass("redOutBox");
    $("#cpHeading").html("3.5-inch Drive Configuration-Interior View");
    $("#cpHeading").show();
    $("#onloadCopy").css('display', 'none');
    objectHide();
    scene.groupApplyState('Front_Panel_A_Horizontal_HDD');
    scene.groupApplyState('INTERNAL_ON');
    // scene.groupApplyState('Top_Cover_OFF');
    scene.groupApplyState('3.5_inch_Drive_Configuation');
    scene.groupApplyState('Extra_part_OFF');

    scene.gotoPosInTime(5.562946856604739,0.4531939058193576,-1.7956863385817967,4.393360640626445,210, 1000, function () {
        // topCover = true;

        // scene.animPlayInTime("NVME_back", 0.83, 1000);
        // scene.animPlayInTime("Handel_metal", 0.83, 1000);
        // timeouts.push(setTimeout(function () {
        //     $("#point12text").css('display', 'block');
        //     $(".cur").css('display', 'block');
        //     translateIn(12);
        //     animComplete();
        // }, 700));
        scene.animPlayInTime("Chassi_Top",1,1000,function () {
            scene.groupApplyState('Top_Cover_OFF');

            scene.groupApplyState('MB_ON');
            scene.groupApplyState('Front_Panel_A_Horizontal_HDD');
            scene.groupApplyState('3.5_inch');         

            scene.animPlayInTime("NVME_back",5,1000);
            scene.animPlayInTime("Handel_metal",0.83,500,function () {
               $("#point12text").css('display','block');
               $(".cur").css('display', 'block');
               translateIn(12);
            });
         });
      });
      
    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));
        if (autoplayAnim) {
            animCompeteAuto();
         } 
    }, 2500));
    scene.clearRefine();
}

var menu10clicked = false;
var a;

function menu10Click() {
    console.log("menu10Clicked");
    $("#transPatch5").css('display', 'block');
    autoRotateState = false;
    animStoped = false;
    $("#cpHeading").text(" ");
    $("#onloadCopy").css("display", "none");
    $("#dummy-canvas").css("pointer-events", "none");
    $("#rightAnim").css("display", "none");
    objectHide();
    scene.groupApplyState('Internal_off');
    scene.groupApplyState('REMOTE_WIRE_OFF');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Remote_hide');
    scene.groupApplyState('Server_hide_new');
    $("#point10text").show();
    translateIn(10);
    timeouts.push(setTimeout(function () {
        animComplete();
    }, 500));

    if (autoplayAnim) {
        animCompeteAuto();
    }
    top_cover = true;
    scene.clearRefine();

}

function menu11Fadeout() {
    $(".point13click, .point13click img,#point13text8 span").stop();
    $('#point13text8 span,.point13click img').removeAttr('style');
    $(".point13textContent").fadeOut(1);
}

var menu11Clicked = false;
var notrepeat = true;

function menu11Click() {
    console.log("menu11Clicked");
    objectHide();
    menu11Fadeout();
    autoRotateState = false;
    notrepeat = true;
    animStoped = false;
    $("#cpHeading").text("Lenovo Infrastructure Services");
    $("#onloadCopy").css("display", "none");
    $("#dummy-canvas").css("pointer-events", "none");
    $("#rightAnim").css("display", "none");
    $("#transPatch5").css('display', 'block');
    $("#cpHeading,#point13text1,#point13text1SubContent").show();
    scene.groupApplyState('Server_hide_new');
    scene.groupApplyState('Internal_off');
    $("#point13text").css('display', 'block');
    timeouts.push(setTimeout(function () {
        $("#point13text").css('display', 'block');
        autoRotateStop();
        animComplete();
    }, 1000));

    if (menu11Clicked) {
        point11anim1();
    } else {
        timeouts.push(setTimeout(function () {
            point11anim1();
        }, 3000));

    }
    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 32000));

    top_cover = true;
    scene.clearRefine();
}

function point11anim1() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text2 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent1").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text2 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        /* $("#point12text2 img").animate({
           width: '44px'
        },300); */
        $("#point13textContent1").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim2();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim2() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text3 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent2").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text3 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        $("#point13textContent2").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim3();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim3() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text4 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent3").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text4 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        $("#point13textContent3").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim4();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim4() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text5 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent4").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text5 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        $("#point13textContent4").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim5();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim5() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text6 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent5").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text6 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        $("#point13textContent5").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim6();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim6() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text7 img').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', '2px solid #3e8ddc');
                $(this).css('background-color', '#3e8ddc');
                $(this).css('border-radius', '50%');
            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent6").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/us/en/infrastructure-services");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text7 img').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('border', 'none');
                $(this).css('border-radius', 'none');
            }
        }, 10);
        $("#point13textContent6").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim7();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

function point11anim7() {
    timeouts.push(setTimeout(function () {
        $("#point13text1,#point13text1SubContent").fadeOut(100);
        $('#point13text8 span').animate({
            num: 25
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');

            }
        }, 10);
    }, 100));
    timeouts.push(setTimeout(function () {
        $("#point13textContent7").fadeIn(500);
        $("a").attr("href", "https://techtoday.lenovo.com/ww/en/solutions/media/12951/");
    }, 200));
    timeouts.push(setTimeout(function () {
        $('#point13text8 span').animate({
            num: 0
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('-moz-transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                $(this).css('transform', 'translate(-50%, -50%) scale(1.' + now + ')');
                // $(this).css('border','none');
                // $(this).css('border-radius','none');
            }
        }, 10);
        $("#point13textContent7").fadeOut(500);
    }, 6000));
    timeouts.push(setTimeout(function () {
        if (notrepeat) {
            point11anim1();
        }
        if (!notrepeat) {
            $("#point13text1,#point13text1SubContent").fadeIn(100);
        }
    }, 6050));
}

var top_cover = true;

function menu12Click() {
    autoRotateState = false;
    clearTimeout(myVar);
    console.log("menu12_click");
    $("#onloadCopy").css("display", "none");
    $("#cpHeading").text(" ");
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Front_Pannel_Vertical');
    scene.groupApplyState('Internal_on');
    scene.groupApplyState('Top_Cover_OFF');

    scene.groupApplyState('Card_Hide');
    scene.groupApplyState('Cards_display_off');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');

    scene.groupApplyState("GP_ON");
    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('NVME_off');
    scene.groupApplyState('HDD_NVME_4x2_off');
    scene.groupApplyState('GPU_Card_OFF');
    scene.clearRefine();
    scene.gotoPosInTime(0.000307880394201163, 1.5679644737231006, -19.66861618336338, 0.18285744387308078, 150, 800, function () {
        $("#point11text").show();
    });


    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));

        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2400));
    scene.clearRefine();
}

function menu14Click() {
    animStoped = false;
    console.log("menu_14_clicked");
    $("#cpHeading").html("Interior of 2.5-inch Drive Configuration");
    $("#cpHeading").show();
    $("#onloadCopy").css('display','none');
    $("#menu3").addClass('active');
    $("#menu14").addClass('active');
    $("#menu14").removeClass("disabled");
    $("#menu14").removeClass('active');
    $(".greyOutBox").removeClass('redOutBox');
    $("#menu14 .greyOutBox").addClass('redOutBox');
    objectHide();
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
    // scene.groupApplyState('Top_Cover_OFF');
    scene.groupApplyState('Internal_ON');
    // scene.groupApplyState('2.5_inch');
    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('Extra_part_OFF');
    scene.gotoPosInTime(5.296261619604739, 0.8977462258193575, 0.7956863385817967, -3.393360640626445, 205, 1000, function () {
        // scene.animPlayInTime("NVME_back", 0.83, 1000);
        // scene.animPlayInTime("Handel_metal", 0.83, 1000);
        // timeouts.push(setTimeout(function () {
        //     $("#point14text").fadeIn(400);
            // translateIn(14);
        // }, 700));
    });
    timeouts.push(setTimeout(function () {

        scene.animPlayInTime("Chassi_Top",1,1000,function () {
           scene.groupApplyState('2.5_inch');
           scene.groupApplyState('Top_Cover_OFF');
           scene.animPlayInTime("HDD_CAGE_SR655",0.83,1000);
           scene.animPlayInTime("NVME_back",0.83,1000);
           scene.animPlayInTime("Handel_metal",0.83,1000);
        });
        scene.clearRefine();
     },1300));

    timeouts.push(setTimeout(function () {
        $("#point14text").fadeIn(400);
        translateIn(14);
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));
        if (autoplayAnim) {
           animCompeteAuto();
        } 
     },2500));
    scene.clearRefine();
}

function menu17Click() {
    console.log("menu17Clicked");
    animStoped = false;
    $("#cpHeading").html("PCIe Slot-Rich Configurations");
    $("#transPatch5").css('display', 'block');
    $("#onloadCopy").css("display", "none");
    $("#dummy-canvas").css("pointer-events", "none");
    $("#rightAnim").css("display", "none");

    objectHide();
    scene.groupApplyState('Server_hide_new');

    $("#point111text").css('display', 'block');

    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));

        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2200));

    scene.clearRefine();
}

function menu18Click() {
    console.log("menu18Clicked");
    $("#onloadCopy").css('display','none');
    animStoped = false;
    $("#cpHeading").text("Rear View");
    $("#cpHeading").show();
    $("#menu3").addClass('active');
    $("#menu18").addClass('active');
    $("#menu18").removeClass("disabled");
    $("#menu18").removeClass('active');
    $(".greyOutBox").removeClass('redOutBox');
    $("#menu18 .greyOutBox").addClass('redOutBox');
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('REMOTE_WIRE_OFF');
    scene.groupApplyState('Remote_only_off');
    scene.groupApplyState('Remote_hide');
 
    scene.groupApplyState("GP_ON");
    scene.groupApplyState('Card_Hide');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');
    scene.groupApplyState("TOP_MESH_FIX_SHOW");
    scene.clearRefine();
    scene.gotoPosInTime(3.1228533775245864, 0.024000652723075104, 0.014641735671303, -1.3848181741363663, 155.14432637717911, 1000, function () {
        $("#point18text").css('display', 'block');
    });
    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));
        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2000));
    
}

function menu20Click() {
    console.log("menu20Clicked");
    animStoped = false;
    $("#onloadCopy").css("display", "none");
    $("#cpHeading").text(" ");
    $("#menu12").addClass('active');
    $("#menu20").removeClass('active');
    $("#menu20 .greyOutBox").addClass('redOutBox');
    objectHide();
    scene.groupApplyState('Server_show_new');
    scene.groupApplyState('Front_Pannel_Vertical');
    scene.groupApplyState('Storage_Rich_Configuation');
    scene.groupApplyState('Internal_on');
    scene.groupApplyState('Top_Cover_OFF');

    scene.groupApplyState('Card_Hide');
    scene.groupApplyState('Cards_display_off');
    scene.groupApplyState('Front_Panel_B_Vertical_HDD');

    scene.groupApplyState("GP_ON");
    scene.groupApplyState('NVME_off');
    scene.groupApplyState('HDD_NVME_4x2_off');
    scene.clearRefine();

    scene.gotoPosInTime(3.1401917832677, 0.5173759265358984, -1.269208781149672, -3.80258923597308, 150, 1000, function () {
        $("#point17text").show();
    });

    timeouts.push(setTimeout(function () {
        timeouts.push(setTimeout(function () {
            animComplete();
        }, 200));

        if (autoplayAnim) {
            animCompeteAuto();
        }
    }, 2600));

    scene.clearRefine();
}

function menu21Click() {
    console.log("menu21clicked");
    $("#cpHeading").html("Local Management");
    $("#menu10").addClass('active');
    $("#menu21").removeClass("disabled");
    $("#menu21").removeClass('active');
    $(".greyOutBox").removeClass('redOutBox');
    $("#menu21 .greyOutBox").addClass('redOutBox');
    $("#dummy-canvas").css("pointer-events", "none");
    $("#rightAnim").css('display', 'none');
    $("#point21text").css('display', 'block');
    $("#point21text1").css('display', 'block');
    notrepeat = true;
    objectHide();
    menu11Fadeout();
    scene.groupApplyState('Server_hide_new');
    timeouts.push(setTimeout(function () {
        $("#point21text").css('display', 'block');
        $("#point21text1").css('display', 'block');
    }, 1));
    translateIn(21);
    var SlidShow = document.querySelectorAll("#slides2 .slide");
    var CurrentSlide = 0;
    var slideInterval = setInterval(SliderPlay, 4000);

    function SliderPlay() {
        SlidShow[CurrentSlide].className = "slide";
        CurrentSlide = (CurrentSlide + 1) % SlidShow.length;
        SlidShow[CurrentSlide].className = "slide showing";
    }

    timeouts.push(setTimeout(function () {
        if (autoplayAnim) {
            animCompeteAuto();
        } else {
            animComplete();
        }
    }, 1300));

    scene.clearRefine();
}

var timeouts = [];

// Autp Play function

function autoPlayAllAnimations() {
    console.log("Stopped", animStoped, clickEventActive);
    if (!animStoped || (!clickEventActive && !autoRotateState)) return;
    for (var j = 1; j <= 22; j++) { translateOut(j); }
    $(".menuitems").removeClass('active');
    $("#rightAnim").css("display", "block");
    $(".greyOutBox").removeClass('redOutBox');
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    clearTimeout(autoPlayInt);
    clearTimeout(startAutorot);
    autoRotateStop();
    $("#dummy-canvas").css("pointer-events", "all");
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
    for (var i = 0; i < timeoutsnew.length; i++) {
        clearTimeout(timeoutsnew[i]);
    }
    timeoutsnew = [];
    firstAnim = true;
    autoplayAnim = true;

    $("#autoPlays").removeClass('playAll').off('click.playAll').addClass("pauseAll");
    $("#autoPlays .menuText").html("Stop");
    $("#pauseplayImg").css("display", "none");
    $("#pauseplayImg2").css("display", "block");
    $("#pauseplayImg2 img").attr("src", "./images_gl/Pause.svg").css("height", "40px");

    if (currneAnim < 22) {
        console.log("currneAnim" + currneAnim);

        if (currneAnim == 2) {
            currneAnim = 12
            AutoPlayMenus(currneAnim);
        }
        else if (currneAnim == 12) {
            currneAnim = 20
            AutoPlayMenus(currneAnim);
        }
        else if (currneAnim == 20) {
            currneAnim = 3
            AutoPlayMenus(currneAnim);
        }
        else if (currneAnim == 3) {
            currneAnim = 4
            AutoPlayMenus(currneAnim);
        }
        else if (currneAnim == 4) {
            currneAnim = 14
            AutoPlayMenus(currneAnim);
        }
        else if (currneAnim == 14) {
            currneAnim = 18
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 18) {
            currneAnim = 7
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 7) {
            currneAnim = 13
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 13) {
            currneAnim = 9
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 9) {
            currneAnim = 8
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 8) {
            currneAnim = 5
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 5) {
            currneAnim = 17
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 17) {
            currneAnim = 6
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 6) {
            currneAnim = 16
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 16) {
            currneAnim = 10
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 10) {
            currneAnim = 21
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 21) {
            currneAnim = 11
            AutoPlayMenus(currneAnim);
        } else if (currneAnim == 11) {
            if (autoplayCatalog) {
                scene.stop();
                $(window.parent).unbind('resize');
                parent.openSuperblazeAuto();
            }
            currneAnim = 2;
            AutoPlayMenus(currneAnim);
        } else {
            currneAnim++;
            AutoPlayMenus(currneAnim);
        }
    } else {
        if (autoplayCatalog) {
            scene.stop();
            $(window.parent).unbind('resize');
            parent.openSuperblazeAuto();
        }
        currneAnim = 2;
        AutoPlayMenus(currneAnim);
    }
    console.log("play", currneAnim);
}

function autoPauseAllAnimations() {
    console.log("pause");
    clearTimeout(autoPlayInt);
    if (autoplayCatalog) {
        parent.stopAutoplay();
    }
    $("#autoPlays").removeClass('pauseAll').off('click.pauseAll').addClass("playAll");
    $("#autoPlays .menuText").html("Play All");
    $("#pauseplayImg2").css("display", "none");
    $("#pauseplayImg").css("display", "block");
    $("#pauseplayImg img").attr("src", "./images_gl/Play.svg").css("height", "40px");
    autoplayAnim = false;
    if (autoplayAnim) {
        setTimeout(function () {
            autoplayAnim = false;
            var newId = "#menu" + currneAnim;
            $("#menu" + currneAnim).addClass("active").css("background-color", "#eb140a").css("opacity", "1");

        }, 50);

    }
    clearTimeout(autoPlayInt);
    setTimeout(function () {
        animComplete();
    }, 2000);
}

var autoPlayInt

function animCompeteAuto() {
    console.log("calleAuto");
    autoPlayInt = setTimeout(function () {
        console.log("stopped");
        autoPlayAllAnimations();
    }, 9500);
}

function AutoPlayMenus(currneAnim) {
    $(".menuitems").css("background-color", "").css("opacity", "");
    clearInterval(autoRotateInterval);
    clearInterval(myVar);
    clearTimeout(startAutorot);
    objectHide();
    reversAll();
    $("#point10text").css("display", "none")
    $("h3#menu" + currneAnim).css("background-color", "#eb140a").css("opacity", "1");
    for (var j = 1; j <= 22; j++) { translateOut(j); }
    switch ("menu" + currneAnim) {
        case "menu2":
            $(".accordion").accordion("option", "active", false);
            menu2Click();
            break;
        case "menu3":
            $(".accordion").accordion("option", "active", false);
            $("#accordion3").accordion("option", "active", 0);
            menu3Click();
            break;
        case "menu4":
            menu4Click();
            break;
        case "menu14":
            menu14Click();
            break;
        case "menu17":
            $(".accordion").accordion("option", "active", false);
            menu17Click();
            break;
        case "menu18":
            menu18Click();
            break;
        case "menu7":
            $(".accordion").accordion("option", "active", false);
            $("#accordion1").accordion("option", "active", 1);
            menu7Click();
            break;
        case "menu13":
            menu13Click();
            break;
        case "menu9":
            menu9Click();
            break;
        case "menu8":
            menu8Click();
            break;
        case "menu5":
            $(".accordion").accordion("option", "active", false);
            menu5Click();
            break;
        case "menu6":
            $(".accordion").accordion("option", "active", false);
            $("#accordion1").accordion("option", "active", 2);
            menu6Click();
            break;
        case "menu16":
            menu16Click();
            break;
        case "menu12":
            $(".accordion").accordion("option", "active", false);
            $("#accordion2").accordion("option", "active", 0);
            menu12Click();
            break;
        case "menu20":
            menu20Click();
            break;
        case "menu10":
            $(".accordion").accordion("option", "active", false);
            $("#accordion2").accordion("option", "active", 2);
            menu10Click();
            break;
        case "menu11":
            $(".accordion").accordion("option", "active", false);
            menu11Click();
            break;
        case "menu21":
            menu21Click();
            break;
    }
}

function animComplete() {
    animStoped = true;
    scene._navEnabled = true;
}

function reversAll() {
}

var imgInterval;

function clearInt() {
    clearInterval(imgInterval);
    $("#imageContainerimg").attr('src', 'images_gl/ring_animation/1.png');
    $("#imageContainerimg").css("display", "none");
}

function close_window() {
    close();
}

document.onselectstart = function () {
    return false;
};

var btnDrag = false;

function mouseOverBtnDrag() {
    btnDrag = true;
}

function mouseOutBtnDrag() {
    setTimeout(function () {
        btnDrag = false;
    }, 100);
}

var updateId = 0;

function onRightClick(event) {
    return false; //surpress theright menu 
}
function onWindowFocus() {
    updateEnabled = true;
}

function onWindowBlur() {
    updateEnabled = false;
}

function debounce(func, wait, immediate, ev) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var rotating = [0, 0];
rAccelaration = 0.04;
rDecelaration = -0.3;
rMaxSpeed = 5;
var rSpeed = 0;
var rAcc = rAccelaration;

function frameUpdate() {
    window.requestAnimationFrame(frameUpdate);
    if (scene._refineCount < 64) frameUpdateForScene(scene);
    if (clickEventActive || autoRotateState) {
        $(".menuitems, #autoPlays").css("pointer-events", "all");
    } else if (!clickEventActive) {
        $(".menuitems, #autoPlays").css("pointer-events", "none");
    }

    //console.log(scene._nav._navYAng+","+scene._nav._navXAng+","+scene._nav._navPan[0]+","+scene._nav._navPan[1]+","+scene._nav._navDolly);

    if (yPos < yEnd && mdown != true && yStarted) {
        autoRotateState = true;
        if (yPos > yEnd - 2) yPos = 0;

        if (numberOfAA == 5) {
            autoRotateRequest();
            numberOfAA = 1;
        }
        numberOfAA++;
    } else yStarted = false;

    if (rotating[0] != 0 || rotating[1] != 0) {
        if (rSpeed < 0) {
            rSpeed = 0;
            rAcc = rAccelaration;
            rotating = [0, 0];
        }
        rSpeed = (rSpeed < rMaxSpeed || rAcc < 0) ? rSpeed + rAcc : rSpeed;
        console.log(rSpeed);
        scene._nav.NavRotation([0, 0], [rotating[0] * rSpeed, rotating[1] * rSpeed]);
        scene.clearRefine();
    }
}
var numberOfAA = 1;

function frameUpdateForScene(scene) {
    var bgotoPosInTimeUpdate = scene._nav._navgotoPosInTimeActive;
    sceneViewMatrix = scene._nav.NavCreateViewMatrix(scene._initialNavMatrix);
    scene.setViewMatrix(sceneViewMatrix);
    scene.setModelMatrix(scene._nav.NavCreateModelMatrix(scene._initialNavMatrix));
    drawn = scene.draw();
    if (bgotoPosInTimeUpdate)
        scene.clearRefine();
    if (drawn && AllgeoIntl) hotspotPosAsignment();
}

function getScene(ev) {
    var s = scene;
    if (scene2 != null && ev.currentTarget == canvas2)
        s = scene2;
    return s;
}

/*------------auto rotate functionality------------*/
var yPos = 0;
var yEnd = 300;
var yStarted = false;
var autoRotateState = false;
var yLevel = 0;
var yStep = [1];
var ySpeed = [20];
var myVar;
var autoRotateInterval;

function autoRotate() {
    if ((navigator.userAgent.indexOf("iPhone") != -1) || ((navigator.userAgent.indexOf("Android") != -1) || (navigator.userAgent.indexOf("Mobile") != -1)) || (navigator.userAgent.indexOf('iPad') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
        animStoped = true;
        scene._navEnabled = true;
    }
    else {
        yPos = 0;
        if (!yStarted || (scene._navDXAng != 0.0 || scene._navDYAng != 0.0 || scene._navDPan[0] != 0.0 || scene._navDPan[1] != 0.0 || scene._navDDolly != 0.0) || reseon == true) {
            autoRotateRequest();
        }
    }
}

var autoRotateInterval;
function autoRotateStop() {
    yPos = yEnd;
    autoRotateState = false;
    clearInterval(autoRotateInterval);
    clearTimeout(autoPlayInt);
    clearTimeout(myVar);
    clearTimeout(startAutorot);
}

function autoRotateRequest(ev) {
    var s = getScene(ev);
    yStarted = true;
    yPos += 0.5;
    var mpos = [0.0, 0.0];
    var mdelta = [0.90, 0.0];
    if (s._nav.NavRotation(mpos, mdelta)) {
        scene.clearRefine();
    }
}

function autoRotateCall() {
    myVar = setTimeout(function () {
        autoRotateState = true;
        autoRotate();
    }, 8000);
}

/*end*/


var hotspotPoint = true;
var hotspotOn;
var clockWise = true;
var antiClockWise = false;

function hotspotPosAsignment() {
    InHotspot = true;
    var viewCameraZV = [sceneViewMatrix[8],sceneViewMatrix[9],sceneViewMatrix[10]];
    var hotspotopacityspeed = 3.0;
    // if (sceneViewMatrix[14] > 1.6 && sceneViewMatrix[14] < 9 && sceneViewMatrix[12] > 16 && sceneViewMatrix[12] < 120) {
    //    $('#hotspot1,#hotspot2,#hotspot3,#hotspot4,#hotspot12,#hotspot13,#hotspot14,#hotspot15,#hotspot16,#hotspot114').css('display','block');
    // }
 
    // if (sceneViewMatrix[14] > 1 && sceneViewMatrix[14] < 8 && sceneViewMatrix[12] > 10 && sceneViewMatrix[12] < 83) {
    //    $('#hotspot5,#hotspot6,#hotspot7,#hotspot8,#hotspot9,#hotspot10,#hotspot11,#hotspot111, #hotspot1111, #hotspot11111').css('display','block');
    // }
 
    var pos2Dpoint5 = [];
    var norm3Dpoint5 = scene.getObjectNormal("Front_hotspot_01");
    var hotspotopacity5 = infinityrt_dp(norm3Dpoint5,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity5 > 0 && (hotspotOn == true)) hotspotopacity5 = 0;
    if (hotspotopacity5 < 0.0) hotspotopacity5 = 0.0;
    else if (hotspotopacity5 > 1.0) hotspotopacity5 = 1.0;
    if (hotspotopacity5 == 0) $("#hotspot12",window.document).css('visibility','hidden');
    else $("#hotspot12",window.document).css('visibility','visible');
    pos2Dpoint5 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_01",true));
 
    var pos2Dpoint6 = [];
    var norm3Dpoint6 = scene.getObjectNormal("Front_hotspot_02");
    var hotspotopacity6 = infinityrt_dp(norm3Dpoint6,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity6 > 0 && (hotspotOn == true)) hotspotopacity6 = 0;
    if (hotspotopacity6 < 0.0) hotspotopacity6 = 0.0;
    else if (hotspotopacity6 > 1.0) hotspotopacity6 = 1.0;
    if (hotspotopacity6 == 0) $("#hotspot13",window.document).css('visibility','hidden');
    else $("#hotspot13",window.document).css('visibility','visible');
    pos2Dpoint6 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_02",true));
 
    var pos2Dpoint7 = [];
    var norm3Dpoint7 = scene.getObjectNormal("Front_hotspot_07");
    var hotspotopacity7 = infinityrt_dp(norm3Dpoint7,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity7 > 0 && (hotspotOn == true)) hotspotopacity7 = 0;
    if (hotspotopacity7 < 0.0) hotspotopacity7 = 0.0;
    else if (hotspotopacity7 > 1.0) hotspotopacity7 = 1.0;
    if (hotspotopacity7 == 0) $("#hotspot14",window.document).css('visibility','hidden');
    else $("#hotspot14",window.document).css('visibility','visible');
    pos2Dpoint7 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_07",true));
 
    var pos2Dpoint8 = [];
    var norm3Dpoint8 = scene.getObjectNormal("Front_hotspot_0");//29
    var hotspotopacity8 = infinityrt_dp(norm3Dpoint8,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity8 > 0 && (hotspotOn == true)) hotspotopacity8 = 0;
    if (hotspotopacity8 < 0.0) hotspotopacity8 = 0.0;
    else if (hotspotopacity8 > 1.0) hotspotopacity8 = 1.0;
    if (hotspotopacity8 == 0) $("#hotspot15",window.document).css('visibility','hidden');
    else $("#hotspot15",window.document).css('visibility','visible');
    pos2Dpoint8 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_0",true));
 
    var pos2Dpoint9 = [];
    var norm3Dpoint9 = scene.getObjectNormal("Front_hotspot_05");//30
    var hotspotopacity9 = infinityrt_dp(norm3Dpoint9,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity9 > 0 && (hotspotOn == true)) hotspotopacity9 = 0;
    if (hotspotopacity9 < 0.0) hotspotopacity9 = 0.0;
    else if (hotspotopacity9 > 1.0) hotspotopacity9 = 1.0;
    if (hotspotopacity9 == 0) $("#hotspot16",window.document).css('visibility','hidden');
    else $("#hotspot16",window.document).css('visibility','visible');
    pos2Dpoint9 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_05",true));
 
    var pos2Dpoint10 = [];
    var norm3Dpoint10 = scene.getObjectNormal("Front_hotspot_06");//31
    var hotspotopacity10 = infinityrt_dp(norm3Dpoint10,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity10 > 0 && (hotspotOn == true)) hotspotopacity10 = 0;
    if (hotspotopacity10 < 0.0) hotspotopacity10 = 0.0;
    else if (hotspotopacity10 > 1.0) hotspotopacity10 = 1.0;
    if (hotspotopacity10 == 0) $("#hotspot114",window.document).css('visibility','hidden');
    else $("#hotspot114",window.document).css('visibility','visible');
    pos2Dpoint10 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_06",true));
 
    var pos2Dpoint11 = [];
    var norm3Dpoint11 = scene.getObjectNormal("Front_hotspot_04");//32
    var hotspotopacity11 = infinityrt_dp(norm3Dpoint11,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity11 > 0 && (hotspotOn == true)) hotspotopacity11 = 0;
    if (hotspotopacity11 < 0.0) hotspotopacity11 = 0.0;
    else if (hotspotopacity11 > 1.0) hotspotopacity11 = 1.0;
    if (hotspotopacity11 == 0) $("#hotspot155",window.document).css('visibility','hidden');
    else $("#hotspot155",window.document).css('visibility','visible');
    pos2Dpoint11 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_04",true));
 
    var pos2Dpoint111 = [];
    var norm3Dpoint111 = scene.getObjectNormal("Rear_hotspot_01");//33
    var hotspotopacity111 = infinityrt_dp(norm3Dpoint111,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity111 > 0 && (hotspotOn == true)) hotspotopacity111 = 0;
    if (hotspotopacity111 < 0.0) hotspotopacity111 = 0.0;
    else if (hotspotopacity111 > 1.0) hotspotopacity111 = 1.0;
    if (hotspotopacity111 == 0) $("#hotspot34",window.document).css('visibility','hidden');
    else $("#hotspot34",window.document).css('visibility','visible');
    pos2Dpoint111 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_01",true));
 
    var pos2Dpoint112 = [];
    var norm3Dpoint112 = scene.getObjectNormal("Rear_hotspot_02");//34
    var hotspotopacity112 = infinityrt_dp(norm3Dpoint112,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity112 > 0 && (hotspotOn == true)) hotspotopacity112 = 0;
    if (hotspotopacity112 < 0.0) hotspotopacity112 = 0.0;
    else if (hotspotopacity112 > 1.0) hotspotopacity112 = 1.0;
    if (hotspotopacity112 == 0) $("#hotspot35",window.document).css('visibility','hidden');
    else $("#hotspot35",window.document).css('visibility','visible');
    pos2Dpoint112 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_02",true));
 
    var pos2Dpoint113 = [];
    var norm3Dpoint113 = scene.getObjectNormal("Rear_hotspot_03");//35
    var hotspotopacity113 = infinityrt_dp(norm3Dpoint113,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity113 > 0 && (hotspotOn == true)) hotspotopacity113 = 0;
    if (hotspotopacity113 < 0.0) hotspotopacity113 = 0.0;
    else if (hotspotopacity113 > 1.0) hotspotopacity113 = 1.0;
    if (hotspotopacity113 == 0) $("#hotspot36",window.document).css('visibility','hidden');
    else $("#hotspot36",window.document).css('visibility','visible');
    pos2Dpoint113 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_03",true));
 
    var pos2Dpoint12 = [];
    var norm3Dpoint12 = scene.getObjectNormal("Rear_hotspot_07");
    var hotspotopacity12 = infinityrt_dp(norm3Dpoint12,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity12 > 0 && (hotspotOn == true)) hotspotopacity12 = 0;
    if (hotspotopacity12 < 0.0) hotspotopacity12 = 0.0;
    else if (hotspotopacity12 > 1.0) hotspotopacity12 = 1.0;
    if (hotspotopacity12 == 0) $("#hotspot37",window.document).css('visibility','hidden');
    else $("#hotspot37",window.document).css('visibility','visible');
    pos2Dpoint12 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_07",true));
 
    var pos2Dpoint13 = [];
    var norm3Dpoint13 = scene.getObjectNormal("Rear_hotspot_04");
    var hotspotopacity13 = infinityrt_dp(norm3Dpoint13,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity13 > 0 && (hotspotOn == true)) hotspotopacity13 = 0;
    if (hotspotopacity13 < 0.0) hotspotopacity13 = 0.0;
    else if (hotspotopacity13 > 1.0) hotspotopacity13 = 1.0;
    if (hotspotopacity13 == 0) $("#hotspot38",window.document).css('visibility','hidden');
    else $("#hotspot38",window.document).css('visibility','visible');
    pos2Dpoint13 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_04",true));
 
    var pos2Dpoint14 = [];
    var norm3Dpoint14 = scene.getObjectNormal("Rear_hotspot_05");
    var hotspotopacity14 = infinityrt_dp(norm3Dpoint14,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity14 > 0 && (hotspotOn == true)) hotspotopacity14 = 0;
    if (hotspotopacity14 < 0.0) hotspotopacity14 = 0.0;
    else if (hotspotopacity14 > 1.0) hotspotopacity14 = 1.0;
    if (hotspotopacity14 == 0) $("#hotspot39",window.document).css('visibility','hidden');
    else $("#hotspot39",window.document).css('visibility','visible');
    pos2Dpoint14 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_05",true));
 
    var pos2Dpoint15 = [];
    var norm3Dpoint15 = scene.getObjectNormal("Rear_hotspot_06");
    var hotspotopacity15 = infinityrt_dp(norm3Dpoint15,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity15 > 0 && (hotspotOn == true)) hotspotopacity15 = 0;
    if (hotspotopacity15 < 0.0) hotspotopacity15 = 0.0;
    else if (hotspotopacity15 > 1.0) hotspotopacity15 = 1.0;
    if (hotspotopacity15 == 0) $("#hotspot42",window.document).css('visibility','hidden');
    else $("#hotspot42",window.document).css('visibility','visible');
    pos2Dpoint15 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_06",true));
 
    var pos2Dpoint16 = [];
    var norm3Dpoint16 = scene.getObjectNormal("Rear_hotspot_06");
    var hotspotopacity16 = infinityrt_dp(norm3Dpoint16,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity16 > 0 && (hotspotOn == true)) hotspotopacity16 = 0;
    if (hotspotopacity16 < 0.0) hotspotopacity16 = 0.0;
    else if (hotspotopacity16 > 1.0) hotspotopacity16 = 1.0;
    if (hotspotopacity16 == 0) $("#hotspot40",window.document).css('visibility','hidden');
    else $("#hotspot40",window.document).css('visibility','visible');
    pos2Dpoint16 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_06",true));
 
    var pos2Dpoint114 = [];
    var norm3Dpoint114 = scene.getObjectNormal("Front_hotspot_01");
    var hotspotopacity114 = infinityrt_dp(norm3Dpoint114,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity114 > 0 && (hotspotOn == true)) hotspotopacity114 = 0;
    if (hotspotopacity114 < 0.0) hotspotopacity114 = 0.0;
    else if (hotspotopacity114 > 1.0) hotspotopacity114 = 1.0;
    if (hotspotopacity114 == 0) $("#hotspot1",window.document).css('visibility','hidden');
    else $("#hotspot1",window.document).css('visibility','visible');
    pos2Dpoint114 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_01",true));
 
    var pos2Dpoint34 = [];
    var norm3Dpoint34 = scene.getObjectNormal("Front_hotspot_02");
    var hotspotopacity34 = infinityrt_dp(norm3Dpoint34,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity34 > 0 && (hotspotOn == true)) hotspotopacity34 = 0;
    if (hotspotopacity34 < 0.0) hotspotopacity34 = 0.0;
    else if (hotspotopacity34 > 1.0) hotspotopacity34 = 1.0;
    if (hotspotopacity34 == 0) $("#hotspot2",window.document).css('visibility','hidden');
    else $("#hotspot2",window.document).css('visibility','visible');
    pos2Dpoint34 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_02",true));
 
    var pos2Dpoint35 = [];
    var norm3Dpoint35 = scene.getObjectNormal("Front_hotspot_07");
    var hotspotopacity35 = infinityrt_dp(norm3Dpoint35,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity35 > 0 && (hotspotOn == true)) hotspotopacity35 = 0;
    if (hotspotopacity35 < 0.0) hotspotopacity35 = 0.0;
    else if (hotspotopacity35 > 1.0) hotspotopacity35 = 1.0;
    if (hotspotopacity35 == 0) $("#hotspot13",window.document).css('visibility','hidden');
    else $("#hotspot13",window.document).css('visibility','visible');
    pos2Dpoint35 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_07",true));
 
    var pos2Dpoint36 = [];
    var norm3Dpoint36 = scene.getObjectNormal("Front_hotspot_0");
    var hotspotopacity36 = infinityrt_dp(norm3Dpoint36,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity36 > 0 && (hotspotOn == true)) hotspotopacity36 = 0;
    if (hotspotopacity36 < 0.0) hotspotopacity36 = 0.0;
    else if (hotspotopacity36 > 1.0) hotspotopacity36 = 1.0;
    if (hotspotopacity36 == 0) $("#hotspot4",window.document).css('visibility','hidden');
    else $("#hotspot4",window.document).css('visibility','visible');
    pos2Dpoint36 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_0",true));
 
    var pos2Dpoint37 = [];
    var norm3Dpoint37 = scene.getObjectNormal("Front_hotspot_04");
    var hotspotopacity37 = infinityrt_dp(norm3Dpoint37,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity37 > 0 && (hotspotOn == true)) hotspotopacity37 = 0;
    if (hotspotopacity37 < 0.0) hotspotopacity37 = 0.0;
    else if (hotspotopacity37 > 1.0) hotspotopacity37 = 1.0;
    if (hotspotopacity37 == 0) $("#hotspot52",window.document).css('visibility','hidden');
    else $("#hotspot52",window.document).css('visibility','visible');
    pos2Dpoint37 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_04",true));
 
    var pos2Dpoint38 = [];
    var norm3Dpoint38 = scene.getObjectNormal("Front_hotspot_05");
    var hotspotopacity38 = infinityrt_dp(norm3Dpoint38,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity38 > 0 && (hotspotOn == true)) hotspotopacity38 = 0;
    if (hotspotopacity38 < 0.0) hotspotopacity38 = 0.0;
    else if (hotspotopacity38 > 1.0) hotspotopacity38 = 1.0;
    if (hotspotopacity38 == 0) $("#hotspot62",window.document).css('visibility','hidden');
    else $("#hotspot62",window.document).css('visibility','visible');
    pos2Dpoint38 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_05",true));
 
    var pos2Dpoint39 = [];
    var norm3Dpoint39 = scene.getObjectNormal("Front_hotspot_06");
    var hotspotopacity39 = infinityrt_dp(norm3Dpoint39,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity39 > 0 && (hotspotOn == true)) hotspotopacity39 = 0;
    if (hotspotopacity39 < 0.0) hotspotopacity39 = 0.0;
    else if (hotspotopacity39 > 1.0) hotspotopacity39 = 1.0;
    if (hotspotopacity39 == 0) $("#hotspot72",window.document).css('visibility','hidden');
    else $("#hotspot72",window.document).css('visibility','visible');
    pos2Dpoint39 = scene.projectPoint(scene.getObjectLocation("Front_hotspot_06",true));
 
    var pos2Dpoint40 = [];
    var norm3Dpoint40 = scene.getObjectNormal("Rear_hotspot_01");
    var hotspotopacity40 = infinityrt_dp(norm3Dpoint40,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity40 > 0 && (hotspotOn == true)) hotspotopacity40 = 0;
    if (hotspotopacity40 < 0.0) hotspotopacity40 = 0.0;
    else if (hotspotopacity40 > 1.0) hotspotopacity40 = 1.0;
    if (hotspotopacity40 == 0) $("#hotspot91",window.document).css('visibility','hidden');
    else $("#hotspot91",window.document).css('visibility','visible');
    pos2Dpoint40 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_01",true));
 
    var pos2Dpoint41 = [];
    var norm3Dpoint41 = scene.getObjectNormal("Rear_hotspot_02");
    var hotspotopacity41 = infinityrt_dp(norm3Dpoint41,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity41 > 0 && (hotspotOn == true)) hotspotopacity41 = 0;
    if (hotspotopacity41 < 0.0) hotspotopacity41 = 0.0;
    else if (hotspotopacity41 > 1.0) hotspotopacity41 = 1.0;
    if (hotspotopacity41 == 0) $("#hotspot92",window.document).css('visibility','hidden');
    else $("#hotspot92",window.document).css('visibility','visible');
    pos2Dpoint41 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_02",true));
 
    var pos2Dpoint42 = [];
    var norm3Dpoint42 = scene.getObjectNormal("Rear_hotspot_03");
    var hotspotopacity42 = infinityrt_dp(norm3Dpoint42,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity42 > 0 && (hotspotOn == true)) hotspotopacity42 = 0;
    if (hotspotopacity42 < 0.0) hotspotopacity42 = 0.0;
    else if (hotspotopacity42 > 1.0) hotspotopacity42 = 1.0;
    if (hotspotopacity42 == 0) $("#hotspot93",window.document).css('visibility','hidden');
    else $("#hotspot93",window.document).css('visibility','visible');
    pos2Dpoint42 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_03",true));
 
    var pos2Dpoint43 = [];
    var norm3Dpoint43 = scene.getObjectNormal("Rear_hotspot_07");
    var hotspotopacity43 = infinityrt_dp(norm3Dpoint43,viewCameraZV) * hotspotopacityspeed - 2.96;
    if (hotspotopacity43 > 0 && (hotspotOn == true)) hotspotopacity43 = 0;
    if (hotspotopacity43 < 0.0) hotspotopacity43 = 0.0;
    else if (hotspotopacity43 > 1.0) hotspotopacity43 = 1.0;
    if (hotspotopacity43 == 0) $("#hotspot94",window.document).css('visibility','hidden');
    else $("#hotspot94",window.document).css('visibility','visible');
    pos2Dpoint43 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_07",true));
 
    // //new added 7
    var pos2Dpoint311 = [];
    var norm3Dpoint311 = scene.getObjectNormal("Rear_hotspot_04"); //17
    var hotspotopacity311 = infinityrt_dp(norm3Dpoint311,viewCameraZV) * hotspotopacityspeed - 2.9;
    if (hotspotopacity311 > 0 && (hotspotOn == true)) hotspotopacity311 = 0;
    if (hotspotopacity311 < 0.0) hotspotopacity311 = 0.0;
    else if (hotspotopacity311 > 1.0) hotspotopacity311 = 1.0;
    if (hotspotopacity311 == 1.0) $("#hotspot95",window.document).css('visibility','hidden');
    else $("#hotspot95",window.document).css('visibility','visible');
    pos2Dpoint311 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_04",true));
 
    var pos2Dpoint312 = [];
    var norm3Dpoint312 = scene.getObjectNormal("Rear_hotspot_05"); //18
    var hotspotopacity312 = infinityrt_dp(norm3Dpoint312,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity312 > 0 && (hotspotOn == true)) hotspotopacity312 = 0;
    if (hotspotopacity312 < 0.0) hotspotopacity312 = 0.0;
    else if (hotspotopacity312 > 1.0) hotspotopacity312 = 1.0;
    if (hotspotopacity312 == 0) $("#hotspot96",window.document).css('visibility','hidden');
    else $("#hotspot96",window.document).css('visibility','visible');
    pos2Dpoint312 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_05",true));
 
    var pos2Dpoint313 = [];
    var norm3Dpoint313 = scene.getObjectNormal("Rear_hotspot_06"); //19
    var hotspotopacity313 = infinityrt_dp(norm3Dpoint313,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity313 > 0 && (hotspotOn == true)) hotspotopacity313 = 0;
    if (hotspotopacity313 < 0.0) hotspotopacity313 = 0.0;
    else if (hotspotopacity313 > 1.0) hotspotopacity313 = 1.0;
    if (hotspotopacity313 == 0) $("#hotspot97",window.document).css('visibility','hidden');
    else $("#hotspot97",window.document).css('visibility','visible');
    pos2Dpoint313 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_06",true));
 
    var pos2Dpoint314 = [];
    var norm3Dpoint314 = scene.getObjectNormal("Rear_hotspot_06"); //20
    var hotspotopacity314 = infinityrt_dp(norm3Dpoint314,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity314 > 0 && (hotspotOn == true)) hotspotopacity314 = 0;
    if (hotspotopacity314 < 0.0) hotspotopacity314 = 0.0;
    else if (hotspotopacity314 > 1.0) hotspotopacity314 = 1.0;
    if (hotspotopacity314 == 0) $("#hotspot98",window.document).css('visibility','hidden');
    else $("#hotspot98",window.document).css('visibility','visible');
    pos2Dpoint314 = scene.projectPoint(scene.getObjectLocation("Rear_hotspot_06",true));
 
    var pos2Dpoint315 = [];
    var norm3Dpoint315 = scene.getObjectNormal("Internal_hotspot_14"); //21
    var hotspotopacity315 = infinityrt_dp(norm3Dpoint315,viewCameraZV) * hotspotopacityspeed - 0.5;
    if (hotspotopacity315 > 0 && (hotspotOn == true)) hotspotopacity315 = 0;
    if (hotspotopacity315 < 0.0) hotspotopacity315 = 0.0;
    else if (hotspotopacity315 > 1.0) hotspotopacity315 = 1.0;
    if (hotspotopacity315 == 0) $("#hotspot315",window.document).css('visibility','hidden');
    else $("#hotspot315",window.document).css('visibility','visible');
    pos2Dpoint315 = scene.projectPoint(scene.getObjectLocation("Internal_hotspot_14",true));
 
 
    var leftPosPoint5 = (pos2Dpoint5[0] * 50) + 50;
    var leftPosPoint6 = (pos2Dpoint6[0] * 50) + 50;
    var leftPosPoint7 = (pos2Dpoint7[0] * 50) + 50;
 
    var leftPosPoint8 = (pos2Dpoint8[0] * 50) + 50;
    var leftPosPoint9 = (pos2Dpoint9[0] * 50) + 50;
    var leftPosPoint10 = (pos2Dpoint10[0] * 50) + 50;
    var leftPosPoint11 = (pos2Dpoint11[0] * 50) + 50;
    var leftPosPoint111 = (pos2Dpoint111[0] * 50) + 50;
    var leftPosPoint112 = (pos2Dpoint112[0] * 50) + 50;
    var leftPosPoint113 = (pos2Dpoint113[0] * 50) + 50;
 
    var leftPosPoint12 = (pos2Dpoint12[0] * 50) + 50;
    var leftPosPoint13 = (pos2Dpoint13[0] * 50) + 50;
    var leftPosPoint14 = (pos2Dpoint14[0] * 50) + 50;
    var leftPosPoint15 = (pos2Dpoint15[0] * 50) + 50;
    var leftPosPoint16 = (pos2Dpoint16[0] * 50) + 50;
    var leftPosPoint114 = (pos2Dpoint114[0] * 50) + 50;
 
    var leftPosPoint34 = (pos2Dpoint34[0] * 50) + 50;
    var leftPosPoint35 = (pos2Dpoint35[0] * 50) + 50;
    var leftPosPoint36 = (pos2Dpoint36[0] * 50) + 50;
    var leftPosPoint37 = (pos2Dpoint37[0] * 50) + 50;
    var leftPosPoint38 = (pos2Dpoint38[0] * 50) + 50;
    var leftPosPoint39 = (pos2Dpoint39[0] * 50) + 50;
    var leftPosPoint40 = (pos2Dpoint40[0] * 50) + 50;
    var leftPosPoint41 = (pos2Dpoint41[0] * 50) + 50;
    var leftPosPoint42 = (pos2Dpoint42[0] * 50) + 50;
    var leftPosPoint43 = (pos2Dpoint43[0] * 50) + 50;
 
    var leftPosPoint311 = (pos2Dpoint311[0] * 50) + 50;
    var leftPosPoint312 = (pos2Dpoint312[0] * 50) + 50;
    var leftPosPoint313 = (pos2Dpoint313[0] * 50) + 50;
    var leftPosPoint314 = (pos2Dpoint314[0] * 50) + 50;
    var leftPosPoint315 = (pos2Dpoint315[0] * 50) + 50;
 
    var toptPosPoint5 = -((pos2Dpoint5[1] * 50) - 50);
    var toptPosPoint6 = -((pos2Dpoint6[1] * 50) - 50);
    var toptPosPoint7 = -((pos2Dpoint7[1] * 50) - 50);
 
    var toptPosPoint8 = -((pos2Dpoint8[1] * 50) - 50);
    var toptPosPoint9 = -((pos2Dpoint9[1] * 50) - 50);
    var toptPosPoint10 = -((pos2Dpoint10[1] * 50) - 50);
    var toptPosPoint11 = -((pos2Dpoint11[1] * 50) - 50);
    var toptPosPoint111 = -((pos2Dpoint111[1] * 50) - 50);
    var toptPosPoint112 = -((pos2Dpoint112[1] * 50) - 50);
    var toptPosPoint113 = -((pos2Dpoint113[1] * 50) - 50);
 
    var toptPosPoint12 = -((pos2Dpoint12[1] * 50) - 50);
    var toptPosPoint13 = -((pos2Dpoint13[1] * 50) - 50);
    var toptPosPoint14 = -((pos2Dpoint14[1] * 50) - 50);
    var toptPosPoint15 = -((pos2Dpoint15[1] * 50) - 50);
    var toptPosPoint16 = -((pos2Dpoint16[1] * 50) - 50);
    var toptPosPoint114 = -((pos2Dpoint114[1] * 50) - 50);
 
    var toptPosPoint34 = -((pos2Dpoint34[1] * 50) - 50);
    var toptPosPoint35 = -((pos2Dpoint35[1] * 50) - 50);
    var toptPosPoint36 = -((pos2Dpoint36[1] * 50) - 50);
    var toptPosPoint37 = -((pos2Dpoint37[1] * 50) - 50);
    var toptPosPoint38 = -((pos2Dpoint38[1] * 50) - 50);
    var toptPosPoint39 = -((pos2Dpoint39[1] * 50) - 50);
    var toptPosPoint40 = -((pos2Dpoint40[1] * 50) - 50);
    var toptPosPoint41 = -((pos2Dpoint41[1] * 50) - 50);
    var toptPosPoint42 = -((pos2Dpoint42[1] * 50) - 50);
    var toptPosPoint43 = -((pos2Dpoint43[1] * 50) - 50);
 
    var toptPosPoint311 = -((pos2Dpoint311[1] * 50) - 50);
    var toptPosPoint312 = -((pos2Dpoint312[1] * 50) - 50);
    var toptPosPoint313 = -((pos2Dpoint313[1] * 50) - 50);
    var toptPosPoint314 = -((pos2Dpoint314[1] * 50) - 50);
    var toptPosPoint315 = -((pos2Dpoint315[1] * 50) - 50);
 
    $("#hotspot12").css('left',leftPosPoint5 + '%').css('top',toptPosPoint5 + '%');
    $("#hotspot13").css('left',leftPosPoint6 + '%').css('top',toptPosPoint6 + '%');
    $("#hotspot14").css('left',leftPosPoint7 + '%').css('top',toptPosPoint7 + '%');
    $("#hotspot15").css('left',leftPosPoint8 + '%').css('top',toptPosPoint8 + '%');
    $("#hotspot16").css('left',leftPosPoint9 + '%').css('top',toptPosPoint9 + '%');
    $("#hotspot114").css('left',leftPosPoint10 + '%').css('top',toptPosPoint10 + '%');
    $("#hotspot155").css('left',leftPosPoint11 + '%').css('top',toptPosPoint11 + '%');
    $("#hotspot34").css('left',leftPosPoint111 + '%').css('top',toptPosPoint111 + '%');
    $("#hotspot35").css('left',leftPosPoint112 + '%').css('top',toptPosPoint112 + '%');
    $("#hotspot36").css('left',leftPosPoint113 + '%').css('top',toptPosPoint113 + '%');
 
    $("#hotspot37").css('left',leftPosPoint12 + '%').css('top',toptPosPoint12 + '%');
    $("#hotspot38").css('left',leftPosPoint13 + '%').css('top',toptPosPoint13 + '%');
    $("#hotspot39").css('left',leftPosPoint14 + '%').css('top',toptPosPoint14 + '%');
    $("#hotspot42").css('left',leftPosPoint15 + '%').css('top',toptPosPoint15 + '%');
    $("#hotspot40").css('left',leftPosPoint16 + '%').css('top',toptPosPoint16 + '%');
    $("#hotspot1").css('left',leftPosPoint114 + '%').css('top',toptPosPoint114 + '%');
 
    $("#hotspot2").css('left',leftPosPoint34 + '%').css('top',toptPosPoint34 + '%');
    $("#hotspot3").css('left',leftPosPoint35 + '%').css('top',toptPosPoint35 + '%');
    $("#hotspot4").css('left',leftPosPoint36 + '%').css('top',toptPosPoint36 + '%');
    $("#hotspot52").css('left',leftPosPoint37 + '%').css('top',toptPosPoint37 + '%');
    $("#hotspot62").css('left',leftPosPoint38 + '%').css('top',toptPosPoint38 + '%');
    $("#hotspot72").css('left',leftPosPoint39 + '%').css('top',toptPosPoint39 + '%');
    $("#hotspot91").css('left',leftPosPoint40 + '%').css('top',toptPosPoint40 + '%');
    $("#hotspot92").css('left',leftPosPoint41 + '%').css('top',toptPosPoint41 + '%');
    $("#hotspot93").css('left',leftPosPoint42 + '%').css('top',toptPosPoint42 + '%');
 
    $("#hotspot94").css('left',leftPosPoint43 + '%').css('top',toptPosPoint43 + '%');
 
    $("#hotspot95").css('left',leftPosPoint311 + '%').css('top',toptPosPoint311 + '%');
    $("#hotspot96").css('left',leftPosPoint312 + '%').css('top',toptPosPoint312 + '%');
    $("#hotspot97").css('left',leftPosPoint313 + '%').css('top',toptPosPoint313 + '%');
    $("#hotspot98").css('left',leftPosPoint314 + '%').css('top',toptPosPoint314 + '%');
    $("#hotspot315").css('left',leftPosPoint315 + '%').css('top',toptPosPoint315 + '%');
 
 
    if (Math.floor(sceneViewMatrix[5]) == 0) {
       clockWise = false;
    } else if (Math.floor(sceneViewMatrix[5]) == -1) {
       clockWise = true;
    }
 }

var mpos = [0, 0];
var mdown = false;
var panNav = false;
var prevAnimation = null;

function mouseDown(ev) {
    if (!animStoped) return;
    console.log("mouse fun call");
    $("#onloadCopy").css("opacity", "0");
    mouseDownHide();
    mouseWheelHide();
    setTimeout(Autoplayfive, 5000);
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    clearTimeout(autoPlayInt)
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    clearTimeout(startAutorot);
    for (var i = 0; i < timeoutsnew.length; i++) {
        clearTimeout(timeoutsnew[i]);
    }
    timeouts = [];
    timeoutsnew = [];

    if (autoplayAnim) autoPauseAllAnimations();
    var s = getScene(ev);
    if (ev.which == 3) {
        panNav = true;
    }
    var mouseDownPos = [ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop];
    if (!s.onClick(mouseDownPos, ev.button)) {
        mdown = true;
        mpos = mouseDownPos;
    }
}

function mouseUp(ev) {
    mdown = false;
    if (ev.which == 3 || panNav) panNav = false;
    handOpen();
}

function mouseOut(ev) {
    mdown = false;
    if (ev.which == 3 || panNav) panNav = false;
    handOpen();
}

function mouseMove(ev) {
    if (!mdown || !animStoped) return;
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    var s = getScene(ev);
    var mousePos = [ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop];
    var mdelta = [(mpos[0] - mousePos[0]), (mpos[1] - mousePos[1])];
    mpos = [mousePos[0], mousePos[1]];
    if (!panNav) {
        if (s._nav.NavRotation(mpos, mdelta)) s.clearRefine();
    } else {
        var mdelta2 = [mdelta[0] * 3, mdelta[1] * 3];
        if (s._nav.NavPan(mdelta2)) s.clearRefine();
    }
}

function mouseWheel(ev) {
    if (!animStoped) return;
    $("#onloadCopy").css('display', 'none');
    mouseDownHide();
    mouseWheelHide();
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    setTimeout(Autoplayfive, 5000);
    timeouts = [];
    clearTimeout(autoPlayInt);
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    autoRotateStop();
    clearTimeout(startAutorot);
    divHide();
    if (autoplayAnim) autoPauseAllAnimations();
    var s = getScene(ev);
    var delta = ev.wheelDelta ? ev.wheelDelta : (-ev.detail * 10.0);
    var deltaScene = delta * 0.06;
    if (s._nav.NavChangeDolly(deltaScene))
        s.clearRefine();
}

function updateZoomBarBg(newval) {
    var scale = -(navMinDolly - navMaxDolly);
    var val = -newval + navMaxDolly;
    $("#zoom_slider_bg").css("height", (val / scale) * 100 + "%");
}


function updateZoomBar(newval) {
    var scale = -(navMinDolly - navMaxDolly);
    var val = -newval;
    $(".ui-slider-handle").css("bottom", (val / scale) * 100 + "%");
}

var animStoped = true;
var dragCursor;
var curBrowser = BrowserDetect.browser;
// IE doesn't support co-ordinates
var cursCoords = (curBrowser == "Explorer") ? "" : " 4 4";

function initDragCursor() {
    handOpen();
    $('#sliderBG').mousedown(function () {
        handClosed();
    });
    $('.ui-slider-handle').mousedown(function () {
        handClosed();
    });
    $('body').mouseup(function () {
        handOpen();
    });
    $('body').mouseup(function () {
        handOpen();
    });
}

function handClosed() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grabbing" : "url(images_gl/closedhand.cur)" + cursCoords + ", move";
    // Opera doesn't support url cursors and doesn't fall back well...
    if (curBrowser == "Opera") dragCursor = "move";
    $('.ui-slider-handle').css("cursor", dragCursor);
    $('#sliderBG').css("cursor", dragCursor);
    $('#dummy-canvas').css("cursor", dragCursor);
}

function handOpen() {
    dragCursor = (curBrowser == "Firefox") ? "-moz-grab" : "url(images_gl/openhand.cur)" + cursCoords + ", move";
    $('.ui-slider-handle').css("cursor", dragCursor);
    $('#sliderBG').css("cursor", dragCursor);
    $('#dummy-canvas').css("cursor", dragCursor);
}

var mouseIsDown = false;
var loopCtr = 0;
var touch = new Vector3();
var touches = [new Vector3(), new Vector3(), new Vector3()];
var prevTouches = [new Vector3(), new Vector3(), new Vector3()];
var prevDistance = null;
var startAutorot;
function touchStart(event) {
    if (!animStoped) return;
    mdown = true;
    console.log("touch fun call");
    autoPauseAllAnimations();
    setTimeout(Autoplayfive, 5000);
    autoRotateStop();
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
    for (var i = 0; i < timeoutsnew.length; i++) {
        clearTimeout(timeoutsnew[i]);
    }

    timeoutsnew = [];
    mouseDownHide();
    mouseWheelHide();
    clearTimeout(autoPlayInt)
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    clearTimeout(startAutorot);
    //for (var j = 1; j <= 13; j++) {if(j ==3 || j ==6 || j ==7 || j ==8){}else{translateOut(j);}}
    switch (event.touches.length) {
        case 1:
            touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
            touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
            break;
        case 2:
            //  for (var j = 1; j <= 15; j++) {translateOut(j);}
            touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
            touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
            prevDistance = touches[0].distanceTo(touches[1]);
            break;
    }
    prevTouches[0].copy(touches[0]);
    prevTouches[1].copy(touches[1]);
}

var doubleTouch = false;

function touchMove(event) {
    if (!animStoped || !mdown) return;
    autoPauseAllAnimations();
    clearInterval(autoRotateInterval);
    clearTimeout(myVar);
    clearTimeout(startAutorot);
    var s = getScene(event);
    event.preventDefault();
    event.stopPropagation();
    var getClosest = function (touch, touches) {
        var closest = touches[0];
        for (var i in touches) {
            if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) closest = touches[i];
        }
        return closest;
    }
    switch (event.touches.length) {
        case 1:
            if (doubleTouch == false) {
                clearInterval(autoRotateInterval);
                clearTimeout(myVar);
                touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
                if (s._nav.NavRotation([touches[0].x, touches[0].y], [(prevTouches[0].x - touches[0].x) * 1.5, (prevTouches[0].y - touches[0].y) * 1.5])) s.clearRefine();
            }
            break;
        case 2:

            doubleTouch = true;
            //alert("double");
            clearInterval(autoRotateInterval);
            clearTimeout(myVar);
            touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
            touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
            distance = touches[0].distanceTo(touches[1]);
            var deltaScene = -(prevDistance - distance) * 3;
            if (s._nav.NavChangeDolly(deltaScene)) {
                s.clearRefine();
            }
            prevDistance = distance;
            var offset0 = touches[0].clone().sub(getClosest(touches[0], prevTouches));
            var offset1 = touches[1].clone().sub(getClosest(touches[1], prevTouches));
            offset0.x = -offset0.x;
            offset1.x = -offset1.x;
            var mdelta2 = [offset1.x * 10, -offset1.y * 10];

            if (s._nav.NavPan(mdelta2)) s.clearRefine();
            break;
    }
    prevTouches[0].copy(touches[0]);
    prevTouches[1].copy(touches[1]);

}

function touchEndCan(event) {
    mdown = false;
    setTimeout(function () {
        doubleTouch = false;
    }, 100);
}



function parseXml() {
    //console.log("fn call in ");
    $.ajax({
        url: 'text.xml', // name of file you want to parse
        dataType: "xml", // type of file you are trying to read
        success: function parse(document) {
            $(document).find("loader").each(function () {

                var subheading = $(this).find('subheading').text();
                $('.subheading').append(subheading);
                var greyLeftTop = $(this).find('greyLeftTop').text();
                $('.grey-left-top').append(greyLeftTop);
                var greyLeftBottom = $(this).find('greyLeftBottom').text();
                $('.grey-left-bottom').prepend(greyLeftBottom);
                var greyRightTop = $(this).find('greyRightTop').text();
                $('.grey-right-top').append(greyRightTop);
                var greyRightBottom = $(this).find('greyRightBottom').text();
                $('.grey-right-bottom').append(greyRightBottom);
                var loaderOpen = $(this).find('loaderOpen').text();
                $('.loader-open').append(loaderOpen);
                var loaderZoom = $(this).find('loaderZoom').text();
                $('.loader-zoom').append(loaderZoom);
                var loaderRotate = $(this).find('loaderRotate').text();
                $('.loader-rotate').append(loaderRotate);
                var loaderMove = $(this).find('loaderMove').text();
                $('.loader-move').append(loaderMove);
                var leftMouse = $(this).find('leftMouse').text();
                $('.left-mouse').prepend(leftMouse);
                var rotateMouse = $(this).find('rotateMouse').text();
                $('.rotate-mouse').append(rotateMouse);
                var scrollMouse = $(this).find('scrollMouse').text();
                $('.scroll-mouse').prepend(scrollMouse);
                var zoomMouse = $(this).find('zoomMouse').text();
                $('.zoom').append(zoomMouse);
                var bothMouse = $(this).find('bothMouse').text();
                $('.both-mouse').prepend(bothMouse);
                var pan = $(this).find('pan').text();
                $('.pan-mouse').append(pan);
            });



            $(document).find("onloadCopy").each(function () {
                var point1_1 = $(this).find('point1text1').text();
                $('#onloadCopy p:nth-child(1)').append(point1_1);
            });

            $(document).find("buttons").each(function () {
                var backText = $(this).find('backText').text();
                $('#backText').append(backText);
                var zoomText = $(this).find('zoomText').text();
                $('#zoomText').append(zoomText);
                var roatateText = $(this).find('roatateText').text();
                $('#roatateText').append(roatateText);
                var moveText = $(this).find('moveText').text();
                $('#moveText').append(moveText);
                btnOpen = $(this).find('divOpen').text();
                $('#openCloseDiv').html(btnOpen);
                btnClose = $(this).find('divClose').text();
            });
            $(document).find("pointtext1").each(function () {
                var point1_1 = $(this).find('point1text1').text();
                $('#pointtext1 #Cp_text_01').append(point1_1);
                var point1_2 = $(this).find('point1text2').text();
                $('#pointtext1 #Cp_text_02').append(point1_2);
                var point1_3 = $(this).find('point1text3').text();
                $('#pointtext1 #Cp_text_03').append(point1_3);
                var point1_4 = $(this).find('point1text4').text();
                $('#pointtext1 #Cp_text_04').append(point1_4);
                var point1_5 = $(this).find('point1text5').text();
                $('#pointtext1 #Cp_text_05').append(point1_5);
                var point1_6 = $(this).find('point1text6').text();
                $('#pointtext1 #Cp_text_06').append(point1_6);
                var point1_7 = $(this).find('point1text7').text();
                $('#pointtext1 #Cp_text_07').append(point1_7);
                var point1_8 = $(this).find('point1text8').text();
                $('#pointtext1 #Cp_text_08').append(point1_8);
                var point1_9 = $(this).find('point1text9').text();
                $('#pointtext1 #Cp_text_09').append(point1_9);
                var point1_10 = $(this).find('point1text10').text();
                $('#pointtext1 #Cp_text_10').append(point1_10);
                var point1_11 = $(this).find('point1text11').text();
                $('#pointtext1 #Cp_text_11').append(point1_11);
                var point1_12 = $(this).find('point1text12').text();
                $('#pointtext1 #Cp_text_12').append(point1_12);
                var point1_13 = $(this).find('point1text13').text();
                $('#pointtext1 .Cp_textul li:nth-child(1)').html(point1_13);
                var point1_14 = $(this).find('point1text14').text();
                $('#pointtext1 .Cp_textul li:nth-child(2)').html(point1_14);
                var point1_15 = $(this).find('point1text15').text();
                $('#pointtext1 .Cp_textul li:nth-child(3)').html(point1_15);
                var point1_16 = $(this).find('point1text16').text();
                $('#pointtext1 .Cp_textul li:nth-child(4)').html(point1_16);


            });

            $(document).find("point2text").each(function () {

            });

            $(document).find("point3text").each(function () {
                var point3_1 = $(this).find('headingText').text();
                $('#point3text .point3headingText').append(point3_1);

                // var point3_2 = $(this).find('point3text1').text();
                // $('#point3text #hot1').append(point3_2);
                // var point3_3 = $(this).find('point3text2').text();
                // $('#point3text #hot2').append(point3_3);
                // var point3_4 = $(this).find('point3text3').text();
                // $('#point3text #hot3').append(point3_4);
                // var point3_5 = $(this).find('point3text4').text();
                // $('#point3text #hot4').append(point3_5);
                // var point3_6 = $(this).find('point3text5').text();
                // $('#point3text #hot5').append(point3_6);
                // var point3_7 = $(this).find('point3text6').text();
                // $('#point3text #hot6').append(point3_7);
            });

            $(document).find("point4text").each(function () {
                var point4_1 = $(this).find('point4text1').text();
                $('#point4text #hot1').append(point4_1);
                var point4_2 = $(this).find('point4text2').text();
                $('#point4text #hot2').append(point4_2);
                var point4_3 = $(this).find('point4text3').text();
                $('#point4text #hot3').append(point4_3);
                var point4_4 = $(this).find('point4text4').text();
                $('#point4text #hot4').append(point4_4);
                var point4_5 = $(this).find('point4text5').text();
                $('#point4text #hot52').append(point4_5);
                var point4_6 = $(this).find('point4text6').text();
                $('#point4text #hot62').append(point4_6);
                var point4_7 = $(this).find('point4text7').text();
                $('#point4text #hot72').append(point4_7);

            });

            $(document).find("point5text").each(function () {
                var point5_0 = $(this).find('point5heading').text();
                $('.point5headingText').append(point5_0);
                var point5_1 = $(this).find('point5text1').text();
                $('#point5text .point5text1').append(point5_1);
                var point5_2 = $(this).find('point5text2').text();
                $('#point5text .point5text2').append(point5_2);
                var point5_3 = $(this).find('point5text3').text();
                $('#point5text .point5text3').append(point5_3);
                var point5_4 = $(this).find('point5text4').text();
                $('#point5text .point5text4').append(point5_4);
                var point5_5 = $(this).find('point5text5').text();
                $('#point5text .point5text5').append(point5_5);
                var point5_6 = $(this).find('point5text6').text();
                $('#point5text .point5text6').append(point5_6);
            });




            $(document).find("pointtext6").each(function () {
                var point6_11 = $(this).find('point6heading').text();
                $('.point6headingText').append(point6_11);
                var point6_3 = $(this).find('point6text3').text();
                $('#hot13').html(point6_3);
                var point6_4 = $(this).find('point6text4').text();
                $('#hot14').html(point6_4);
                var point6_5 = $(this).find('point6text5').text();
                $('#hot15').html(point6_5);
                var point6_6 = $(this).find('point6text6').text();
                $('#hot16').html(point6_6);
                var point6_12 = $(this).find('point6text12').text();
                $('#hot22').html(point6_12);
            });


            $(document).find("point7text").each(function () {
                var point7_1 = $(this).find('point7headingText').text();
                $('.point7headingText').append(point7_1);
                var point7_2 = $(this).find('point7text1').text();
                $('#point7text .point7text1').append(point7_2);
                var point7_3 = $(this).find('point7text2').text();
                $('#hot23').append(point7_3);
                var point7_4 = $(this).find('point7text3').text();
                $('#hot24').append(point7_4);
                var point7_5 = $(this).find('point7text4').text();
                $('#hot25').append(point7_5);
                var point7_6 = $(this).find('point7text5').text();
                $('#hot26').append(point7_6);
                var point7_7 = $(this).find('point7text6').text();
                $('#hot27').append(point7_7);
                var point7_8 = $(this).find('point7text7').text();
                $('#hot28').append(point7_8);
                var point7_9 = $(this).find('point7text8').text();
                $('#hot29').append(point7_9);
            });

            $(document).find("point8text").each(function () {
                var point8_1 = $(this).find('point8text1').text();
                $('#point8text #hot91').append(point8_1);
                var point8_2 = $(this).find('point8text2').text();
                $('#point8text #hot92').append(point8_2);
                var point8_3 = $(this).find('point8text3').text();
                $('#point8text #hot93').append(point8_3);
                var point8_4 = $(this).find('point8text4').text();
                $('#point8text #hot94').append(point8_4);
                var point8_5 = $(this).find('point8text5').text();
                $('#point8text #hot95').append(point8_5);
                var point8_6 = $(this).find('point8text6').text();
                $('#point8text #hot96').append(point8_6);
                var point8_7 = $(this).find('point8text7').text();
                $('#point8text #hot97').append(point8_7);
                var point8_8 = $(this).find('point8text8').text();
                $('#point8text #hot98').append(point8_8);
            });


            $(document).find("point9text").each(function () {
                var point9_1 = $(this).find('point9headingText').text();
                $('.point9headingText').append(point9_1);
                var point9_2 = $(this).find('point9text1').text();
                $('#point9text1').append(point9_2);

            });


            $(document).find("point10text").each(function () {
                var point10_1 = $(this).find('headingText').text();
                $('#point10text p:nth-child(1)').append(point10_1);
                var point10_2 = $(this).find('point10text1').text();
                $('#point10text p:nth-child(2)').append(point10_2);
                var point10_3 = $(this).find('point10text2').text();
                $('#point10text p:nth-child(3)').append(point10_3);
                var point10_4 = $(this).find('point10text3').text();
                $('#point10text p:nth-child(4)').append(point10_4);
                var point10_5 = $(this).find('point10text4').text();
                $('#point10text p:nth-child(5)').append(point10_5);
                var point10_6 = $(this).find('point10text5').text();
                $('#point10text p:nth-child(6)').append(point10_6);
                var point10_11 = $(this).find('point10text10').text();
                $('#point10text p:nth-child(7)').append(point10_11);

                var point10_7 = $(this).find('point10text6').text();
                $('#point10text ul li:nth-child(1)').append(point10_7);
                var point10_8 = $(this).find('point10text7').text();
                $('#point10text ul li:nth-child(2)').append(point10_8);
                var point10_9 = $(this).find('point10text8').text();
                $('#point10text ul li:nth-child(3)').append(point10_9);
                var point10_10 = $(this).find('point10text9').text();
                $('#point10text ul li:nth-child(4)').append(point10_10);
                var point10_12 = $(this).find('point10text11').text();
                $('#point10text ul li:nth-child(5)').append(point10_12);

            });

            $(document).find("point11text").each(function () {
                var point11_2 = $(this).find('point11text1').text();
                $('#point11text1').append(point11_2);

            });
            $(document).find("point111text").each(function () {
                var point111_1 = $(this).find('point111text1').text();
                $('#point111text1').append(point111_1);
                var point111_2 = $(this).find('point111text2').text();
                $('#point111text2').append(point111_2);

            });
            $(document).find("point15text").each(function () {
                var point15_2 = $(this).find('point15text1').text();
                $('#point15text1').append(point15_2);

            });

            $(document).find("point16text").each(function () {
                var point16_1 = $(this).find('point16text1').text();
                $('#point16text1').append(point16_1);

            });
            $(document).find("point20text").each(function () {
                var point20_1 = $(this).find('point20text1').text();
                $('#point20text1').append(point20_1);

            });

            $(document).find("point21text").each(function () {
                var point1_1 = $(this).find('point21text1').text();
                $('#point21text1').append(point1_1);
                var point1_01 = $(this).find('point21text01').text();
                $('#point21text01').append(point1_01);
                var point1_2 = $(this).find('point21text2').text();
                $('#point21text2').append(point1_2);
                var point1_02 = $(this).find('point21text02').text();
                $('#point21text02').append(point1_02);
                var point1_3 = $(this).find('point21text3').text();
                $('#point21list li:nth-child(1)').append(point1_3);
                var point1_4 = $(this).find('point21text4').text();
                $('#point21list li:nth-child(2)').append(point1_4);
                var point1_5 = $(this).find('point21text5').text();
                $('#point21list li:nth-child(3)').append(point1_5);
                var point1_6 = $(this).find('point21text6').text();
                $('#point21list li:nth-child(4)').append(point1_6);
                var point1_7 = $(this).find('point21text7').text();
                $('#point21list li:nth-child(5)').append(point1_7);
            });
            $(document).find("point17text").each(function () {
                var point17_1 = $(this).find('point17text1').text();
                $('#point17text1').append(point17_1);

            });
            $(document).find("point18text").each(function () {


            });
            $(document).find("point19text").each(function () {
                var point19_1 = $(this).find('point19text1').text();
                $('#point19text #hot12').append(point19_1);
                var point19_2 = $(this).find('point19text2').text();
                $('#point19text #hot13').append(point19_2);
                var point19_3 = $(this).find('point19text3').text();
                $('#point19text #hot14').append(point19_3);
                var point19_4 = $(this).find('point19text4').text();
                $('#point19text #hot15').append(point19_4);
                var point19_5 = $(this).find('point19text5').text();
                $('#point19text #hot16').append(point19_5);
                var point19_6 = $(this).find('point19text6').text();
                $('#point19text #hot155').append(point19_6);
                var point19_7 = $(this).find('point19text7').text();
                $('#point19text #hot114').append(point19_7);

            });

            $(document).find("point13text").each(function () {

                var point13_1 = $(this).find('point13text1').text();
                $('#point13text1').append(point13_1);
                var point13_2 = $(this).find('point13text2').text();


            });


            $(document).find("point14text").each(function () {
                var point14_1 = $(this).find('point14text1').text();
                $('#point14text #point14text1').append(point14_1);
            });
            $(document).find("point12text").each(function () {
                var point12_1 = $(this).find('point12text1').text();
                $('#point12text1').append(point12_1);
            });

        }, // name of the function to call upon success
        error: function () { alert("Error: Something went wrong"); }
    });
}

function translateIn(no) {
    $("#onloadCopy").css("opacity", "1");
    $("#point" + no + "text > p:eq(0)").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "1"
    });
    $("#point" + no + "text > p:gt(0)").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "1"
    });

    $("#point" + no + "text p> ").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "1"
    });

    $("#point" + no + "text ul").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "1"
    });
    $("#point0image4").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "1"
    });
    $("#text1, #text2, #text3").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)",
        "opacity": "0"
    });
    $(".headingText1").css('opacity', '0');
    $(".headingText1").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)"
    });
    $(".bodyText1").css('opacity', '0');
    $(".bodyText1").css({
        "webkitTransform": "translate(0,-5px)",
        "MozTransform": "translate(0,-5px)",
        "msTransform": "translate(0,-5px)",
        "OTransform": "translate(0,-5px)",
        "transform": "translate(0,-5px)"
    });
}

function translateOut(no) {

    //            $(".point1text1").fadeOut(500);

    $("#point" + no + "text").fadeOut(500);
    $("#image" + no).css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $("#point" + no + "text > p:eq(0)").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $("#point" + no + "text > p:gt(0)").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $("#point" + no + "text > ul").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $(".menu").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $(".headingText1").css('opacity', '0');
    $(".headingText1").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)"
    });
    $(".bodyText1").css('opacity', '0');
    $(".bodyText1").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)"
    });
    $("#text1, #text2, #text3").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $(".heading5Text, .body5Text,.point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css('opacity', '0');
    $(".heading5Text, .body5Text,.point5text7, .point5text8, .point5text9, .point5text10, .point5text11, .point5text12, .heading6Text, .body6Text, .point6text6, .point6text7, .point6text8, .point6text9, .point6text10, .point6text11, .point6text12").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)"
    });
    $("#topheading").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });
    $("#onloadCopy").css({
        "webkitTransform": "translate(0,0px)",
        "MozTransform": "translate(0,0px)",
        "msTransform": "translate(0,0px)",
        "OTransform": "translate(0,0px)",
        "transform": "translate(0,0px)",
        "opacity": 0
    });


}

var AutoplayInterval;
var autofive = [];
var AutoplayRackInnerNew;

var isCallAutoplayfive = false;

function Autoplayfive() {
    clearAutoPlayFive()
    clearTimeout(AutoplayRackInnerNew);
    var autoServerTimer = 300000;
    var autoBackTimer = 1800000;
    if (parent.autoplayCatalog && !isCallAutoplayfive) {
        autoServerTimer = 8000;
    }
    if (isCallAutoplayfive || parent.activeRackLength == 1) {
        autoplayCatalog = false;
        window.parent.autoplayCatalog = false;
    }
    isCallAutoplayfive = true;

    autofive.push(setTimeout(function () {
        console.log("autoFive");
        $(".playAll").trigger("click");

        // AutoplayRackInnerNew = setTimeout(function () {
        //     parent.AutoplayRackInner();
        // }, autoBackTimer);
    }, autoServerTimer));
}

function clearAutoPlayFive() {
    for (var i = 0; i < autofive.length; i++) {
        clearTimeout(autofive[i]);
    }
    autofive = [];
}