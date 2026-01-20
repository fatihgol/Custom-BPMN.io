import contextPadModule from 'bpmn-js/lib/features/context-pad';
import CustomContextPad from './CustomContextPad';
import CustomConnectionBehavior from './CustomConnectionBehavior';
import CustomConnectionDoubleClick from './CustomConnectionDoubleClick';
import CustomRules from './CustomRules';

export default {
  __depends__: [contextPadModule],
  __init__: ['contextPadProvider', 'customConnectionBehavior', 'customConnectionDoubleClick', 'customRules'],
  contextPadProvider: ['type', CustomContextPad],
  customConnectionBehavior: ['type', CustomConnectionBehavior],
  customConnectionDoubleClick: ['type', CustomConnectionDoubleClick],
  customRules: ['type', CustomRules]
};
