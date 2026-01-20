import { create as svgCreate } from 'tiny-svg';

export function createTaskSvg(typeKey, width = 100, height = 80, stringOutput = false, label = '') {
  const svg = svgCreate('svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const baseW = typeKey === 'decisionNode' ? 80 : 100;
  const baseH = 80;
  const scaleX = width / baseW;
  const scaleY = height / baseH;
  const g = svgCreate('g');
  g.setAttribute('transform', `scale(${scaleX},${scaleY})`);

  const accentConfig = {
    userTask: { spine: '#42a5f5', bar: '#e3f2fd' },
    userGroupTask: { spine: '#5c6bc0', bar: '#e8eaf6', secondary: '#9fa8da' },
    serviceTask: { spine: '#78909c', bar: '#eceff1' },
    apiCallTask: { spine: '#26c6da', bar: '#e0f7fa' },
    notificationNode: { spine: '#ffa726', bar: '#fff3e0', dark: '#ef6c00', light: '#ffe0b2' },
    decisionNode: { spine: '#ab47bc', bar: '#f3e5f5' }
  };

  const accent = accentConfig[typeKey];
  if (!accent) return stringOutput ? '' : svg;

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
  g.appendChild(outer);

  const spine = svgCreate('path');
  spine.setAttribute('d', 'M 5,1 A 8,8 0 0 0 1,9 V 71 A 8,8 0 0 0 5,79');
  spine.setAttribute('stroke', accent.spine);
  spine.setAttribute('stroke-width', 6);
  spine.setAttribute('fill', 'none');
  g.appendChild(spine);

  const barData = {
    userTask: { x1: 40, w1: 50, x2: 40, w2: 35 },
    userGroupTask: { x1: 45, w1: 45, x2: 45, w2: 30 },
    serviceTask: { x1: 42, w1: 48, x2: 42, w2: 32 },
    apiCallTask: { x1: 45, w1: 45, x2: 45, w2: 30 },
    notificationNode: { x1: 42, w1: 48, x2: 42, w2: 32 },
    decisionNode: { x1: 40, w1: 30, x2: 40, w2: 20, y1: 34, y2: 44 }
  }[typeKey];

  const bar1 = svgCreate('rect');
  bar1.setAttribute('x', barData.x1);
  bar1.setAttribute('y', barData.y1 || 30);
  bar1.setAttribute('width', barData.w1);
  bar1.setAttribute('height', 4);
  bar1.setAttribute('rx', 2);
  bar1.setAttribute('fill', accent.bar);

  const bar2 = svgCreate('rect');
  bar2.setAttribute('x', barData.x2);
  bar2.setAttribute('y', barData.y2 || 40);
  bar2.setAttribute('width', barData.w2);
  bar2.setAttribute('height', 4);
  bar2.setAttribute('rx', 2);
  bar2.setAttribute('fill', accent.bar);

  g.appendChild(bar1);
  g.appendChild(bar2);

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
    iconGroup.appendChild(head);
    iconGroup.appendChild(body);
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
    iconGroup.appendChild(headBack);
    iconGroup.appendChild(bodyBack);
    iconGroup.appendChild(headFront);
    iconGroup.appendChild(bodyFront);
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
    iconGroup.appendChild(gearCircle);
    iconGroup.appendChild(gearPath);
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
    iconGroup.appendChild(path1);
    iconGroup.appendChild(path2);
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
    iconGroup.appendChild(bell);
    iconGroup.appendChild(clapper);
    iconGroup.appendChild(wave);
  } else if (typeKey === 'decisionNode') {
    iconGroup.setAttribute('transform', 'translate(12, 30)');
    iconGroup.setAttribute('stroke', accent.spine);
    iconGroup.setAttribute('stroke-width', 2);
    iconGroup.setAttribute('fill', 'none');
    const table = svgCreate('rect');
    table.setAttribute('x', 0);
    table.setAttribute('y', 0);
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
    c1.setAttribute('fill', accent.spine);
    c1.setAttribute('stroke', 'none');
    const c2 = svgCreate('circle');
    c2.setAttribute('cx', 15);
    c2.setAttribute('cy', 10);
    c2.setAttribute('r', 1.5);
    c2.setAttribute('fill', accent.spine);
    c2.setAttribute('stroke', 'none');
    const c3 = svgCreate('circle');
    c3.setAttribute('cx', 4);
    c3.setAttribute('cy', 17);
    c3.setAttribute('r', 1.5);
    c3.setAttribute('fill', accent.spine);
    c3.setAttribute('stroke', 'none');
    iconGroup.appendChild(table);
    iconGroup.appendChild(l1);
    iconGroup.appendChild(l2);
    iconGroup.appendChild(l3);
    iconGroup.appendChild(c1);
    iconGroup.appendChild(c2);
    iconGroup.appendChild(c3);
  }

  g.appendChild(iconGroup);
  svg.appendChild(g);

  if (stringOutput) {
    return svg.outerHTML;
  }
  return svg;
}
