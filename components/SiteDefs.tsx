/* The signature shape: one contour drawing, reused at every scale. */
export function SiteDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
    <path id="ring" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"
      d="M470.6 -3.0L472.4 13.3L473.2 29.7L472.9 46.1L471.6 62.5L469.3 78.9L466.0 95.1L461.9 111.1L457.2 127.0L451.9 142.8L446.2 158.4L440.0 173.9L433.4 189.3L426.2 204.5L418.4 219.5L409.8 234.1L400.1 248.2L389.5 261.6L377.7 274.2L364.8 285.8L351.0 296.4L336.2 306.0L320.8 314.6L305.0 322.2L288.8 329.1L272.6 335.4L256.4 341.3L240.4 346.8L224.5 352.2L208.8 357.5L193.3 362.7L177.9 367.8L162.6 372.8L147.3 377.8L131.9 382.6L116.4 387.3L100.9 391.8L85.2 396.3L69.4 400.7L53.4 405.0L37.2 409.2L20.8 413.3L4.0 417.2L-13.0 420.6L-30.4 423.4L-47.9 425.5L-65.6 426.4L-83.3 426.2L-100.9 424.6L-118.3 421.6L-135.4 417.3L-152.0 411.7L-168.2 405.0L-183.9 397.5L-199.1 389.3L-214.0 380.7L-228.7 371.8L-243.1 362.8L-257.5 353.7L-271.8 344.5L-285.9 335.1L-299.9 325.4L-313.7 315.4L-327.0 304.9L-339.9 293.8L-352.2 282.1L-363.8 269.8L-374.6 256.9L-384.8 243.5L-394.2 229.7L-403.0 215.5L-411.2 201.1L-418.8 186.4L-425.8 171.4L-432.2 156.2L-438.0 140.8L-442.9 125.2L-447.0 109.4L-450.2 93.4L-452.3 77.3L-453.4 61.1L-453.6 44.9L-452.9 28.8L-451.4 12.8L-449.4 -3.0L-447.0 -18.7L-444.2 -34.2L-441.3 -49.7L-438.1 -65.0L-434.7 -80.2L-430.9 -95.3L-426.7 -110.3L-421.9 -125.2L-416.5 -139.8L-410.2 -154.2L-403.2 -168.2L-395.5 -181.9L-387.1 -195.3L-378.3 -208.3L-369.2 -221.1L-360.0 -233.8L-350.7 -246.5L-341.6 -259.3L-332.5 -272.3L-323.4 -285.5L-314.3 -299.0L-304.9 -312.6L-295.2 -326.3L-284.8 -339.8L-273.7 -353.0L-261.9 -365.7L-249.1 -377.6L-235.5 -388.8L-221.0 -399.0L-205.8 -408.2L-190.0 -416.4L-173.5 -423.6L-156.6 -429.8L-139.3 -435.0L-121.7 -439.2L-103.8 -442.3L-85.8 -444.4L-67.7 -445.4L-49.6 -445.2L-31.5 -444.0L-13.6 -441.7L4.0 -438.4L21.4 -434.4L38.4 -429.8L55.1 -424.8L71.5 -419.6L87.7 -414.5L103.8 -409.6L119.8 -404.8L135.8 -400.3L151.8 -395.9L167.9 -391.4L184.0 -386.7L200.0 -381.6L215.8 -375.8L231.3 -369.2L246.3 -361.7L260.8 -353.2L274.6 -343.9L287.7 -333.8L300.2 -323.1L312.1 -311.8L323.5 -300.1L334.5 -288.2L345.1 -276.0L355.5 -263.7L365.6 -251.2L375.3 -238.5L384.7 -225.5L393.7 -212.3L402.2 -198.7L410.1 -184.9L417.4 -170.7L424.2 -156.4L430.4 -141.8L436.2 -127.0L441.6 -112.1L446.8 -97.0L451.7 -81.8L456.3 -66.4L460.6 -50.8L464.5 -35.1L467.9 -19.1Z"/>
    <symbol id="contour" viewBox="-500 -500 1000 1000">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <use href="#ring" transform="rotate(-24) translate(0 0) scale(.055)"/>
        <use href="#ring" transform="rotate(-20) translate(3 -2) scale(.105)"/>
        <use href="#ring" transform="rotate(-16) translate(6 -3) scale(.16)"/>
        <use href="#ring" transform="rotate(-12) translate(2 -5) scale(.22)"/>
        <use href="#ring" transform="rotate(-8) translate(-2 -3) scale(.285)"/>
        <use href="#ring" transform="rotate(-4) translate(-5 -4) scale(.355)"/>
        <use href="#ring" transform="rotate(0) translate(-2 -7) scale(.43)"/>
        <use href="#ring" transform="rotate(4) translate(3 -6) scale(.51)"/>
        <use href="#ring" transform="rotate(9) translate(7 -5) scale(.595)"/>
        <use href="#ring" transform="rotate(14) translate(4 -3) scale(.685)"/>
        <use href="#ring" transform="rotate(19) translate(0 -1) scale(.78)"/>
        <use href="#ring" transform="rotate(24) translate(-4 0) scale(.88)"/>
        <use href="#ring" transform="rotate(29) translate(0 0) scale(.975)"/>
      </g>
    </symbol>
  </defs>
    </svg>
  );
}
