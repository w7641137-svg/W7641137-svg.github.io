(function(global){
  'use strict';
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const rand=(a,b)=>a+Math.random()*(b-a);

  function createSequencePlayer({mount}){
    let hero=null, imgs=[], loaded=false, running=false, token=0;
    let layer=null;

    async function load(spec){
      destroy(); hero=spec; loaded=false;
      layer=document.createElement('div');
      layer.className='sequence-layer';
      layer.style.cssText='position:absolute;inset:0;pointer-events:none;';
      mount.appendChild(layer);
      imgs=[];
      for(const url of spec.frames){
        const img=new Image();
        img.decoding='async'; img.alt=''; img.src=url;
        img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;will-change:opacity;user-select:none;-webkit-user-drag:none;';
        layer.appendChild(img); imgs.push(img);
      }
      await Promise.all(imgs.map(img=>img.decode ? img.decode().catch(()=>{}) : new Promise(r=>{img.onload=img.onerror=r;})));
      loaded=true; reset(); return true;
    }

    function reset(){ if(!imgs.length)return; imgs.forEach((im,i)=>im.style.opacity=i===0?'1':'0'); }

    function crossfade(a,b,ms,myToken){
      return new Promise(resolve=>{
        if(myToken!==token)return resolve(false);
        const from=imgs[a], to=imgs[b];
        if(!from||!to)return resolve(false);
        to.style.transition='none'; to.style.opacity='0';
        from.style.transition='none'; from.style.opacity='1';
        void to.offsetWidth;
        const easing='cubic-bezier(.35,0,.22,1)';
        to.style.transition=`opacity ${ms}ms ${easing}`;
        from.style.transition=`opacity ${ms}ms ${easing}`;
        to.style.opacity='1'; from.style.opacity='0';
        const t=setTimeout(()=>resolve(myToken===token),ms+24);
      });
    }

    async function gesture(myToken){
      // Deliberately slow, museum-like nod. Full pre-rendered frames only.
      const ms=[340,350,370,390,430,140,300,420,460];
      for(let i=0;i<9;i++){
        if(!(await crossfade(i,i+1,ms[i],myToken)))return false;
        if(i===4) await sleep(180);   // bottom point before blink frame
        if(i===5) await sleep(120);   // blink is brief
        if(myToken!==token)return false;
      }
      await sleep(180);
      if(myToken!==token)return false;
      await crossfade(9,0,480,myToken);
      reset(); return true;
    }

    async function loop(myToken){
      await sleep(hero.restBefore||1800);
      while(running && myToken===token){
        await gesture(myToken);
        if(!running||myToken!==token)return;
        const g=hero.gap||[14000,19000];
        await sleep(rand(g[0],g[1]));
      }
    }

    function start(){
      if(!loaded||running)return;
      running=true; token++; const t=token;
      if(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches){reset();return;}
      loop(t);
    }
    function stop(){running=false;token++;reset();}
    function destroy(){
      running=false;token++;loaded=false;
      if(layer){layer.remove();layer=null;}
      imgs.forEach(i=>{i.src='';}); imgs=[]; hero=null;
    }
    document.addEventListener('visibilitychange',()=>{
      if(!running)return;
      token++; reset();
      if(!document.hidden){const t=token;loop(t);}
    });
    return {load,start,stop,destroy,get isLoaded(){return loaded;},get heroId(){return hero&&hero.id;}};
  }
  global.createSequencePlayer=createSequencePlayer;
})(window);