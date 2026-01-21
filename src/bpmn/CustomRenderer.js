import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { taskTypes } from './taskTypes';

const HIGH_PRIORITY = 2000;
const colorByKey = taskTypes.reduce((acc, curr) => {
  acc[curr.key] = curr.color;
  return acc;
}, {});

const fillByKey = {
  start: 'rgba(34, 197, 94, 0.12)',
  userTask: 'rgba(14, 165, 233, 0.12)',
  userGroupTask: 'rgba(99, 102, 241, 0.12)',
  serviceTask: 'rgba(245, 158, 11, 0.12)',
  decisionNode: 'rgba(236, 72, 153, 0.12)',
  notificationNode: 'rgba(34, 211, 238, 0.12)',
  apiCallTask: 'rgba(163, 230, 53, 0.12)',
  generateDocTask: 'rgba(0, 150, 136, 0.12)',
  callActivity: 'rgba(57, 73, 171, 0.12)',
  end: 'rgba(239, 68, 68, 0.12)'
};

const accentConfig = {
  userTask: { spine: '#42a5f5', bar: '#e3f2fd' },
  userGroupTask: { spine: '#5c6bc0', bar: '#e8eaf6', secondary: '#9fa8da' },
  serviceTask: { spine: '#78909c', bar: '#eceff1' },
  apiCallTask: { spine: '#26c6da', bar: '#e0f7fa' },
  notificationNode: { spine: '#ffa726', bar: '#fff3e0', dark: '#ef6c00', light: '#ffe0b2' },
  decisionNode: { spine: '#ab47bc', bar: '#f3e5f5' },
  generateDocTask: { spine: '#009688', bar: '#e0f2f1' },
  callActivity: { spine: '#3949ab', bar: '#e8eaf6' }
};

const renderInlineLabel = (parentNode, text, x, y, maxWidth = 80) => {
  if (!text) return;

  const label = svgCreate('text');
  label.setAttribute('x', x);
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('font-size', 11);
  label.setAttribute('font-weight', '400');
  label.setAttribute('fill', '#0f172a');

  const avgCharWidth = 6.5;
  const maxChars = Math.max(1, Math.floor(maxWidth / avgCharWidth));
  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach((w) => {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  });
  if (current) lines.push(current);

  label.setAttribute('y', y - (lines.length - 1) * 7);

  lines.forEach((line, idx) => {
    const tspan = svgCreate('tspan');
    tspan.setAttribute('x', x);
    tspan.setAttribute('dy', idx === 0 ? '0' : '14');
    tspan.textContent = line;
    svgAppend(label, tspan);
  });

  svgAppend(parentNode, label);
};

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
    console.log('CustomRenderer init');
  }

  canRender(element) {
    return isAny(element, [
      'bpmn:Task',
      'bpmn:UserTask',
      'bpmn:ServiceTask',
      'bpmn:SendTask',
      'bpmn:StartEvent',
      'bpmn:EndEvent',
      'bpmn:ExclusiveGateway'
    ]);
  }

  drawShape(parentNode, element) {
    if (element.type === 'label') {
      return this.bpmnRenderer.drawShape(parentNode, element);
    }

    const bo = element.businessObject;
    let typeKey = (bo.get && bo.get('data-task-type')) || bo.$attrs?.['data-task-type'];
    if (!typeKey) {
      const fallbackMap = {
        'bpmn:StartEvent': 'start',
        'bpmn:EndEvent': 'end',
        'bpmn:UserTask': 'userTask',
        'bpmn:Task': 'userTask',
        'bpmn:ServiceTask': 'serviceTask',
        'bpmn:ExclusiveGateway': 'decisionNode',
        'bpmn:SendTask': 'notificationNode'
      };
      typeKey = fallbackMap[element.type];
    }
    if (!typeKey) {
      typeKey = 'userTask';
    }

    if (element.type === 'bpmn:StartEvent' || typeKey === 'start') {
      console.log('Custom start render', element.id, element.type, typeKey);

      const svgRoot = parentNode.ownerSVGElement;
      if (svgRoot) {
        let defs = svgRoot.querySelector('defs');
        if (!defs) {
          defs = svgCreate('defs');
          svgAppend(svgRoot, defs);
        }

        const gradId = `startGrad-${element.id}`;
        const filterId = `startGlow-${element.id}`;

        if (!defs.querySelector(`#${gradId}`)) {
          const gradient = svgCreate('linearGradient');
          gradient.setAttribute('id', gradId);
          gradient.setAttribute('x1', '0%');
          gradient.setAttribute('y1', '0%');
          gradient.setAttribute('x2', '100%');
          gradient.setAttribute('y2', '100%');

          const stop1 = svgCreate('stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', '#e0f7fa');
          stop1.setAttribute('stop-opacity', '1');

          const stop2 = svgCreate('stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', '#26a69a');
          stop2.setAttribute('stop-opacity', '0.3');

          svgAppend(gradient, stop1);
          svgAppend(gradient, stop2);
          svgAppend(defs, gradient);
        }

        if (!defs.querySelector(`#${filterId}`)) {
          const filter = svgCreate('filter');
          filter.setAttribute('id', filterId);

          const gaussian = svgCreate('feGaussianBlur');
          gaussian.setAttribute('stdDeviation', '1.5');
          gaussian.setAttribute('result', 'coloredBlur');

          const merge = svgCreate('feMerge');
          const mergeNode1 = svgCreate('feMergeNode');
          mergeNode1.setAttribute('in', 'coloredBlur');
          const mergeNode2 = svgCreate('feMergeNode');
          mergeNode2.setAttribute('in', 'SourceGraphic');

          svgAppend(merge, mergeNode1);
          svgAppend(merge, mergeNode2);

          svgAppend(filter, gaussian);
          svgAppend(filter, merge);
          svgAppend(defs, filter);
        }

        while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
        }

        const width = element.width || 36;
        const height = element.height || 36;
        const cx = width / 2;
        const cy = height / 2;
        const r = 16.5;

        const baseCircle = svgCreate('circle');
        baseCircle.setAttribute('cx', cx);
        baseCircle.setAttribute('cy', cy);
        baseCircle.setAttribute('r', r);
        baseCircle.setAttribute('fill', '#ffffff');
        baseCircle.setAttribute('stroke', '#00897b');
        baseCircle.setAttribute('stroke-width', 2.5);
        svgAppend(parentNode, baseCircle);

        const path = svgCreate('path');
        path.setAttribute('d', `M ${cx - 4} ${cy - 7} L ${cx + 6} ${cy} L ${cx - 4} ${cy + 7} Z`);
        path.setAttribute('fill', '#00897b');
        path.setAttribute('stroke', 'none');
        svgAppend(parentNode, path);

        parentNode.style.filter = 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.15))';
        return parentNode;
      }

      // fallback for drag preview when svgRoot is missing
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
      const fallbackCircle = svgCreate('circle');
      fallbackCircle.setAttribute('cx', 18);
      fallbackCircle.setAttribute('cy', 18);
      fallbackCircle.setAttribute('r', 16.5);
      fallbackCircle.setAttribute('fill', '#ffffff');
      fallbackCircle.setAttribute('stroke', '#00897b');
      fallbackCircle.setAttribute('stroke-width', 2.5);
      const fallbackPath = svgCreate('path');
      fallbackPath.setAttribute('d', 'M 14 11 L 24 18 L 14 25 Z');
      fallbackPath.setAttribute('fill', '#00897b');
      fallbackPath.setAttribute('stroke', 'none');
      svgAppend(parentNode, fallbackCircle);
      svgAppend(parentNode, fallbackPath);

      return parentNode;
    }

    if (element.type === 'bpmn:EndEvent' || typeKey === 'end') {
      const svgRoot = parentNode.ownerSVGElement;
      if (svgRoot) {
        let defs = svgRoot.querySelector('defs');
        if (!defs) {
          defs = svgCreate('defs');
          svgAppend(svgRoot, defs);
        }

        const gradId = `endGrad-${element.id}`;

        if (!defs.querySelector(`#${gradId}`)) {
          const gradient = svgCreate('linearGradient');
          gradient.setAttribute('id', gradId);
          gradient.setAttribute('x1', '100%');
          gradient.setAttribute('y1', '0%');
          gradient.setAttribute('x2', '0%');
          gradient.setAttribute('y2', '100%');

          const stop1 = svgCreate('stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', '#ffebee');
          stop1.setAttribute('stop-opacity', '1');

          const stop2 = svgCreate('stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', '#ffcdd2');
          stop2.setAttribute('stop-opacity', '1');

          svgAppend(gradient, stop1);
          svgAppend(gradient, stop2);
          svgAppend(defs, gradient);
        }

        while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
        }

        const width = element.width || 36;
        const height = element.height || 36;
        const cx = width / 2;
        const cy = height / 2;
        const r = 16.5;

        const baseCircle = svgCreate('circle');
        baseCircle.setAttribute('cx', cx);
        baseCircle.setAttribute('cy', cy);
        baseCircle.setAttribute('r', r);
        baseCircle.setAttribute('fill', '#ffffff');
        baseCircle.setAttribute('stroke', '#e53935');
        baseCircle.setAttribute('stroke-width', 2.5);
        svgAppend(parentNode, baseCircle);

        const rect = svgCreate('rect');
        rect.setAttribute('x', cx - 5);
        rect.setAttribute('y', cy - 5);
        rect.setAttribute('width', 10);
        rect.setAttribute('height', 10);
        rect.setAttribute('rx', 1);
        rect.setAttribute('fill', '#e53935');
        rect.setAttribute('stroke', 'none');
        svgAppend(parentNode, rect);

        parentNode.style.filter = 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.15))';
        return parentNode;
      }

      // fallback drag preview
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
      const fallbackCircle = svgCreate('circle');
      fallbackCircle.setAttribute('cx', 18);
      fallbackCircle.setAttribute('cy', 18);
      fallbackCircle.setAttribute('r', 16.5);
      fallbackCircle.setAttribute('fill', '#ffffff');
      fallbackCircle.setAttribute('stroke', '#e53935');
      fallbackCircle.setAttribute('stroke-width', 2.5);
      const fallbackRect = svgCreate('rect');
      fallbackRect.setAttribute('x', 13);
      fallbackRect.setAttribute('y', 13);
      fallbackRect.setAttribute('width', 10);
      fallbackRect.setAttribute('height', 10);
      fallbackRect.setAttribute('rx', 1);
      fallbackRect.setAttribute('fill', '#e53935');
      fallbackRect.setAttribute('stroke', 'none');
      svgAppend(parentNode, fallbackCircle);
      svgAppend(parentNode, fallbackRect);

      return parentNode;
    }

    if (
      typeKey === 'userTask' ||
      typeKey === 'userGroupTask' ||
      typeKey === 'serviceTask' ||
      typeKey === 'apiCallTask' ||
      typeKey === 'notificationNode' ||
      typeKey === 'decisionNode' ||
      typeKey === 'decisionNode' ||
      typeKey === 'generateDocTask' ||
      typeKey === 'callActivity'
    ) {
      const svgRoot = parentNode.ownerSVGElement;
      if (!svgRoot) {
        while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild);
        const w = element.width || 100;
        const h = element.height || 80;
        const rect = svgCreate('rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('rx', 10);
        rect.setAttribute('ry', 10);
        rect.setAttribute('fill', '#ffffff');
        rect.setAttribute('stroke', accentConfig[typeKey].spine);
        rect.setAttribute('stroke-width', 2);
        svgAppend(parentNode, rect);
        return parentNode;
      }

      let defs = svgRoot.querySelector('defs');
      if (!defs) {
        defs = svgCreate('defs');
        svgAppend(svgRoot, defs);
      }

      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }

      const baseW = typeKey === 'decisionNode' ? 80 : 100;
      const baseH = 80;
      const w = element.width || baseW;
      const h = element.height || baseH;
      const scaleX = w / baseW;
      const scaleY = h / baseH;
      const g = svgCreate('g');
      g.setAttribute('transform', `scale(${scaleX},${scaleY})`);

      const accent = accentConfig[typeKey];

      if (typeKey === 'decisionNode') {
        const filterId = 'shadow-gate';
        if (!defs.querySelector(`#${filterId}`)) {
          const filter = svgCreate('filter');
          filter.setAttribute('id', filterId);
          filter.setAttribute('x', '-20%');
          filter.setAttribute('y', '-20%');
          filter.setAttribute('width', '140%');
          filter.setAttribute('height', '140%');

          const dropShadow = svgCreate('feDropShadow');
          dropShadow.setAttribute('dx', '0');
          dropShadow.setAttribute('dy', '2');
          dropShadow.setAttribute('stdDeviation', '2');
          dropShadow.setAttribute('flood-color', '#ab47bc');
          dropShadow.setAttribute('flood-opacity', '0.2');

          svgAppend(filter, dropShadow);
          svgAppend(defs, filter);
        }

        const diamond = svgCreate('rect');
        diamond.setAttribute('x', 16);
        diamond.setAttribute('y', 16);
        diamond.setAttribute('width', 48);
        diamond.setAttribute('height', 48);
        diamond.setAttribute('rx', 4);
        diamond.setAttribute('transform', 'rotate(45 40 40)');
        diamond.setAttribute('fill', '#ffffff');
        diamond.setAttribute('stroke', '#ab47bc');
        diamond.setAttribute('stroke-width', 3);
        diamond.setAttribute('filter', `url(#${filterId})`);
        svgAppend(g, diamond);
      } else {
        const outer = svgCreate('rect');
        outer.setAttribute('x', 1);
        outer.setAttribute('y', 1);
        outer.setAttribute('width', baseW - 2);
        outer.setAttribute('height', baseH - 2);
        outer.setAttribute('rx', 8);
        outer.setAttribute('ry', 8);
        outer.setAttribute('fill', '#ffffff');
        outer.setAttribute('stroke', '#e0e0e0');
        outer.setAttribute('stroke-width', 1);
        svgAppend(g, outer);

        const spine = svgCreate('path');
        spine.setAttribute('d', 'M 5,1 A 8,8 0 0 0 1,9 V 71 A 8,8 0 0 0 5,79');
        spine.setAttribute('stroke', accent.spine);
        spine.setAttribute('stroke-width', 6);
        spine.setAttribute('fill', 'none');
        svgAppend(g, spine);

        const bars = svgCreate('g');
        const bar1 = svgCreate('rect');
        const bar2 = svgCreate('rect');
        const barData = {
          userTask: { x1: 40, w1: 50, x2: 40, w2: 35 },
          userGroupTask: { x1: 45, w1: 45, x2: 45, w2: 30 },
          serviceTask: { x1: 42, w1: 48, x2: 42, w2: 32 },
          apiCallTask: { x1: 45, w1: 45, x2: 45, w2: 30 },
          notificationNode: { x1: 42, w1: 48, x2: 42, w2: 32 },
          generateDocTask: { x1: 45, w1: 45, x2: 45, w2: 30 },
          callActivity: { x1: 45, w1: 45, x2: 45, w2: 30 }
        }[typeKey];

        if (barData) {
          bar1.setAttribute('x', barData.x1);
          bar1.setAttribute('y', barData.y1 || 30);
          bar1.setAttribute('width', barData.w1);
          bar1.setAttribute('height', 4);
          bar1.setAttribute('rx', 2);
          bar1.setAttribute('fill', accent.bar);

          bar2.setAttribute('x', barData.x2);
          bar2.setAttribute('y', barData.y2 || 40);
          bar2.setAttribute('width', barData.w2);
          bar2.setAttribute('height', 4);
          bar2.setAttribute('rx', 2);
          bar2.setAttribute('fill', accent.bar);

          svgAppend(bars, bar1);
          svgAppend(bars, bar2);
          svgAppend(g, bars);
        }
      }

      const iconGroup = svgCreate('g');
      if (typeKey === 'userTask') {
        iconGroup.setAttribute('transform', 'translate(15, 15)');
        const head = svgCreate('circle');
        head.setAttribute('cx', 10);
        head.setAttribute('cy', 7);
        head.setAttribute('r', 6);
        head.setAttribute('fill', accent.spine);
        const body = svgCreate('path');
        body.setAttribute('d', 'M 2,19 C 2,14 5,14 10,14 C 15,14 18,14 18,19');
        body.setAttribute('stroke', accent.spine);
        body.setAttribute('stroke-width', 3);
        body.setAttribute('fill', 'none');
        body.setAttribute('stroke-linecap', 'round');
        svgAppend(iconGroup, head);
        svgAppend(iconGroup, body);
      } else if (typeKey === 'userGroupTask') {
        iconGroup.setAttribute('transform', 'translate(14, 15)');
        const headBack = svgCreate('circle');
        headBack.setAttribute('cx', 15);
        headBack.setAttribute('cy', 7);
        headBack.setAttribute('r', 5);
        headBack.setAttribute('fill', accent.secondary);
        const bodyBack = svgCreate('path');
        bodyBack.setAttribute('d', 'M 9,18 C 9,14 12,14 15,14 C 18,14 21,14 21,18');
        bodyBack.setAttribute('stroke', accent.secondary);
        bodyBack.setAttribute('stroke-width', 3);
        bodyBack.setAttribute('fill', 'none');
        bodyBack.setAttribute('stroke-linecap', 'round');
        const headFront = svgCreate('circle');
        headFront.setAttribute('cx', 8);
        headFront.setAttribute('cy', 9);
        headFront.setAttribute('r', 6);
        headFront.setAttribute('fill', accent.spine);
        const bodyFront = svgCreate('path');
        bodyFront.setAttribute('d', 'M 0,21 C 0,16 3,16 8,16 C 13,16 16,16 16,21');
        bodyFront.setAttribute('stroke', accent.spine);
        bodyFront.setAttribute('stroke-width', 3);
        bodyFront.setAttribute('fill', 'none');
        bodyFront.setAttribute('stroke-linecap', 'round');
        svgAppend(iconGroup, headBack);
        svgAppend(iconGroup, bodyBack);
        svgAppend(iconGroup, headFront);
        svgAppend(iconGroup, bodyFront);
      } else if (typeKey === 'serviceTask') {
        iconGroup.setAttribute('transform', 'translate(15, 15)');
        iconGroup.setAttribute('fill', 'none');
        iconGroup.setAttribute('stroke', accent.spine);
        iconGroup.setAttribute('stroke-width', 2.5);
        const gearCircle = svgCreate('circle');
        gearCircle.setAttribute('cx', 12);
        gearCircle.setAttribute('cy', 12);
        gearCircle.setAttribute('r', 5);
        const gearPath = svgCreate('path');
        gearPath.setAttribute(
          'd',
          'M12 2V5 M12 19V22 M2 12H5 M19 12H22 M4.9 4.9L7 7 M17 17L19.1 19.1 M4.9 19.1L7 17 M17 7L19.1 4.9'
        );
        gearPath.setAttribute('stroke-linecap', 'round');
        svgAppend(iconGroup, gearCircle);
        svgAppend(iconGroup, gearPath);
      } else if (typeKey === 'apiCallTask') {
        iconGroup.setAttribute('transform', 'translate(15, 18)');
        iconGroup.setAttribute('stroke', accent.spine);
        iconGroup.setAttribute('stroke-width', 2.5);
        iconGroup.setAttribute('stroke-linecap', 'round');
        iconGroup.setAttribute('stroke-linejoin', 'round');
        const path1 = svgCreate('path');
        path1.setAttribute('d', 'M 2,8 L 18,8 M 14,4 L 18,8 L 14,12');
        path1.setAttribute('fill', 'none');
        const path2 = svgCreate('path');
        path2.setAttribute('d', 'M 22,16 L 6,16 M 10,20 L 6,16 L 10,12');
        path2.setAttribute('fill', 'none');
        svgAppend(iconGroup, path1);
        svgAppend(iconGroup, path2);
      } else if (typeKey === 'notificationNode') {
        iconGroup.setAttribute('transform', 'translate(16, 15)');
        const bell = svgCreate('path');
        bell.setAttribute('d', 'M12 3A6 6 0 0 0 6 9v7l-3 3h18l-3-3V9a6 6 0 0 0-6-6z');
        bell.setAttribute('fill', accent.spine);
        const clapper = svgCreate('path');
        clapper.setAttribute('d', 'M9 21h6a3 3 0 0 1-6 0z');
        clapper.setAttribute('fill', accent.dark || accent.spine);
        const wave = svgCreate('path');
        wave.setAttribute('d', 'M 22,6 A 10,10 0 0 1 22,16');
        wave.setAttribute('stroke', accent.light || accent.bar);
        wave.setAttribute('stroke-width', 2);
        wave.setAttribute('fill', 'none');
        wave.setAttribute('stroke-linecap', 'round');
        svgAppend(iconGroup, bell);
        svgAppend(iconGroup, clapper);
        svgAppend(iconGroup, wave);
      } else if (typeKey === 'decisionNode') {
        const tableG = svgCreate('g');
        tableG.setAttribute('transform', 'translate(29, 24)');
        tableG.setAttribute('stroke', '#ab47bc');
        tableG.setAttribute('stroke-width', 2);
        tableG.setAttribute('fill', 'none');

        const table = svgCreate('rect');
        table.setAttribute('width', 22);
        table.setAttribute('height', 20);
        table.setAttribute('rx', 2);

        const l1 = svgCreate('line');
        l1.setAttribute('x1', 0);
        l1.setAttribute('y1', 6);
        l1.setAttribute('x2', 22);
        l1.setAttribute('y2', 6);
        l1.setAttribute('stroke-width', 1.5);

        const l2 = svgCreate('line');
        l2.setAttribute('x1', 0);
        l2.setAttribute('y1', 13);
        l2.setAttribute('x2', 22);
        l2.setAttribute('y2', 13);
        l2.setAttribute('stroke-width', 1);

        const l3 = svgCreate('line');
        l3.setAttribute('x1', 8);
        l3.setAttribute('y1', 0);
        l3.setAttribute('x2', 8);
        l3.setAttribute('y2', 20);
        l3.setAttribute('stroke-width', 1.5);

        const c1 = svgCreate('circle');
        c1.setAttribute('cx', 4);
        c1.setAttribute('cy', 10);
        c1.setAttribute('r', 1.5);
        c1.setAttribute('fill', '#ab47bc');
        c1.setAttribute('stroke', 'none');

        const c2 = svgCreate('circle');
        c2.setAttribute('cx', 15);
        c2.setAttribute('cy', 10);
        c2.setAttribute('r', 1.5);
        c2.setAttribute('fill', '#ab47bc');
        c2.setAttribute('stroke', 'none');

        const c3 = svgCreate('circle');
        c3.setAttribute('cx', 4);
        c3.setAttribute('cy', 17);
        c3.setAttribute('r', 1.5);
        c3.setAttribute('fill', '#ab47bc');
        c3.setAttribute('stroke', 'none');

        svgAppend(tableG, table);
        svgAppend(tableG, l1);
        svgAppend(tableG, l2);
        svgAppend(tableG, l3);
        svgAppend(tableG, c1);
        svgAppend(tableG, c2);
        svgAppend(tableG, c3);
        svgAppend(iconGroup, tableG);

        const bottoms = svgCreate('rect');
        bottoms.setAttribute('x', 30);
        bottoms.setAttribute('y', 52);
        bottoms.setAttribute('width', 20);
        bottoms.setAttribute('height', 3);
        bottoms.setAttribute('rx', 1.5);
        bottoms.setAttribute('fill', '#f3e5f5');
        svgAppend(iconGroup, bottoms);
      } else if (typeKey === 'generateDocTask') {
        // Spine (Left bar)
        // Already drawn by generic logic? No, generic logic draws a generic spine. 
        // The generic logic draws `const spine = svgCreate('path'); ...` at lines 408-410.
        // The generic spine is: M 5,1 A 8,8 0 0 0 1,9 V 71 A 8,8 0 0 0 5,79
        // The user provided spine is IDENTICIAL but specific color. 
        // accent.spine matches #009688, so GENERIC SPINE is fine. We don't need to redraw it in iconGroup.

        // Bars (Right side)
        // Generic logic draws bars if `barData` exists.
        // User SVG has bars at: x=45 y=30 w=45 and x=45 y=40 w=30.
        // Let's Add barData for generateDocTask to generic logic instead of here.

        // So here only the ICON part (translate(18, 15)) is needed.

        iconGroup.setAttribute('transform', 'translate(18, 15)');

        const docFrame = svgCreate('path');
        docFrame.setAttribute('d', 'M 4,1 L 15,1 L 20,6 L 20,23 L 4,23 Z');
        docFrame.setAttribute('fill', 'none');
        docFrame.setAttribute('stroke', '#009688');
        docFrame.setAttribute('stroke-width', 2);
        docFrame.setAttribute('stroke-linejoin', 'round');

        const docFold = svgCreate('path');
        docFold.setAttribute('d', 'M 15,1 V 6 H 20');
        docFold.setAttribute('fill', 'none');
        docFold.setAttribute('stroke', '#009688');
        docFold.setAttribute('stroke-width', 2);
        docFold.setAttribute('stroke-linejoin', 'round');

        const docLine = svgCreate('rect');
        docLine.setAttribute('x', 7);
        docLine.setAttribute('y', 9);
        docLine.setAttribute('width', 10);
        docLine.setAttribute('height', 3);
        docLine.setAttribute('rx', 0.5);
        docLine.setAttribute('fill', '#009688');
        docLine.setAttribute('stroke', 'none');

        const docDashed = svgCreate('rect');
        docDashed.setAttribute('x', 7);
        docDashed.setAttribute('y', 14);
        docDashed.setAttribute('width', 10);
        docDashed.setAttribute('height', 6);
        docDashed.setAttribute('rx', 0.5);
        docDashed.setAttribute('fill', 'none');
        docDashed.setAttribute('stroke', '#009688');
        docDashed.setAttribute('stroke-width', 1.5);
        docDashed.setAttribute('stroke-dasharray', '2,1');

        const arrowG = svgCreate('g');
        arrowG.setAttribute('transform', 'translate(-3, 17)');
        const arrowLine = svgCreate('path');
        arrowLine.setAttribute('d', 'M 0,0 L 6,0');
        arrowLine.setAttribute('stroke', '#009688');
        arrowLine.setAttribute('stroke-width', 2.5);
        arrowLine.setAttribute('stroke-linecap', 'round');

        const arrowHead = svgCreate('path');
        arrowHead.setAttribute('d', 'M 4,-2.5 L 7,0 L 4,2.5');
        arrowHead.setAttribute('fill', '#009688');
        arrowHead.setAttribute('stroke', 'none');

        svgAppend(arrowG, arrowLine);
        svgAppend(arrowG, arrowHead);

        svgAppend(iconGroup, docFrame);
        svgAppend(iconGroup, docFold);
        svgAppend(iconGroup, docLine);
        svgAppend(iconGroup, docDashed);
        svgAppend(iconGroup, docDashed);
        svgAppend(iconGroup, arrowG);
      } else if (typeKey === 'callActivity') {
        iconGroup.setAttribute('transform', 'translate(15, 15)');

        // Main Lines
        const lines = svgCreate('path');
        lines.setAttribute('d', 'M 5,10 H 9 M 21,10 H 25');
        lines.setAttribute('stroke', '#3949ab');
        lines.setAttribute('stroke-width', 2);
        lines.setAttribute('stroke-linecap', 'round');

        // Left Dot
        const dot1 = svgCreate('circle');
        dot1.setAttribute('cx', 3);
        dot1.setAttribute('cy', 10);
        dot1.setAttribute('r', 2.5);
        dot1.setAttribute('fill', '#ffffff');
        dot1.setAttribute('stroke', '#3949ab');
        dot1.setAttribute('stroke-width', 1.5);

        // Center Box
        const box = svgCreate('rect');
        box.setAttribute('x', 9);
        box.setAttribute('y', 4);
        box.setAttribute('width', 12);
        box.setAttribute('height', 12);
        box.setAttribute('rx', 2);
        box.setAttribute('fill', '#ffffff');
        box.setAttribute('stroke', '#3949ab');
        box.setAttribute('stroke-width', 2);

        // Inner Plus/Lines in Box
        const innerLines = svgCreate('path');
        innerLines.setAttribute('d', 'M 15,7 V 13 M 12,10 H 18');
        innerLines.setAttribute('stroke', '#3949ab');
        innerLines.setAttribute('stroke-width', 1.5);
        innerLines.setAttribute('stroke-linecap', 'round');

        // Right Dot (Filled)
        const dot2 = svgCreate('circle');
        dot2.setAttribute('cx', 27);
        dot2.setAttribute('cy', 10);
        dot2.setAttribute('r', 2.5);
        dot2.setAttribute('fill', '#3949ab');
        dot2.setAttribute('stroke', 'none');

        svgAppend(iconGroup, lines);
        svgAppend(iconGroup, dot1);
        svgAppend(iconGroup, box);
        svgAppend(iconGroup, innerLines);
        svgAppend(iconGroup, dot2);
      }

      svgAppend(g, iconGroup);
      svgAppend(parentNode, g);
      parentNode.style.filter = 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.15))';
      if (typeKey !== 'decisionNode') {
        renderInlineLabel(parentNode, bo.name, w / 2, h - 14, w - 20);
      }

      return parentNode;
    }

    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    if (typeKey && colorByKey[typeKey]) {
      const rect =
        shape.querySelector('rect') || shape.querySelector('path') || shape.querySelector('circle') || shape;
      if (rect) {
        rect.setAttribute('stroke', colorByKey[typeKey]);
        rect.setAttribute('fill', fillByKey[typeKey] || '#fff');
        rect.setAttribute('stroke-width', 2.5);

        if (rect.tagName === 'rect') {
          rect.setAttribute('rx', 10);
          rect.setAttribute('ry', 10);
        }
      }

      shape.style.filter = 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.15))';
    }

    return shape;
  }

  drawConnection(parentNode, element) {
    const connection = this.bpmnRenderer.drawConnection(parentNode, element);
    const path = connection.querySelector('path');
    if (path) {
      path.setAttribute('stroke-width', 2);

      // Check for custom event color from DI or business object
      let customColor = null;

      // First check DI element for stroke color
      if (element.di && element.di.stroke) {
        customColor = element.di.stroke;
      }

      // Fallback to business object attribute
      if (!customColor && element.businessObject) {
        const bo = element.businessObject;
        customColor = bo.get?.('data-event-color') || bo.$attrs?.['data-event-color'];
      }

      // Apply custom color or default
      path.setAttribute('stroke', customColor || '#94a3b8');
    }
    return connection;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
