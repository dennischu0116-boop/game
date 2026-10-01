export function nearbyUnits(units,id,radius=75){const u=units.find(v=>v.id===id);return u?units.filter(v=>Math.hypot(v.x-u.x,v.y-u.y)<radius):[];}
