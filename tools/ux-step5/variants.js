/* UI/UX roadmap step 5: the plate prototype's variants (tools/ux-step5/protos/plate.js), shared by protos-run.js and motion-paper.js */
"use strict";
module.exports={
  base:null,
  frame:{surround:true, neatline:true, hold:"none", cart:"margin", names:"none"},
  hold:{surround:true, neatline:true, hold:"always", cart:"margin", names:"none"},
  holdc:{surround:true, neatline:true, hold:"always", holdCounters:true, cart:"margin", names:"none"},
  "hold-framed":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"none"},
  rank:{surround:true, neatline:true, hold:"always", cart:"margin", names:"rank", rank:3.95},
  "rank-noh":{surround:true, neatline:true, hold:"none", cart:"margin", names:"rank", rank:3.95},
  "rank25":{surround:true, neatline:true, hold:"always", cart:"margin", names:"rank", rank:2.5},
  "rank55":{surround:true, neatline:true, hold:"always", cart:"margin", names:"rank", rank:5.5},
  basel:{surround:true, neatline:true, hold:"always", cart:"margin", names:"base"},
  "basel-noh":{surround:true, neatline:true, hold:"none", cart:"margin", names:"base"},
  "basel-framed":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"base"},
  first:{surround:true, neatline:true, hold:"always", cart:"margin", names:"first", firstWhen:"framed"},
  "first-noh":{surround:true, neatline:true, hold:"none", cart:"margin", names:"first", firstWhen:"framed"},
  "hold-nocart":{surround:true, neatline:"framed", hold:"framed", cart:"none", names:"none"},
  surround:{surround:true, neatline:false, hold:"none", cart:"none", names:"none"},
  "neat-only":{surround:true, neatline:"framed", hold:"none", cart:"none", names:"none"},
  "rank-rest":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"rank", rank:3.95, rankWhen:"rest"},
  "rank25-rest":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"rank", rank:2.5, rankWhen:"rest"},
  "first-rest":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"first", firstWhen:"rest"},
  "first-always":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"first", firstWhen:"always"},
  "first-framed":{surround:true, neatline:"framed", hold:"framed", cart:"margin", cartFramed:true, names:"first", firstWhen:"framed"}
};
