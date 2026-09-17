(function(global){
  "use strict";

  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const rand = (a,b) => a + Math.random()*(b-a);
  const easeInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  const easeUp = t => -(Math.cos(Math.PI*t)-1)/2;

  function createCanvasSequencePlayer({canvas}){
    const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});
    let hero=null, imgs=[], loaded=false, running=false, token=0, current=-1;

    function drawFrame(i){
      if(!imgs.length) return;
      i=Math.max(0,Math.min(imgs.length-1,i));
      if(i===current) return;
      const im=imgs[i];
      if(canvas.width!==im.naturalWidth || canvas.height!==im.naturalHeight){
        canvas.width=im.naturalWidth;
        canvas.height=im.naturalHeight;
      }
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(im,0,0,canvas.width,canvas.height);
      current=i;
    }

    async function load(spec){
      stop(); hero=spec; imgs=[]; loaded=false; current=-1;
      for(const url of spec.frames){
        const im=new Image();
        im.decoding="async";
        im.src=url;
        imgs.push(im);
      }
      await Promise.all(imgs.map(im => im.decode ? im.decode() : new Promise((res,rej)=>{im.onload=res; im.onerror=rej;})));
      loaded=true;
      drawFrame(0);
      return true;
    }

    function animate(forward,duration,myToken,ease){
      return new Promise(resolve=>{
        const start=performance.now();
        function step(now){
          if(myToken!==token || !running) return resolve(false);
          const t=Math.min(1,(now-start)/duration);
          const e=ease(t);
          const pos=e*(imgs.length-1);
          const idx=forward ? Math.round(pos) : (imgs.length-1-Math.round(pos));
          drawFrame(idx);
          if(t<1) requestAnimationFrame(step);
          else resolve(true);
        }
        requestAnimationFrame(step);
      });
    }

    async function nod(myToken){
      // В каждый момент на canvas существует ровно ОДИН кадр.
      // Никаких crossfade, opacity-слоёв и второй головы под ним.
      drawFrame(0);
      if(!(await animate(true,hero.timing.down,myToken,easeInOut))) return;
      await sleep(hero.timing.hold||300);
      if(myToken!==token || !running) return;
      await animate(false,hero.timing.up,myToken,easeUp);
      drawFrame(0);
    }

    async function loop(myToken){
      await sleep(hero.timing.rest||1800);
      while(running && myToken===token){
        await nod(myToken);
        if(!running || myToken!==token) return;
        const g=hero.timing.gap||[14000,19000];
        await sleep(rand(g[0],g[1]));
      }
    }

    function start(){
      if(!loaded || running) return;
      running=true; token++;
      const t=token;
      drawFrame(0);
      if(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      loop(t);
    }

    function stop(){
      running=false; token++; drawFrame(0);
    }

    function destroy(){
      stop(); loaded=false; hero=null;
      imgs.forEach(im=>{try{im.src=""}catch(e){}}); imgs=[];
      ctx.clearRect(0,0,canvas.width,canvas.height); current=-1;
    }

    document.addEventListener('visibilitychange',()=>{
      if(document.hidden && running){ token++; drawFrame(0); }
      else if(!document.hidden && running){ token++; loop(token); }
    });

    return {load,start,stop,destroy,get isLoaded(){return loaded;}};
  }

  global.createCanvasSequencePlayer=createCanvasSequencePlayer;
})(window);
