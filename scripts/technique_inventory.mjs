import { techniqueInfo, defaultTechniqueSettings } from '../frontend/src/techniques.ts';
import { directOutputTechniques, directOutputUrl, specialOutputUrl } from '../frontend/src/techniqueOutput.ts';
const techniques = Object.entries(techniqueInfo).map(([id, info]) => {
 const recipe = { technique: id, settings: defaultTechniqueSettings, popOut:false, strength:2, swapEyes:false, retinalRivalry:false, screenDepth:null, format:'png', jpegQuality:95 };
 return { id,...info,preview:directOutputTechniques.has(id)?directOutputUrl('',recipe,'preview'):specialOutputUrl('',recipe,'preview'),full:directOutputTechniques.has(id)?directOutputUrl('',recipe,'full'):specialOutputUrl('',recipe,'full') };
});
console.log(JSON.stringify({legacy:'c4e698d2cf4610964408c0ff69a71f8735d406e8',defaultTechniqueSettings,techniques},null,2));
