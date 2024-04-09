!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsMobileUi=t(e.videojs)}(this,function(e){"use strict";var t=e&&"object"==typeof e&&"default"in e?e:{default:e};let i=t.default.getComponent("Component"),n=t.default.dom||t.default;i.registerComponent("TouchOverlay",class extends i{constructor(e,i){super(e,i),this.seekSeconds=i.seekSeconds,this.tapTimeout=i.tapTimeout,this.taps=0,this.addChild("playToggle",{}),e.on(["playing","userinactive"],e=>{this.removeClass("show-play-toggle")}),0===this.player_.options_.inactivityTimeout&&(this.player_.options_.inactivityTimeout=5e3),this.handleTaps_=t.default.fn.debounce(e=>{let t=(this.taps-1)*this.seekSeconds;if(this.taps=0,t<1)return;let i=this.el_.getBoundingClientRect(),n=e.changedTouches[0].clientX-i.left;if(n<.4*i.width)this.player_.currentTime(Math.max(0,this.player_.currentTime()-t)),this.addClass("reverse");else{if(!(n>i.width-.4*i.width))return;this.player_.currentTime(Math.min(this.player_.duration(),this.player_.currentTime()+t)),this.removeClass("reverse")}this.removeClass("show-play-toggle"),this.setAttribute("data-skip-text",`${t} ${this.localize("seconds")}`),this.removeClass("skip"),window.requestAnimationFrame(()=>{this.addClass("skip")})},this.tapTimeout),this.enable()}createEl(){return n.createEl("div",{className:"vjs-touch-overlay",tabIndex:-1})}handleTap(e){e.target===this.el_&&(e.preventDefault(),this.taps+=1,1===this.taps&&(this.removeClass("skip"),this.toggleClass("show-play-toggle")),this.handleTaps_(e))}enable(){this.firstTapCaptured=!1,this.on("touchend",this.handleTap)}disable(){this.off("touchend",this.handleTap)}});let o={fullscreen:{enterOnRotate:!0,exitOnRotate:!0,lockOnRotate:!0,lockToLandscapeOnEnter:!1,disabled:!1},touchControls:{seekSeconds:10,tapTimeout:300,disableOnEnd:!1,disabled:!1}},s=window.screen,l=()=>{if(s){let e=((s.orientation||{}).type||s.mozOrientation||s.msOrientation||"").split("-")[0];if("landscape"===e||"portrait"===e)return e}return"number"==typeof window.orientation?0===window.orientation||180===window.orientation?"portrait":"landscape":"portrait"},a=function(e={}){(e.forceForTesting||t.default.browser.IS_ANDROID||t.default.browser.IS_IOS)&&this.ready(()=>{((e,i)=>{if(e.addClass("vjs-mobile-ui"),!i.touchControls.disabled){(i.touchControls.disableOnEnd||"function"==typeof e.endscreen)&&e.addClass("vjs-mobile-ui-disable-end");let n=e.children_.indexOf(e.getChild("ControlBar"));e.touchOverlay=e.addChild("TouchOverlay",i.touchControls,n)}if(i.fullscreen.disabled)return;let o=!1,a=()=>{let n=l();"landscape"===n&&i.fullscreen.enterOnRotate?!1===e.paused()&&(e.requestFullscreen(),(i.fullscreen.lockOnRotate||i.fullscreen.lockToLandscapeOnEnter)&&s.orientation&&s.orientation.lock&&s.orientation.lock("landscape").then(()=>{o=!0}).catch(e=>{t.default.log("Browser refused orientation lock:",e)})):"portrait"===n&&i.fullscreen.exitOnRotate&&!o&&e.isFullscreen()&&e.exitFullscreen()};(i.fullscreen.enterOnRotate||i.fullscreen.exitOnRotate)&&(t.default.browser.IS_IOS?(window.addEventListener("orientationchange",a),e.on("dispose",()=>{window.removeEventListener("orientationchange",a)})):s.orientation&&(s.orientation.onchange=a,e.on("dispose",()=>{s.orientation.onchange=null}))),e.on("fullscreenchange",n=>{e.isFullscreen()&&i.fullscreen.lockToLandscapeOnEnter&&"portrait"===l()?s.orientation.lock("landscape").then(()=>{o=!0}).catch(e=>{t.default.log("Browser refused orientation lock:",e)}):!e.isFullscreen()&&o&&(s.orientation.unlock(),o=!1)}),e.on("ended",e=>{!0===o&&(s.orientation.unlock(),o=!1)})})(this,t.default.obj.merge(o,e))})};return t.default.registerPlugin("mobileUi",a),a.VERSION="1.1.1",a}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsHlsQualitySelector=t(e.videojs)}(this,function(e){"use strict";let t=e.getComponent("MenuButton"),i=e.getComponent("Menu"),n=e.getComponent("Component"),o=e.dom;class s extends t{constructor(e){super(e,{title:e.localize("Quality"),name:"QualityButton"})}createItems(){return[]}createMenu(){let e=new i(this.player_,{menuButton:this});if(this.hideThreshold_=0,this.options_.title){var t;let s=o.createEl("li",{className:"vjs-menu-title",innerHTML:"string"!=typeof(t=this.options_.title)?t:t.charAt(0).toUpperCase()+t.slice(1),tabIndex:-1}),l=new n(this.player_,{el:s});this.hideThreshold_+=1,e.addItem(l)}if(this.items=this.createItems(),this.items)for(let a=0;a<this.items.length;a++)e.addItem(this.items[a]);return e}}let l=e.getComponent("MenuItem");class a extends l{constructor(e,t,i,n){super(e,{label:t.label,selectable:!0,selected:t.selected||!1}),this.item=t,this.qualityButton=i,this.plugin=n}handleClick(){for(let e=0;e<this.qualityButton.items.length;++e)this.qualityButton.items[e].selected(!1);this.plugin.setQuality(this.item.value),this.selected(!0)}}let r={},d=e.registerPlugin||e.plugin;class u{constructor(e,t){this.player=e,this.config=t,this.player.qualityLevels&&this.getHls()&&(this.createQualityButton(),this.bindPlayerEvents())}getHls(){return this.player.tech({IWillNotUseThisInPlugins:!0}).vhs}bindPlayerEvents(){this.player.qualityLevels().on("addqualitylevel",this.onAddQualityLevel.bind(this,this.config.sortAscending,this.config.autoPlacement))}createQualityButton(){let e=this.player;this._qualityButton=new s(e);let t=e.controlBar.children().length-2,i=e.controlBar.addChild(this._qualityButton,{componentClass:"qualitySelector"},this.config.placementIndex||t);if(i.addClass("vjs-hls-quality-selector"),this.config.displayCurrentQuality)this.setButtonInnerText("auto");else{let n=` ${this.config.vjsIconClass||"vjs-icon-hd"}`;i.menuButton_.$(".vjs-icon-placeholder").className+=n}i.removeClass("vjs-hidden")}setButtonInnerText(e){this._qualityButton.menuButton_.$(".vjs-icon-placeholder").innerHTML=e}getQualityMenuItem(e){return new a(this.player,e,this._qualityButton,this)}onAddQualityLevel(e=!0,t="bottom"){let i=this.player,n=i.qualityLevels().levels_||[],o=[],s=this.getQualityMenuItem.call(this,{label:i.localize("Auto"),value:"auto",selected:!0});for(let l=0;l<n.length;++l)if(n[l].height&&!o.filter(e=>e.item&&e.item.value===n[l].height).length){let a=this.getQualityMenuItem.call(this,{label:n[l].height+"p",value:n[l].height});o.push(a)}e?o.sort((e,t)=>"object"!=typeof e||"object"!=typeof t?-1:e.item.value-t.item.value):o.sort((e,t)=>"object"!=typeof e||"object"!=typeof t?-1:t.item.value-e.item.value),this._qualityButton&&(this._qualityButton.createItems=function(){return"top"===t?[s,...o]:[...o,s]},this._qualityButton.update())}setQuality(e){let t=this.player.qualityLevels();this._currentQuality=e,this.config.displayCurrentQuality&&this.setButtonInnerText("auto"===e?e:`${e}p`);for(let i=0;i<t.length;++i){let n=t[i];n.enabled=n.height===e||"auto"===e}this._qualityButton.unpressButton()}getCurrentQuality(){return this._currentQuality||"auto"}}let h=(e,t)=>{e.addClass("vjs-hls-quality-selector"),e.hlsQualitySelector=new u(e,t)},c=function(t){this.ready(()=>{h(this,e.obj.merge(r,t))})};return d("hlsQualitySelector",c),c.VERSION="1.1.6",c}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsLogo=t(e.videojs)}(this,function(e){"use strict";var t=e&&"object"==typeof e&&"default"in e?e:{default:e};let i=t.default.getPlugin("plugin");class n extends i{constructor(e,i){super(e),this.tid=null,this.div=null,this.options=t.default.obj.merge({image:void 0,url:void 0,position:"top-right",offsetH:0,offsetV:0,width:void 0,height:void 0,padding:5,fadeDelay:5e3,hideOnReady:!1,opacity:1},i),this.player.ready(()=>this._onPlayerReady())}_onPlayerReady(){this.player.addClass("vjs-logo"),this.options.image&&(this._setup(),this.options.hideOnReady||this.show())}_setup(){let e=this.player.el(),t=document.createElement("div");t.classList.add("vjs-logo-content"),t.classList.add("vjs-logo-hide"),t.style.padding=this.options.padding+"px";let{offsetH:i,offsetV:n}=this.options;switch(this.options.position){case"top-left":t.style.top=n+"px",t.style.left=i+"px";break;case"top-right":default:t.style.top=n+"px",t.style.right=i+"px";break;case"bottom-left":t.style.bottom=n+"px",t.style.left=i+"px";break;case"bottom-right":t.style.bottom=n+"px",t.style.right=i+"px"}this.div=t;let o=document.createElement("img");o.src=this.options.image;let{width:s,height:l,opacity:a}=this.options;if(s&&(o.width=s),l&&(o.height=l),a&&(o.style.opacity=a),this.options.url){let r=document.createElement("a");r.href=this.options.url,r.onclick=e=>{e.preventDefault(),window.open(this.options.url)},r.appendChild(o),t.appendChild(r)}else t.appendChild(o);e.appendChild(t)}show(){this.tid&&(clearTimeout(this.tid),this.tid=null),this.div&&this.div.classList.remove("vjs-logo-hide"),null!==this.options.fadeDelay&&(this.tid=setTimeout(()=>{this.hide(),this.tid=null},this.options.fadeDelay))}hide(){this.div&&this.div.classList.add("vjs-logo-hide")}}return n.defaultState={},n.VERSION="3.0.0",t.default.registerPlugin("logo",n),n}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsPosterTime=t(e.videojs)}(this,function(e){"use strict";var t=e&&"object"==typeof e&&"default"in e?e:{default:e},i={},n=function(e){var n=this;this.ready(function(){!function(e,i){e.addClass("vjs-poster-time");var n=e.durDisplay=e.getChild("PosterImage").addChild("Component");n.addClass("vjs-poster-duration");var o=function(){var o;if(!isNaN(e.duration())&&e.duration()>0)o=e.duration();else if(e.mediainfo&&e.mediainfo.duration)o=e.mediainfo.duration;else if(i.duration)o=i.duration;else{if(!e.options()["data-duration"])return void n.hide();o=e.options()["data-duration"]}isFinite(o)&&o>0?n.el_.textContent=t.default.time.formatTime(o,1e3):n.el_.textContent=e.localize("LIVE"),n.show()};e.on(["loadstart","loadedmetadata","durationchange"],o),o()}(n,t.default.obj.merge(i,e))})};return t.default.registerPlugin("posterTime",n),n.VERSION="1.0.0",n}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsContextmenuUi=t(e.videojs)}(this,function(e){"use strict";var t=e&&"object"==typeof e&&"default"in e?e:{default:e};let i=t.default.getComponent("MenuItem");class n extends i{handleClick(e){super.handleClick(),this.options_.listener(),window.setTimeout(()=>{this.player().contextmenuUI.menu.dispose()},1)}}let o=t.default.getComponent("Menu"),s=t.default.dom||t.default;class l extends o{constructor(e,t){super(e,t),this.dispose=this.dispose.bind(this),t.content.forEach(t=>{let i=function(){};"function"==typeof t.listener?i=t.listener:"string"==typeof t.href&&(i=()=>window.open(t.href)),this.addItem(new n(e,{label:t.label,listener:i.bind(e)}))})}createEl(){let e=super.createEl();return s.addClass(e,"vjs-contextmenu-ui-menu"),e.style.left=this.options_.position.left+"px",e.style.top=this.options_.position.top+"px",e}}var a="7.0.0";function r(e){return e.hasOwnProperty("contextmenuUI")&&e.contextmenuUI.hasOwnProperty("menu")&&e.contextmenuUI.menu.el()}function d(e){let t=e.tagName.toLowerCase();return"input"===t||"textarea"===t}function u(e){var i,n,o,s;if(r(this))return void this.contextmenuUI.menu.dispose();if(this.contextmenuUI.options_.excludeElements(e.target))return;let a,d,u,h,c,p,f,y,m=(i=(o=this.el(),s=e,a={},d=function(e){let t;if(e.getBoundingClientRect&&e.parentNode&&(t=e.getBoundingClientRect()),!t)return{left:0,top:0};let i=document.documentElement,n=document.body,o=i.clientLeft||n.clientLeft||0,s=window.pageXOffset||n.scrollLeft,l=t.left+s-o,a=i.clientTop||n.clientTop||0,r=window.pageYOffset||n.scrollTop;return{left:Math.round(l),top:Math.round(t.top+r-a)}}(o),u=o.offsetWidth,h=o.offsetHeight,c=d.top,p=d.left,f=s.pageY,y=s.pageX,s.changedTouches&&(y=s.changedTouches[0].pageX,f=s.changedTouches[0].pageY),a.y=Math.max(0,Math.min(1,(c-f+h)/h)),a.x=Math.max(0,Math.min(1,(y-p)/u)),a),{left:Math.round((n=this.el().getBoundingClientRect()).width*i.x),top:Math.round(n.height-n.height*i.y)}),g=t.default.browser.IS_FIREFOX?document.documentElement:document;e.preventDefault();let v=this.contextmenuUI.menu=new l(this,{content:this.contextmenuUI.content,position:m});this.contextmenuUI.closeMenu=()=>{t.default.log.warn("player.contextmenuUI.closeMenu() is deprecated, please use player.contextmenuUI.menu.dispose() instead!"),v.dispose()},v.on("dispose",()=>{t.default.off(g,["click","tap"],v.dispose),this.removeChild(v),delete this.contextmenuUI.menu}),this.addChild(v);let x=v.el_.getBoundingClientRect(),C=document.body.getBoundingClientRect();(this.contextmenuUI.keepInside||x.right>C.width||x.bottom>C.height)&&(v.el_.style.left=Math.floor(Math.min(m.left,this.player_.currentWidth()-v.currentWidth()))+"px",v.el_.style.top=Math.floor(Math.min(m.top,this.player_.currentHeight()-v.currentHeight()))+"px"),t.default.on(g,["click","tap"],v.dispose)}function h(e){if(!Array.isArray((e=t.default.obj.merge({keepInside:!0,excludeElements:d},e)).content))throw Error('"content" required');r(this)&&(this.contextmenuUI.menu.dispose(),this.off("contextmenu",this.contextmenuUI.onContextMenu),delete this.contextmenuUI);let i=this.contextmenuUI=function(){h.apply(this,arguments)};i.onContextMenu=u.bind(this),i.content=e.content,i.keepInside=e.keepInside,i.options_=e,i.VERSION=a,this.on("contextmenu",i.onContextMenu),this.ready(()=>this.addClass("vjs-contextmenu-ui"))}return t.default.registerPlugin("contextmenuUI",h),h.VERSION=a,h}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsSvgLoadingSpinner=t(e.videojs)}(this,function(e){"use strict";var t=e&&"object"==typeof e&&"default"in e?e:{default:e};let i=t.default.getPlugin("plugin");class n extends i{constructor(e,i){super(e),this.tid=null,this.div=null,this.options=t.default.obj.merge({image:void 0,width:void 0,height:void 0,opacity:1},i),this.player.ready(()=>this._onPlayerReady())}_onPlayerReady(){this.options.image&&(this._setup(),this.options.hide||this.player.loadingSpinner.hide())}_setup(){let t=this.player.el(),i=e.dom.createEl("div",{className:"vjs-svg-loading-spinner",dir:"ltr"},{}),n=document.createElement("img");n.src=this.options.image;let{width:o,height:s,opacity:l}=this.options;o&&(n.width=o),s&&(n.height=s),l&&(n.style.opacity=l),i.appendChild(n),t.appendChild(i)}}return n.defaultState={},n.VERSION="1.0.0",t.default.registerPlugin("svgloadingspinner",n),n});