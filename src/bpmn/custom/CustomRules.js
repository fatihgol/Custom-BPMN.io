import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default class CustomRules extends RuleProvider {
  constructor(eventBus) {
    super(eventBus);
  }

  init() {
    // connection.create için kural: özel output'lu task ise sadece context pad üzerinden (hints.label) bağlantı
    this.addRule('connection.create', 1000, (context) => {
      const { source } = context;
      if (!source || !this._isTask(source)) return;

      const hasOutputs = this._hasCustomOutputs(source.businessObject);
      if (!hasOutputs) return;

      const fromContextPad = !!context.hints?.label;
      return fromContextPad ? true : false;
    });
  }

  _isTask(element) {
    return isAny(element, ['bpmn:Task', 'bpmn:UserTask', 'bpmn:ServiceTask', 'bpmn:StartEvent']);
  }

  _hasCustomOutputs(bo) {
    const raw = bo?.customOutputEvents || bo?.$attrs?.customOutputEvents;
    const events = this._parseEventArray(raw);

    if (events.length > 0) {
      return true;
    }

    if (this._isStart(bo)) {
      return true;
    }

    return false;
  }

  _isStart(bo) {
    return bo && (bo.$type === 'bpmn:StartEvent' || bo.$attrs?.['data-task-type'] === 'start');
  }

  _parseEventArray(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }
}

CustomRules.$inject = ['eventBus'];
