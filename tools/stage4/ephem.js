/* Stage 4 Part A: the sun on 2 December 1805 at a site, as one self-contained function (so the page probes can inject it):
   Meeus's low-accuracy solar coordinates (Astronomical Algorithms, ch. 25), NOAA's equation of time, Bennett's refraction.
   makeSun(lat, lon) returns sunAtClock(t, basis): t is the app's clock in minutes after midnight; basis "apparent" reads it as
   local apparent (solar) time, "mean" as local mean time. Returns {alt (refracted), geo (geometric), az (true, from north),
   dec, eot (minutes, apparent - mean)}. Derived from astronomy; delta T (about 12 s in 1805) is ignored. */
function makeSun(LAT,LON){
  var D2R=Math.PI/180, R2D=180/Math.PI;
  function jd(y,m,d){ if(m<=2){ y--; m+=12; } var A=Math.floor(y/100), B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5; }
  function sunAt(JD){
    var T=(JD-2451545)/36525;
    var L0=((280.46646+36000.76983*T+0.0003032*T*T)%360+360)%360;
    var M=357.52911+35999.05029*T-0.0001537*T*T, e=0.016708634-0.000042037*T-0.0000001267*T*T;
    var C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M*D2R)+(0.019993-0.000101*T)*Math.sin(2*M*D2R)+0.000289*Math.sin(3*M*D2R);
    var Om=125.04-1934.136*T, lam=L0+C-0.00569-0.00478*Math.sin(Om*D2R);
    var eps=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60+0.00256*Math.cos(Om*D2R);
    var dec=Math.asin(Math.sin(eps*D2R)*Math.sin(lam*D2R))*R2D;
    var y=Math.pow(Math.tan(eps*D2R/2),2), L=L0*D2R, Mr=M*D2R;
    var eot=4*R2D*(y*Math.sin(2*L)-2*e*Math.sin(Mr)+4*e*y*Math.sin(Mr)*Math.cos(2*L)-0.5*y*y*Math.sin(4*L)-1.25*e*e*Math.sin(2*Mr));
    return {dec:dec,eot:eot};
  }
  var JD0=jd(1805,12,2);
  return function sunAtClock(t,basis){
    var s=sunAt(JD0+(t-LON*4)/1440);
    var lmt = basis==="apparent" ? t-s.eot : t;
    s=sunAt(JD0+(lmt-LON*4)/1440);
    var tst = basis==="apparent" ? t : t+s.eot;
    var H=(tst/4-180)*D2R, ph=LAT*D2R, de=s.dec*D2R;
    var alt=Math.asin(Math.sin(ph)*Math.sin(de)+Math.cos(ph)*Math.cos(de)*Math.cos(H))*R2D;
    var az=(Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(ph)-Math.tan(de)*Math.cos(ph))*R2D+540)%360;
    var refr = alt>-1 ? 1.02/Math.tan((alt+10.3/(alt+5.11))*D2R)/60 : 0;
    return {alt:alt+refr, geo:alt, az:az, dec:s.dec, eot:s.eot};
  };
}
if(typeof module!=="undefined") module.exports={makeSun:makeSun};
