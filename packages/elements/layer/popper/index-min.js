/* eslint-disable */
/**
 * This file was copied from https://github.com/Blasz/popper.js/tree/v1.0.9 which contains a patch
 * to 1.0.8 containing a fix to stop repainting before popper flipping.
 * License below.
 */
(function(c,d){'object'==typeof exports&&'undefined'!=typeof module?module.exports=d():'function'==typeof define&&define.amd?define(d):c.Popper=d()})(this,function(){'use strict';function c(la){const ma=la.offsetParent,na=ma&&ma.nodeName;return na&&'BODY'!==na&&'HTML'!==na?ma:window.document.documentElement}function d(la,ma){if(1!==la.nodeType)return[];const na=window.getComputedStyle(la,null);return ma?na[ma]:na}function e(la){return'HTML'===la.nodeName?la:la.parentNode||la.host}function f(la){if(!la||-1!==['HTML','BODY','#document'].indexOf(la.nodeName))return window.document.body;const{overflow:ma,overflowX:na,overflowY:oa}=d(la);return /(auto|scroll)/.test(ma+oa+na)?la:f(e(la))}function g(la){const ma=la.nodeName;return'BODY'===ma||'HTML'===ma?!1:'fixed'===d(la,'position')||g(e(la))}function h(la){const ma=c(la),na=g(ma);return na?'fixed':'absolute'}function j(la,ma){const na='x'===ma?'Left':'Top',oa='Left'==na?'Right':'Bottom';return+la[`border${na}Width`].split('px')[0]+ +la[`border${oa}Width`].split('px')[0]}function k(la){const ma=-1!==navigator.appVersion.indexOf('MSIE 10');let na;if(ma)try{na=la.getBoundingClientRect()}catch(ra){na={}}else na=la.getBoundingClientRect();const oa={left:na.left,top:na.top,right:na.right,bottom:na.bottom,width:na.right-na.left,height:na.bottom-na.top};if('HTML'===la.nodeName&&ma){const{scrollTop:ra,scrollLeft:sa}=window.document.documentElement;oa.top-=ra,oa.bottom-=ra,oa.left-=sa,oa.right-=sa}let pa=na.width-(la.clientWidth||na.right-na.left),qa=na.height-(la.clientHeight||na.bottom-na.top);if(pa||qa){const ra=d(la);pa-=j(ra,'x'),qa-=j(ra,'y')}return oa.right-=pa,oa.width-=pa,oa.bottom-=qa,oa.height-=qa,oa}function l(la,ma='top'){const na='top'===ma?'scrollTop':'scrollLeft',oa=la.nodeName;if('BODY'===oa||'HTML'===oa){const pa=window.document.documentElement,qa=window.document.scrollingElement||pa;return qa[na]}return la[na]}function m(la,ma,na=!1){const oa=l(ma,'top'),pa=l(ma,'left'),qa=na?-1:1;return la.top+=oa*qa,la.bottom+=oa*qa,la.left+=pa*qa,la.right+=pa*qa,la}function o(la,ma,na=!1,oa=!1){const pa=f(ma),qa=k(la),ra=k(ma);let sa={top:qa.top-ra.top,left:qa.left-ra.left,bottom:qa.top-ra.top+qa.height,right:qa.left-ra.left+qa.width,width:qa.width,height:qa.height};na&&!oa?sa=m(sa,pa,!0):c(la).contains(pa)&&'BODY'!==pa.nodeName&&(sa=m(sa,ma));const ta=d(ma),ua=+ta.borderTopWidth.split('px')[0],va=+ta.borderLeftWidth.split('px')[0];return sa.top-=ua,sa.bottom-=ua,sa.left-=va,sa.right-=va,sa}function p(){const la=window.document.body,ma=window.document.documentElement;return{height:Math.max(la.scrollHeight,la.offsetHeight,ma.clientHeight,ma.scrollHeight,ma.offsetHeight),width:Math.max(la.scrollWidth,la.offsetWidth,ma.clientWidth,ma.scrollWidth,ma.offsetWidth)}}function q(la){let ma;if('HTML'===la.nodeName){const{width:na,height:oa}=p();ma={width:na,height:oa,left:0,top:0}}else ma={width:la.offsetWidth,height:la.offsetHeight,left:la.offsetLeft,top:la.offsetTop};return ma.right=ma.left+ma.width,ma.bottom=ma.top+ma.height,ma}function r(la){const ma=q(la);if('HTML'!==la.nodeName){const na=c(la),oa=r(na),pa={width:ma.offsetWidth,height:ma.offsetHeight,left:ma.left+oa.left,top:ma.top+oa.top,right:ma.right-oa.right,bottom:ma.bottom-oa.bottom};return pa}return ma}function s(la,ma='top'){const na=f(la),oa=l(na,ma);return-1===['BODY','HTML'].indexOf(na.nodeName)?oa+s(e(na),ma):oa}function t(la,ma,na){let oa={top:0,left:0};const pa=c(la);if('viewport'===na){const{left:qa,top:ra}=r(pa),{clientWidth:sa,clientHeight:ta}=window.document.documentElement;if('fixed'===h(la))oa.right=sa,oa.bottom=ta;else{const ua=s(la,'left'),va=s(la,'top');oa={top:0-ra,right:sa-qa+ua,bottom:ta-ra+va,left:0-qa}}}else{let qa;if(qa='scrollParent'===na?f(e(la)):'window'===na?window.document.body:na,'BODY'===qa.nodeName){const{height:ra,width:sa}=p();oa.right=sa,oa.bottom=ra}else oa=o(qa,pa,g(la))}return oa.left+=ma,oa.top+=ma,oa.right-=ma,oa.bottom-=ma,oa}function u(la,ma,na){if(-1===la.indexOf('auto'))return la;const oa=t(na,0,'scrollParent'),pa={top:ma.top-oa.top,right:oa.right-ma.right,bottom:oa.bottom-ma.bottom,left:ma.left-oa.left},qa=Object.keys(pa).sort((sa,ta)=>pa[ta]-pa[sa])[0],ra=la.split('-')[1];return qa+(ra?`-${ra}`:'')}function z(la,ma){return Array.prototype.find?la.find(ma):la.filter(ma)[0]}function A(la,ma,na){if(Array.prototype.findIndex)return la.findIndex((pa)=>pa[ma]===na);const oa=z(la,(pa)=>pa[ma]===na);return la.indexOf(oa)}function B(la){return ga({},la,{right:la.left+la.width,bottom:la.top+la.height})}function C(la){const ma=window.getComputedStyle(la),na=parseFloat(ma.marginTop)+parseFloat(ma.marginBottom),oa=parseFloat(ma.marginLeft)+parseFloat(ma.marginRight),pa={width:la.offsetWidth+oa,height:la.offsetHeight+na};return pa}function D(la){const ma={left:'right',right:'left',bottom:'top',top:'bottom'};return la.replace(/left|right|bottom|top/g,(na)=>ma[na])}function E(la,ma,na,oa){oa=oa.split('-')[0];const pa=C(ma),qa={position:la,width:pa.width,height:pa.height},ra=-1!==['right','left'].indexOf(oa),sa=ra?'top':'left',ta=ra?'left':'top',ua=ra?'height':'width',va=ra?'width':'height';return qa[sa]=na[sa]+na[ua]/2-pa[ua]/2,qa[ta]=oa===ta?na[ta]-pa[va]:na[D(ta)],qa}function F(la,ma,na){const oa='fixed'===la.position,pa=la.isParentTransformed,qa=c(oa&&pa?na:ma);return o(na,qa,oa,pa)}function G(la){const ma=[!1,'ms','webkit','moz','o'],na=la.charAt(0).toUpperCase()+la.slice(1);for(let oa=0;oa<ma.length-1;oa++){const pa=ma[oa],qa=pa?`${pa}${na}`:la;if('undefined'!=typeof window.document.body.style[qa])return qa}return null}function H(la){return la&&'[object Function]'==={}.toString.call(la)}function I(la,ma){return la.some(({name:na,enabled:oa})=>oa&&na===ma)}function J(la,ma,na){const oa=z(la,({name:pa})=>pa===ma);return!!oa&&la.some((pa)=>{return pa.name===na&&pa.enabled&&pa.order<oa.order})}function K(la){return''!==la&&!isNaN(parseFloat(la))&&isFinite(la)}function L(la){return'BODY'!==la.nodeName&&('none'!==d(la,'transform')||(e(la)?L(e(la)):la))}function M(la,ma){return window.removeEventListener('resize',ma.updateBound),ma.scrollParents.forEach((na)=>{na.removeEventListener('scroll',ma.updateBound)}),ma.updateBound=null,ma.scrollParents=[],ma.scrollElement=null,ma.eventsEnabled=!1,ma}function N(la,ma,na){const oa=void 0===na?la:la.slice(0,A(la,'name',na));return oa.forEach((pa)=>{pa.enabled&&H(pa.function)&&(ma=pa.function(ma,pa))}),ma}function O(la,ma){Object.keys(ma).forEach(function(na){const oa=ma[na];!1===oa?la.removeAttribute(na):la.setAttribute(na,ma[na])})}function P(la,ma){Object.keys(ma).forEach((na)=>{let oa='';-1!==['width','height','top','right','bottom','left'].indexOf(na)&&K(ma[na])&&(oa='px'),la.style[na]=ma[na]+oa})}function Q(la,ma,na,oa){const pa='BODY'===la.nodeName,qa=pa?window:la;qa.addEventListener(ma,na,{passive:!0}),pa||Q(f(qa.parentNode),ma,na,oa),oa.push(qa)}function R(la,ma,na,oa){na.updateBound=oa,window.addEventListener('resize',na.updateBound,{passive:!0});const pa=f(la);return Q(pa,'scroll',na.updateBound,na.scrollParents),na.scrollElement=pa,na.eventsEnabled=!0,na}function V(la){return'end'===la?'start':'start'===la?'end':la}const ba='undefined'!=typeof window&&'undefined'!=typeof window.document,ca=['Edge','Trident','Firefox'];let da=0;for(let la=0;la<ca.length;la+=1)if(ba&&0<=navigator.userAgent.indexOf(ca[la])){da=1;break}const ea=ba&&window.Promise;var fa=ea?function(la){let ma=!1;return()=>{ma||(ma=!0,Promise.resolve().then(()=>{ma=!1,la()}))}}:function(la){let ma=!1;return()=>{ma||(ma=!0,setTimeout(()=>{ma=!1,la()},da))}},ga=Object.assign||function(la){for(var na,ma=1;ma<arguments.length;ma++)for(var oa in na=arguments[ma],na)Object.prototype.hasOwnProperty.call(na,oa)&&(la[oa]=na[oa]);return la};class ka{constructor(la,ma,na={}){this.scheduleUpdate=()=>requestAnimationFrame(this.update),this.update=fa(this.update.bind(this)),this.options=ga({},ka.Defaults,na),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=la.jquery?la[0]:la,this.popper=ma.jquery?ma[0]:ma,this.modifiers=Object.keys(ka.Defaults.modifiers).map((pa)=>ga({name:pa},ka.Defaults.modifiers[pa])),this.modifiers=this.modifiers.map((pa)=>{const qa=na.modifiers&&na.modifiers[pa.name]||{};return ga({},pa,qa)}),na.modifiers&&(this.options.modifiers=ga({},ka.Defaults.modifiers,na.modifiers),Object.keys(na.modifiers).forEach((pa)=>{if(void 0===ka.Defaults.modifiers[pa]){const qa=na.modifiers[pa];qa.name=pa,this.modifiers.push(qa)}})),this.state.position=h(this.reference),this.modifiers=this.modifiers.sort((pa,qa)=>pa.order-qa.order),this.modifiers.forEach((pa)=>{pa.enabled&&H(pa.onLoad)&&pa.onLoad(this.reference,this.popper,this.options,pa,this.state)}),this.state.isParentTransformed=L(this.popper.parentNode),this.update();const oa=this.options.eventsEnabled;oa&&this.enableEventListeners(),this.state.eventsEnabled=oa}update(){if(!this.state.isDestroyed){let la={instance:this,styles:{},attributes:{},flipped:!1,offsets:{}};this.state.position=h(this.reference),P(this.popper,{position:this.state.position}),la.offsets.reference=F(this.state,this.popper,this.reference),la.placement=u(this.options.placement,la.offsets.reference,this.popper),la.originalPlacement=this.options.placement,la.offsets.popper=E(this.state,this.popper,la.offsets.reference,la.placement),la=N(this.modifiers,la),this.state.isCreated?this.options.onUpdate(la):(this.state.isCreated=!0,this.options.onCreate(la))}}destroy(){return this.state.isDestroyed=!0,I(this.modifiers,'applyStyle')&&(this.popper.removeAttribute('x-placement'),this.popper.style.left='',this.popper.style.position='',this.popper.style.top='',this.popper.style[G('transform')]=''),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}enableEventListeners(){this.state.eventsEnabled||(this.state=R(this.reference,this.options,this.state,this.scheduleUpdate))}disableEventListeners(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=M(this.reference,this.state))}}return ka.Utils={computeAutoPlacement:u,debounce:fa,findIndex:A,getBordersSize:j,getBoundaries:t,getBoundingClientRect:k,getClientRect:B,getOffsetParent:c,getOffsetRect:q,getOffsetRectRelativeToCustomParent:o,getOuterSizes:C,getParentNode:e,getPopperOffsets:E,getPosition:h,getReferenceOffsets:F,getScroll:l,getScrollParent:f,getStyleComputedProperty:d,getSupportedPropertyName:G,getTotalScroll:s,getWindowSizes:p,includeScroll:m,isFixed:g,isFunction:H,isModifierEnabled:I,isModifierRequired:J,isNumeric:K,isTransformed:L,removeEventListeners:M,runModifiers:N,setAttributes:O,setStyles:P,setupEventListeners:R},ka.placements=['auto','auto-start','auto-end','top','top-start','top-end','right','right-start','right-end','bottom','bottom-start','bottom-end','left','left-start','left-end'],ka.Defaults={placement:'bottom',eventsEnabled:!0,onCreate:()=>{},onUpdate:()=>{},modifiers:{shift:{order:100,enabled:!0,function:function(la){const ma=la.placement,na=ma.split('-')[0],oa=ma.split('-')[1];if(oa){const pa=la.offsets.reference,qa=B(la.offsets.popper),ra=-1!==['bottom','top'].indexOf(na),sa=ra?'left':'top',ta=ra?'width':'height',ua={start:{[sa]:pa[sa]},end:{[sa]:pa[sa]+pa[ta]-qa[ta]}};la.offsets.popper=ga({},qa,ua[oa])}return la}},offset:{order:200,enabled:!0,function:function(la,ma){const na=la.placement,oa=la.offsets.popper;let pa;return K(ma.offset)?pa=[ma.offset,0]:(pa=ma.offset.split(' '),pa=pa.map((qa,ra)=>{const sa=qa.match(/(\d*\.?\d*)(.*)/),ta=+sa[1],ua=sa[2];let va=-1!==na.indexOf('right')||-1!==na.indexOf('left');1===ra&&(va=!va);const wa=va?'height':'width';if(0===ua.indexOf('%')){let xa;switch(ua){case'%p':xa=la.offsets.popper;break;case'%':case'$r':default:xa=la.offsets.reference;}const ya=B(xa),za=ya[wa];return za/100*ta}if('vh'===ua||'vw'===ua){let xa;return xa='vh'===ua?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0),xa/100*ta}return'px'===ua?+ta:+qa})),-1===la.placement.indexOf('left')?-1===la.placement.indexOf('right')?-1===la.placement.indexOf('top')?-1!==la.placement.indexOf('bottom')&&(oa.left+=pa[0],oa.top+=pa[1]||0):(oa.left+=pa[0],oa.top-=pa[1]||0):(oa.top+=pa[0],oa.left+=pa[1]||0):(oa.top+=pa[0],oa.left-=pa[1]||0),la},offset:0},preventOverflow:{order:300,enabled:!0,function:function(la,ma){const na=ma.boundariesElement||c(la.instance.popper),oa=t(la.instance.popper,ma.padding,na);ma.boundaries=oa;const pa=ma.priority;let qa=B(la.offsets.popper);const ra={primary(sa){let ta=qa[sa];return qa[sa]<oa[sa]&&!ma.escapeWithReference&&(ta=Math.max(qa[sa],oa[sa])),{[sa]:ta}},secondary(sa){const ta='right'===sa?'left':'top';let ua=qa[ta];return qa[sa]>oa[sa]&&!ma.escapeWithReference&&(ua=Math.min(qa[ta],oa[sa]-('right'===sa?qa.width:qa.height))),{[ta]:ua}}};return pa.forEach((sa)=>{const ta=-1===['left','top'].indexOf(sa)?'secondary':'primary';qa=ga({},qa,ra[ta](sa))}),la.offsets.popper=qa,la},priority:['left','right','top','bottom'],padding:5,boundariesElement:'scrollParent'},keepTogether:{order:400,enabled:!0,function:function(la){const ma=B(la.offsets.popper),na=la.offsets.reference,oa=la.placement.split('-')[0],pa=Math.floor,qa=-1!==['top','bottom'].indexOf(oa),ra=qa?'right':'bottom',sa=qa?'left':'top',ta=qa?'width':'height';return ma[ra]<pa(na[sa])&&(la.offsets.popper[sa]=pa(na[sa])-ma[ta]),ma[sa]>pa(na[ra])&&(la.offsets.popper[sa]=pa(na[ra])),la}},arrow:{order:500,enabled:!0,function:function(la,ma){if(!J(la.instance.modifiers,'arrow','keepTogether'))return console.warn('WARNING: `keepTogether` modifier is required by arrow modifier in order to work, be sure to include it before `arrow`!'),la;let na=ma.element;if('string'==typeof na){if(na=la.instance.popper.querySelector(na),!na)return la;}else if(!la.instance.popper.contains(na))return console.warn('WARNING: `arrow.element` must be child of its popper element!'),la;const oa=la.placement.split('-')[0],pa=B(la.offsets.popper),qa=la.offsets.reference,ra=-1!==['left','right'].indexOf(oa),sa=ra?'height':'width',ta=ra?'top':'left',ua=ra?'left':'top',va=ra?'bottom':'right',wa=C(na)[sa];qa[va]-wa<pa[ta]&&(la.offsets.popper[ta]-=pa[ta]-(qa[va]-wa)),qa[ta]+wa>pa[va]&&(la.offsets.popper[ta]+=qa[ta]+wa-pa[va]);const xa=qa[ta]+qa[sa]/2-wa/2;let ya=xa-B(la.offsets.popper)[ta];return ya=Math.max(Math.min(pa[sa]-wa,ya),0),la.arrowElement=na,la.offsets.arrow={},la.offsets.arrow[ta]=ya,la.offsets.arrow[ua]='',la},element:'[x-arrow]'},flip:{order:600,enabled:!0,function:function(la,ma){if(I(la.instance.modifiers,'inner'))return la;if(la.flipped&&la.placement===la.originalPlacement)return la;const na=t(la.instance.popper,ma.padding,ma.boundariesElement);let oa=la.placement.split('-')[0],pa=D(oa),qa=la.placement.split('-')[1]||'',ra=[];return ra='flip'===ma.behavior?[oa,pa]:ma.behavior,ra.forEach((sa,ta)=>{if(oa!==sa||ra.length===ta+1)return la;oa=la.placement.split('-')[0],pa=D(oa);const ua=B(la.offsets.popper),va=la.offsets.reference,wa=Math.floor,xa='left'===oa&&wa(ua.right)>wa(va.left)||'right'===oa&&wa(ua.left)<wa(va.right)||'top'===oa&&wa(ua.bottom)>wa(va.top)||'bottom'===oa&&wa(ua.top)<wa(va.bottom),ya=wa(ua.left)<wa(na.left),za=wa(ua.right)>wa(na.right),Aa=wa(ua.top)<wa(na.top),Ba=wa(ua.bottom)>wa(na.bottom),Ca='left'===oa&&ya||'right'===oa&&za||'top'===oa&&Aa||'bottom'===oa&&Ba,Da=-1!==['top','bottom'].indexOf(oa),Ea=!!ma.flipVariations&&(Da&&'start'===qa&&ya||Da&&'end'===qa&&za||!Da&&'start'===qa&&Aa||!Da&&'end'===qa&&Ba);(xa||Ca||Ea)&&(la.flipped=!0,(xa||Ca)&&(oa=ra[ta+1]),Ea&&(qa=V(qa)),la.placement=oa+(qa?'-'+qa:''),la.offsets.popper=E(la.instance.state.position,la.instance.popper,la.offsets.reference,la.placement),la=N(la.instance.modifiers,la,'flip'))}),la},behavior:'flip',padding:5,boundariesElement:'viewport'},inner:{order:700,enabled:!1,function:function(la){const ma=la.placement,na=ma.split('-')[0],oa=B(la.offsets.popper),pa=B(la.offsets.reference),qa=-1!==['left','right'].indexOf(na),ra=-1===['top','left'].indexOf(na);return oa[qa?'left':'top']=pa[ma]-(ra?oa[qa?'width':'height']:0),la.placement=D(ma),la.offsets.popper=B(oa),la}},hide:{order:800,enabled:!0,function:function(la){if(!J(la.instance.modifiers,'hide','preventOverflow'))return console.warn('WARNING: preventOverflow modifier is required by hide modifier in order to work, be sure to include it before hide!'),la;const ma=la.offsets.reference,na=z(la.instance.modifiers,(oa)=>'preventOverflow'===oa.name).boundaries;if(ma.bottom<na.top||ma.left>na.right||ma.top>na.bottom||ma.right<na.left){if(!0===la.hide)return la;la.hide=!0,la.attributes['x-out-of-boundaries']=''}else{if(!1===la.hide)return la;la.hide=!1,la.attributes['x-out-of-boundaries']=!1}return la}},applyStyle:{order:900,enabled:!0,gpuAcceleration:!0,function:function(la,ma){const na={position:la.offsets.popper.position},oa={'x-placement':la.placement},pa=Math.round(la.offsets.popper.left),qa=Math.round(la.offsets.popper.top),ra=G('transform');return ma.gpuAcceleration&&ra?(na[ra]='translate3d('+pa+'px, '+qa+'px, 0)',na.top=0,na.left=0,na.willChange='transform'):(na.left=pa,na.top=qa,na.willChange='top, left'),P(la.instance.popper,ga({},na,la.styles)),O(la.instance.popper,ga({},oa,la.attributes)),la.offsets.arrow&&P(la.arrowElement,la.offsets.arrow),la},onLoad:function(la,ma,na,oa,pa){const qa=F(pa,ma,la);return na.placement=u(na.placement,qa,ma),ma.setAttribute('x-placement',na.placement),na}}}},ka});

//# sourceMappingURL=popper.min.js.map