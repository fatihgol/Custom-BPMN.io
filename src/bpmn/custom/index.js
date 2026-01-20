import contextPadModule from 'bpmn-js/lib/features/context-pad';
import CustomContextPad from './CustomContextPad';
import CustomConnectionBehavior from './CustomConnectionBehavior';
import CustomRules from './CustomRules';

export default {
  __depends__: [contextPadModule],
  __init__: ['customContextPad', 'customConnectionBehavior', 'customRules'],
  customContextPad: ['type', CustomContextPad],
  customConnectionBehavior: ['type', CustomConnectionBehavior],
  customRules: ['type', CustomRules]
};
