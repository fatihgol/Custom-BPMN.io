import { taskTypes } from './taskTypes';

const PALETTE_ICONS = {
  start: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#00897b" stroke-width="2" fill="#ffffff"/><path d="M10 8l6 4-6 4V8z" fill="#00897b" stroke="none"/></svg>`,
  end: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#e53935" stroke-width="2.5" fill="#ffffff"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#e53935" stroke="none"/></svg>`,
  userTask: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2,1)"><circle cx="10" cy="7" r="6" fill="#42a5f5" stroke="none"/><path d="M 2,19 C 2,14 5,14 10,14 C 15,14 18,14 18,19" stroke="#42a5f5" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>`,
  userGroupTask: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1,1)"><circle cx="15" cy="7" r="5" fill="#9fa8da" opacity="0.7" stroke="none"/><path d="M 9,18 C 9,14 12,14 15,14 C 18,14 21,14 21,18" stroke="#9fa8da" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/><circle cx="8" cy="9" r="6" fill="#5c6bc0" stroke="none"/><path d="M 0,21 C 0,16 3,16 8,16 C 13,16 16,16 16,21" stroke="#5c6bc0" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>`,
  serviceTask: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#78909c" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 2V5 M12 19V22 M2 12H5 M19 12H22 M4.9 4.9L7 7 M17 17L19.1 19.1 M4.9 19.1L7 17 M17 7L19.1 4.9"/></svg>`,
  apiCallTask: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#26c6da" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><g transform="translate(0,1)"><path d="M 2,8 L 18,8 M 14,4 L 18,8 L 14,12"/><path d="M 22,16 L 6,16 M 10,20 L 6,16 L 10,12"/></g></svg>`,
  notificationNode: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3A6 6 0 0 0 6 9v7l-3 3h18l-3-3V9a6 6 0 0 0-6-6z" fill="#ffa726" stroke="none"/><path d="M9 21h6a3 3 0 0 1-6 0z" fill="#ef6c00" stroke="none"/></svg>`,
  decisionNode: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ab47bc" stroke-width="2"><g transform="translate(1,2)"><rect x="0" y="0" width="22" height="20" rx="2"/><line x1="0" y1="6" x2="22" y2="6" stroke-width="1.5"/><line x1="0" y1="13" x2="22" y2="13" stroke-width="1"/><line x1="8" y1="0" x2="8" y2="20" stroke-width="1.5"/><circle cx="4" cy="10" r="1.5" fill="#ab47bc" stroke="none"/><circle cx="15" cy="10" r="1.5" fill="#ab47bc" stroke="none"/><circle cx="4" cy="17" r="1.5" fill="#ab47bc" stroke="none"/></g></svg>`
};

const toDataUrl = (svgString) => `data:image/svg+xml;utf8,${encodeURIComponent(svgString.replace(/\s+/g, ' ').trim())}`;

export default function CustomContextPad(
  config,
  contextPad,
  create,
  elementFactory,
  translate,
  modeling,
  bpmnFactory,
  connect
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.modeling = modeling;
  this.bpmnFactory = bpmnFactory;
  this.connect = connect;

  contextPad.registerProvider(this);
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'translate',
  'modeling',
  'bpmnFactory',
  'connect'
];

CustomContextPad.prototype.getContextPadEntries = function (element) {
  const { create, elementFactory, translate, modeling, bpmnFactory, connect } = this;

  function appendTask(task) {
    return function (event) {
      const bo = bpmnFactory.create(task.type);
      bo.set('data-task-type', task.key);
      bo.name = task.label;

      const shape = elementFactory.createShape({
        type: task.type,
        businessObject: bo
      });

      create.start(event, shape, element);
    };
  }

  const actions = {
    connect: {
      group: 'connect',
      className: 'bpmn-icon-connection-multi',
      title: translate('Bağla'),
      action: {
        click: (event) => connect.start(event, element),
        dragstart: (event) => connect.start(event, element)
      }
    },
    delete: {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: translate('Sil'),
      action: {
        click: () => modeling.removeElements([element])
      }
    }
  };

  taskTypes.forEach((task) => {
    const svgPreview = PALETTE_ICONS[task.key];
    const imageUrl = svgPreview ? toDataUrl(svgPreview) : undefined;
    actions[`append.${task.key}`] = {
      group: 'append',
      className: `custom-context ${task.key}`,
      imageUrl,
      title: translate(`${task.label} ekle`),
      action: {
        click: appendTask(task),
        dragstart: appendTask(task)
      }
    };
  });

  return actions;
};
