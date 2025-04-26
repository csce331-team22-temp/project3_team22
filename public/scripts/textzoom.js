class ZoomHandler {
  static zoomVal = 1;


  static hasVisibleText(el) {
    let cond1 = el.childNodes.length > 0 && Array.from(el.childNodes).some(node => {    
        return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '';
    });
    let nn = el.nodeName;
    let cond2 = ['INPUT', 'TEXTAREA'].find((x) => x == nn);
    return cond1 || cond2;
  }


  static increaseZoom() {
    if (this.zoomVal >= 3 || this.zoomVal <= 0.1) return;
    this.zoomVal += .1;
    this.zoomModification(this.zoomVal);
  }
  
  
  static decreaseZoom() {
    if (this.zoomVal >= 3 || this.zoomVal <= 0.1) return;
    this.zoomVal -= .1;
    this.zoomModification(this.zoomVal);
  }


  static _modifyElementFontSize(el) {
    if (!ZoomHandler.hasVisibleText(el)) return;

    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    let elementZoomVal = el.getAttribute("ZoomValue");
    if (elementZoomVal === null) elementZoomVal = 1;
    elementZoomVal = Number(elementZoomVal);
    
    if (!isNaN(fontSize)) {
      let scalar = this.zoomVal / elementZoomVal;
      let newFontSize = (Math.round(100 * fontSize * scalar) / 100) + "px";
      el.style.fontSize = newFontSize;
      const currentWidth = parseFloat(style.width);
      const currentHeight = parseFloat(style.height);
      if (el.scrollHeight > el.clientHeight || scalar < 1)
        el.style.minHeight = (Math.round(100 * currentHeight * scalar) / 100) + "px";
      
      if (el.scrollWidth > el.clientWidth || scalar < 1)
        el.style.minWidth = (Math.round(100 * currentWidth * scalar) / 100) + "px";  
    
    }


    el.setAttribute("ZoomValue", this.zoomVal);
  }
  

  static zoomModification(zoom_amt) {
    this.zoomVal = Math.round(zoom_amt * 10) / 10;
    document.getElementById("input-scalar").value = this.zoomVal;
    localStorage.setItem("zoomVal", this.zoomVal);

    const allElements = document.querySelectorAll('*');
    const excluded = document.querySelector('#text-zoom-container');
    
    Array.from(allElements).filter(el => !excluded.contains(el)).forEach(el => {
      if (ZoomHandler.hasVisibleText(el)) {
        this._modifyElementFontSize(el);
      }
    });
  }
}


function toggleZoomBox() {
  let tZoomBox = document.getElementById("text-zoom-box");
  let tZoomIcon = document.getElementById("text-zoom-minimized");
  if (tZoomBox.style.display === 'none') {
    tZoomBox.style.display = 'flex';
    tZoomIcon.style.display = 'none';
  }
  else {
    tZoomBox.style.display = 'none';
    tZoomIcon.style.display = 'flex';
  }
}


var callback = function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(el => {
        ZoomHandler._modifyElementFontSize(el);
      })
    }
  }
};


window.addEventListener("load", () => {

  const zoomContainer = document.createElement('div');
  zoomContainer.id = "text-zoom-container";
  zoomContainer.innerHTML = `
        <div id="text-zoom-box">
            <button id="text-zoom-close">Close (X)</button>
            <p>Text Font Zoom</p>
            <div id="zoom-controls">
                <button id="text-zoom-min">-</button>
                <input id="input-scalar" type="text" pattern="[0-9]{5}">
                <button id="text-zoom-max">+</button>
            </div>
        </div>
        <button id="text-zoom-minimized">&#128269</button>`;

      const styleElement = document.createElement('style');
      styleElement.textContent = `
        #text-zoom-container {
            all: unset;
            font-family : inherit;
            position: fixed;
            bottom : 50%;
            left : 0.1%;
            z-index: 100;
            width: min-content;
        }
        #text-zoom-box {
            font-family: sans-serif;
            background-color:rgb(217, 160, 108);
            color: white;
            width: 18rem;
            height: 8rem;
            padding: 1rem 0.9rem;
            border: 0.15rem solid black;
            box-shadow: 0.5rem 0.5rem 0.2rem black;
            border-radius: 0.3rem;
            display: flex;
            flex-direction: column;
            font-size: 1.3em;
            font-weight : bolder;
        }
        #text-zoom-box p {text-align: center; margin: 0;}
        #text-zoom-close {
            width: 5rem;
            height: 2.5rem;
            margin-left: auto;
            border: 0.1rem solid gray;
            background-color : #FFF8F0;
            color : #5C4033;
            font-family : sans-serif;
            font-weight : bolder;
            border-radius: 0.3rem;
            cursor: pointer;
        }
        #text-zoom-minimized {
            background-color: rgba(217, 160, 108, 0.9);
            width: fit-content;
            height: fit-content;
            padding: 0.6rem;
            border: 0.1rem solid black;
            border-radius: 0.3rem;
            font-size: large;
            box-shadow: 0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
        #input-scalar {
            width: 5ch;
            text-align: center;
            font-size: large;
            border: 0.1rem solid black;
            border-left: none; border-right: none;
            font-family: inherit;
        }
        #zoom-controls {
            margin-top: 5%;
            display: flex; 
            justify-content: center;
            width: 50%;
            height: 30%;
            align-self: center;
        }
        #zoom-controls button {
            flex: 1;
            border: 0.1rem solid black;            
            font-size: larger;
            background-color: #FFDEAD;
            color:  #4b3621;
            font-family: inherit;
            cursor: pointer;
        }`;

  
  document.head.appendChild(styleElement); 
  document.body.appendChild(zoomContainer);

  var observer = new MutationObserver(callback);
  observer.observe(document.body, {attributes: false, childList: true, subtree: true, characterData : false});

  document.getElementById("text-zoom-box").style.display = 'none';
  document.getElementById("text-zoom-minimized").style.display = 'flex';

  let zV = localStorage.getItem("zoomVal");
  if (zV === null || zV === NaN || zV === "[object Undefined]") zV = ZoomHandler.zoomVal;
  document.getElementById("input-scalar").value = Number(zV);

  ZoomHandler.zoomModification(zV);

  let inputScalarFunction = (e) => {
    let noEnterPressed = (e.type === 'keydown') && !(e.key === 'Enter');
    let closeClicked = (e.type === 'blur') && (e.relatedTarget !== null) && (e.relatedTarget.id === "text-zoom-close");
    if (noEnterPressed || closeClicked) return;
    let scale_val = Number(document.getElementById("input-scalar").value);
    if (scale_val === NaN) return;
    else if (scale_val >= 5 || scale_val <= 0.1) {
      document.getElementById("input-scalar").value = ZoomHandler.zoomVal;
      return;
    };
    ZoomHandler.zoomModification(scale_val);
  }
  document.getElementById("input-scalar").addEventListener("blur", inputScalarFunction);
  document.getElementById("input-scalar").addEventListener("keydown", inputScalarFunction);
  document.getElementById("text-zoom-close").addEventListener("click", toggleZoomBox);
  document.getElementById("text-zoom-minimized").addEventListener("click", toggleZoomBox);
  document.getElementById("text-zoom-max").addEventListener("click", () => {
    ZoomHandler.increaseZoom();
  });
  document.getElementById("text-zoom-min").addEventListener("click", () => {
    ZoomHandler.decreaseZoom();
  });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  textZoomContainer = document.getElementById("#text-zoom-container");
  let textStyle = window.getComputedStyle(textZoomContainer);

  textZoomContainer.style.top = (parseFloat(textStyle.top) + scrollY) + 'px';
});