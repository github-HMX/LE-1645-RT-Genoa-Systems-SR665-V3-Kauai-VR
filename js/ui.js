// --------------------------------------------------------START----------------------------------------------------------//
// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
var blaze3d_normalize = function (pt) {
    var d = Math.sqrt((pt[0] * pt[0]) + (pt[1] * pt[1]) + (pt[2] * pt[2]));
    if (d == 0) return [0, 0, 0];
    return [pt[0] / d, pt[1] / d, pt[2] / d];
}
var blaze3d_dp = function (v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function MatrixGetX(m) {
    return [m[0], m[1], m[2]];
}

function MatrixGetY(m) {
    return [m[4], m[5], m[6]];
}

function MatrixGetZ(m) {
    return blaze3d_normalize([0 - m[0], 0 - m[1], 0 - m[2]]);
}

function MatrixGetPos(m) {
    return [m[0], m[1], m[2]];
}

function MatrixRotationAxis(fAngle, fX, fY, fZ) {
    var s = Math.sin(fAngle);
    var c = Math.cos(fAngle);
    var x = fX;
    var y = fY;
    var z = fZ;
    var mOut = Array();
    mOut[0] = x * x * (1 - c) + c;
    mOut[4] = x * y * (1 - c) - (z * s);
    mOut[8] = x * z * (1 - c) + (y * s);
    mOut[12] = 0;
    mOut[1] = y * x * (1 - c) + (z * s);
    mOut[5] = y * y * (1 - c) + c;
    mOut[9] = y * z * (1 - c) - (x * s);
    mOut[13] = 0;
    mOut[2] = z * x * (1 - c) - (y * s);
    mOut[6] = z * y * (1 - c) + (x * s);
    mOut[10] = z * z * (1 - c) + c;
    mOut[14] = 0.0;
    mOut[3] = 0.0;
    mOut[7] = 0.0;
    mOut[11] = 0.0;
    mOut[15] = 1.0;
    return mOut;
}

function MatrixMultiply(mA, mB) {
    var mRet = Array();
    // Perform calculation on a dummy matrix (mRet)
    mRet[0] = mA[0] * mB[0] + mA[1] * mB[4] + mA[2] * mB[8] + mA[3] * mB[12];
    mRet[1] = mA[0] * mB[1] + mA[1] * mB[5] + mA[2] * mB[9] + mA[3] * mB[13];
    mRet[2] = mA[0] * mB[2] + mA[1] * mB[6] + mA[2] * mB[10] + mA[3] * mB[14];
    mRet[3] = mA[0] * mB[3] + mA[1] * mB[7] + mA[2] * mB[11] + mA[3] * mB[15];
    //
    mRet[4] = mA[4] * mB[0] + mA[5] * mB[4] + mA[6] * mB[8] + mA[7] * mB[12];
    mRet[5] = mA[4] * mB[1] + mA[5] * mB[5] + mA[6] * mB[9] + mA[7] * mB[13];
    mRet[6] = mA[4] * mB[2] + mA[5] * mB[6] + mA[6] * mB[10] + mA[7] * mB[14];
    mRet[7] = mA[4] * mB[3] + mA[5] * mB[7] + mA[6] * mB[11] + mA[7] * mB[15];
    //
    mRet[8] = mA[8] * mB[0] + mA[9] * mB[4] + mA[10] * mB[8] + mA[11] * mB[12];
    mRet[9] = mA[8] * mB[1] + mA[9] * mB[5] + mA[10] * mB[9] + mA[11] * mB[13];
    mRet[10] = mA[8] * mB[2] + mA[9] * mB[6] + mA[10] * mB[10] + mA[11] * mB[14];
    mRet[11] = mA[8] * mB[3] + mA[9] * mB[7] + mA[10] * mB[11] + mA[11] * mB[15];
    //
    mRet[12] = mA[12] * mB[0] + mA[13] * mB[4] + mA[14] * mB[8] + mA[15] * mB[12];
    mRet[13] = mA[12] * mB[1] + mA[13] * mB[5] + mA[14] * mB[9] + mA[15] * mB[13];
    mRet[14] = mA[12] * mB[2] + mA[13] * mB[6] + mA[14] * mB[10] + mA[15] * mB[14];
    mRet[15] = mA[12] * mB[3] + mA[13] * mB[7] + mA[14] * mB[11] + mA[15] * mB[15];
    return mRet
}

// --------------------------------------------------------do not edit or remove----------------------------------------------------------//
// --------------------------------------------------------END----------------------------------------------------------//

function showScene() {
    $("#onloadCopy").fadeIn(500);
    $("#menu2").addClass("active");
    $("#scenediv").css("visibility", "visible");
    $(".accordion").css("visibility", "visible");
    $("#rightAnim").css("display", "block");
    $("#lenovo_logo").css("display", "block");
    $("#ButtonController").css("opacity", "1");
    startAutorot = setTimeout(function () {
        // autoRotateCall();
        // console.log("autoRotateCall");
    }, 4000);
    setTimeout(function () {
        $("#zoom_slider").slider("option", "value", 120);
        $('#transparentPatch').css('display', 'none');
        $('#transPatch').css('display', 'none');
        $("#loaderlogo").fadeIn(500);
        currneAnim = 2;
        $("#loaderlogo").fadeIn(500);
       
    }, 500);
}

function onResetCameraClickGL() {

}

var screens = [];
function loadScreens() {

   for (var i = 0; i < 8; i++) {
      screens[i] = scene.createImage("colours","../images_gl/screens/0" + (i + 1) + ".JPG");
   }

}

function TestChangeTexture(screenCh) {
   if (scene) {
      var mat = scene._Material_ref["Screen_Glass_mat_env"];
      mat.setTexture(screenCh,TEXTURE_MAP_DIFFUSETEX);
      var mat2 = scene._Material_ref["SR645_Remote_screen_env"];
      mat2.setTexture(screenCh,TEXTURE_MAP_DIFFUSETEX);
      scene.clearRefine();
   }
}
