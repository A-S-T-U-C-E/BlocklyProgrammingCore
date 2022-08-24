/**
 * @fileoverview Example of including Blockly with using Webpack with 
 *               defaults: (English lang & JavaScript generator).
 * @author samelh@google.com (Sam El-Husseini)
 */

import * as Blockly from 'blockly';

import * as En from 'blockly/msg/en';
import * as Fr from 'blockly/msg/fr';

Blockly.setLocale(En);
const BPC = [];

function manageResize(md, sizeProp, posProp) {
    let r = md.target;
    let prev = r.previousElementSibling;
    let next = r.nextElementSibling;
    if (!prev || !next) {
        return;
    }
    md.preventDefault();
    let prevSize = prev[sizeProp];
    let nextSize = next[sizeProp];
    let sumSize = prevSize + nextSize;
    let prevGrow = Number(prev.style.flexGrow);
    let nextGrow = Number(next.style.flexGrow);
    let sumGrow = prevGrow + nextGrow;
    let lastPos = md[posProp];

    function onMouseMove(mm) {
        let pos = mm[posProp];
        let d = pos - lastPos;
        prevSize += d;
        nextSize -= d;
        if (prevSize < 0) {
            nextSize += prevSize;
            pos -= prevSize;
            prevSize = 0;
        }
        if (nextSize < 0) {
            prevSize += nextSize;
            pos += nextSize;
            nextSize = 0;
        }
        let prevGrowNew = sumGrow * (prevSize / sumSize);
        let nextGrowNew = sumGrow * (nextSize / sumSize);
        prev.style.flexGrow = prevGrowNew;
        next.style.flexGrow = nextGrowNew;
        lastPos = pos;
        onresize();
        Blockly.svgResize(BPC.workspace);
    }

    function onMouseUp(mu) {
        const html = document.querySelector('html');
        html.style.cursor = 'default';
        if (posProp === 'pageX') {
            r.style.cursor = 'ew-resize';
        } else {
            r.style.cursor = 'ns-resize';
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}

function setupResizerEvents() {
    document.body.addEventListener("mousedown", function(md) {
        const html = document.querySelector('html');
        let target = md.target;
        if (target.nodeType !== 1 || target.tagName !== "FLEX-RESIZER") {
            return;
        }
        let parent = target.parentNode;
        let h = parent.classList.contains("wrapper_up");
        let v = parent.classList.contains("content_wrapper");
        if (h && v) {
            return;
        } else if (h) {
            target.style.cursor = 'col-resize';
            html.style.cursor = 'col-resize'; // avoid cursor's flickering
            manageResize(md, "offsetWidth", "pageX");
        } else if (v) {
            target.style.cursor = 'row-resize';
            html.style.cursor = 'row-resize'; // avoid cursor's flickering
            manageResize(md, "offsetHeight", "pageY");
        }
        Blockly.svgResize(BPC.workspace);
    });
}

/**
 * "When the window is resized, the blockly BPC.workspace is resized to match the size of the content
 * area."
 * @param e - The event object.
 */
function onresize(e) {
    let element = content_area;
    let x = 0;
    let y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    content_blocks.style.left = x + 'px';
    content_blocks.style.top = y + 'px';
    content_blocks.style.width = content_area.offsetWidth + 'px';
    content_blocks.style.height = content_area.offsetHeight + 'px';
    Blockly.svgResize(BPC.workspace);
};

document.addEventListener("DOMContentLoaded", function() {
    const content_area = document.getElementById('content_area');
    const content_blocks = document.getElementById('content_blocks');
    BPC.workspace = Blockly.inject(content_blocks, {
        toolbox: document.getElementById('toolbox'),
        media: 'media/'
    });
    window.addEventListener('resize', onresize, false);
    onresize();
    setupResizerEvents();

    const lang = 'JavaScript';
    const button1 = document.getElementById('blocklyButton1');
    button1.addEventListener('click', function() {
        const code = Blockly[lang].workspaceToCode(BPC.workspace);
        document.getElementById('content_code').innerHTML = code;
    })
    const button2 = document.getElementById('blocklyButton2');
    button2.addEventListener('click', function() {
        let blocklySave = Blockly.serialization.workspaces.save(Blockly.common.getMainWorkspace());
        Blockly.common.getMainWorkspace().clear();
        Blockly.setLocale(Fr);
        Blockly.serialization.workspaces.load(blocklySave, Blockly.common.getMainWorkspace());
    })
});