const nodes = {
  node1: {id: 'node1', x: 100, y: 100, neighbors: ['node2', 'node3']},
  node2: {id: 'node2', x: 200, y: 100, neighbors: ['node1', 'node4']},
  node3: {id: 'node3', x: 100, y: 200, neighbors: ['node1', 'node4']},
  node4: {id: 'node4', x: 200, y: 200, neighbors: ['node2', 'node3']}
};


for (const nodeID in nodes) {
  const node = nodes[nodeID];
  const div = document.createElement('div');
  div.classList.add('node');
  div.setAttribute('id', node.id);
  div.style.left = node.x + 'px';
  div.style.top = node.y + 'px';
  document.body.appendChild(div);
}



const xx = document.querySelectorAll('.node');

// Loop through each node and add mouse event listeners
xx.forEach(node => {
    node.onmousedown = function (ev) {
        const x = pagePos(ev).X - parseInt(getStyles(node)['left']),
            y = pagePos(ev).Y - parseInt(getStyles(node)['top']);
        document.onmousemove = function (e) {
            const mPos = pagePos(e);
            node.style.left = mPos.X - x + 'px';
            node.style.top = mPos.Y - y + 'px';

        };
        document.onmouseup = function () {
            this.onmousemove = null;
            this.onmouseup = null;
        };
    };

});



// Helper function to get page position
function pagePos(ev) {
    const sTop = getScrollOffset().top,
        sLeft = getScrollOffset().left,
        cTop = document.documentElement.clientTop || 0,
        cLeft = document.documentElement.clientLeft || 0;
    return {
        X: ev.clientX + sLeft - cLeft,
        Y: ev.clientY + sTop - cTop
    };
}

// Helper function to get scroll offset
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        };
    } else {
        return {
            top: document.body.scrollTop || document.documentElement.scrollTop,
            left: document.body.scrollLeft || document.documentElement.scrollLeft
        };
    }
}

// Helper function to get element styles
function getStyles(elem) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null);
    } else {
        return elem.currentStyle;
    }
}

function createPointer(x, y) {
    var html = '<div class="pointer" style="width:2px; height:2px; position:absolute; background:black; border-radius:50%; top:'+y+'px; left:'+x+'px;" ></div>';
    document.body.innerHTML += html;
}
// ??????????????????
function createLine(aX, aY, bX, bY) {
    createPointer(aX, aY);
    createPointer(bX, bY);
    // ??????????????????
    var tX, tY;
    //
    var rX, rY;
    if (aX < bX) { // b??????a????????????
        tX = bX - aX;
        rX = 1;
    } else { // b??????a????????????
        tX = aX - bX;
        rX = -1;
    }
    if (aY < bY) { // b??????a????????????
        tY = bY - aY;
        rY = 1;
    } else {
        tY = aY - bY;
        rY = -1;
    }
    var k = tY / tX; // ?????????
    // ????????????
    var maxX = Math.abs(aX - bX);
    var maxY = Math.abs(aY - bY);
    if (maxX > maxY) {
        for(var i=1; i < maxX; i+=5) {
            var tempY = i * k;
            createPointer(aX + i * rX, aY + tempY * rY);
        }
    } else {
        for(var i=1; i < maxY; i+=5) {
            var tempX = i / k;
            createPointer(aX + tempX * rX, aY + i * rY);
        }
    }
}
