import { taskTypes } from './taskTypes';
import { createTaskSvg } from './taskSvgFactory';

export default function CustomPalette(
  bpmnFactory,
  create,
  elementFactory,
  palette,
  translate
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.palette = palette;
  this.translate = translate;
  this.bpmnFactory = bpmnFactory;

  palette.registerProvider(this);
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate'];

CustomPalette.prototype.getPaletteEntries = function () {
  const { create, elementFactory, translate, bpmnFactory } = this;

  function createAction(type, taskKey, title) {
    return function (event) {
      const businessObject = bpmnFactory.create(type);
      businessObject.set('data-task-type', taskKey);
      businessObject.name = title;

      const shape = elementFactory.createShape({
        type,
        businessObject
      });

      create.start(event, shape);
    };
  }

  return taskTypes.reduce((entries, task) => {
    const customSvg = createTaskSvg(task.key, 56, 44, true, task.label);

    entries[`create.${task.key}`] = {
      group: 'custom',
      className: `${task.icon} custom-${task.key}`,
      title: translate(task.label),
      html: customSvg,
      action: {
        dragstart: createAction(task.type, task.key, task.label),
        click: createAction(task.type, task.key, task.label)
      }
    };

    return entries;
  }, {});
};
