import contextPadModule from 'bpmn-js/lib/features/context-pad';
import CustomContextPad from './CustomContextPad';
import CustomConnectionBehavior from './CustomConnectionBehavior';
import CustomConnectionDoubleClick from './CustomConnectionDoubleClick';
import CustomRules from './CustomRules';

export default {
  __depends__: [contextPadModule],
  __init__: ['customContextPad', 'customConnectionBehavior', 'customConnectionDoubleClick', 'customRules'],
  customContextPad: ['type', CustomContextPad],
  customConnectionBehavior: ['type', CustomConnectionBehavior],
  customConnectionDoubleClick: ['type', CustomConnectionDoubleClick],
  customRules: ['type', CustomRules]
};
