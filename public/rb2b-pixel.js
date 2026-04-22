/* Vendored reference loader — primary load is from next/script in app/layout.tsx */
(function (key) {
  if (window.reb2b) return;
  window.reb2b = { loaded: true };
  var s = document.createElement("script");
  s.async = true;
  s.src =
    "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
  var p = document.getElementsByTagName("script")[0];
  p.parentNode.insertBefore(s, p);
})("RB2B_KEY_REPLACE_IN_BUILD");
