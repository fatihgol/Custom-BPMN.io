export const taskTypes = [
  {
    key: 'start',
    label: 'Start',
    type: 'bpmn:StartEvent',
    icon: 'bpmn-icon-start-event-none',
    wait: false,
    outputs: '1',
    event: 'Hayır',
    color: '#22c55e'
  },
  {
    key: 'userTask',
    label: 'User Task',
    type: 'bpmn:UserTask',
    icon: 'bpmn-icon-user-task',
    wait: true,
    outputs: 'N (event\'ler)',
    event: 'Evet (WorkflowTaskEvents)',
    color: '#0ea5e9'
  },
  {
    key: 'userGroupTask',
    label: 'User Group Task',
    type: 'bpmn:UserTask',
    icon: 'bpmn-icon-call-activity',
    wait: true,
    outputs: 'N (event\'ler)',
    event: 'Evet (WorkflowTaskEvents)',
    color: '#6366f1'
  },
  {
    key: 'externalUserTask',
    label: 'External User Task',
    type: 'bpmn:UserTask',
    icon: 'bpmn-icon-user',
    wait: true,
    outputs: 'N (event\'ler)',
    event: 'Evet (WorkflowTaskEvents)',
    color: '#d81b60'
  },
  {
    key: 'serviceTask',
    label: 'Service Task',
    type: 'bpmn:ServiceTask',
    icon: 'bpmn-icon-service-task',
    wait: false,
    outputs: '1 veya 2 (success/fail)',
    event: 'Hayır (FlowData\'da)',
    color: '#f59e0b'
  },
  {
    key: 'decisionNode',
    label: 'Decision Node',
    type: 'bpmn:ExclusiveGateway',
    icon: 'bpmn-icon-gateway-xor',
    wait: false,
    outputs: 'N (way\'ler)',
    event: 'Hayır (FlowData\'da)',
    color: '#ec4899'
  },
  {
    key: 'notificationNode',
    label: 'Notification',
    type: 'bpmn:SendTask',
    icon: 'bpmn-icon-send-task',
    wait: false,
    outputs: '1',
    event: 'Hayır (FlowData\'da)',
    color: '#22d3ee'
  },
  {
    key: 'apiCallTask',
    label: 'API Call',
    type: 'bpmn:ServiceTask',
    icon: 'bpmn-icon-script-task',
    wait: false,
    outputs: 'N (response mapping)',
    event: 'Hayır (FlowData\'da)',
    color: '#a3e635'
  },
  {
    key: 'generateDocTask',
    label: 'Generate Doc',
    type: 'bpmn:ServiceTask',
    icon: 'bpmn-icon-file',
    wait: false,
    outputs: '1',
    event: 'Hayır',
    color: '#009688'
  },
  {
    key: 'callActivity',
    label: 'Call Activity',
    type: 'bpmn:ServiceTask', // Using ServiceTask as base, but it's logically a Call Activity. BPMN has bpmn:CallActivity type, but user pattern uses ServiceTask with custom type. Let's check user request XML again. No XML type specified, but usually Call Activity is its own type. However, existing custom tasks reuse ServiceTask or UserTask. "Alt Akış" implies Sub Process. Standard BPMN has generic Call Activity. Let's stick to 'bpmn:ServiceTask' for consistency with other custom types unless user wanted specific behavior. Actually, for a Sub Process call, 'bpmn:CallActivity' is the standard. But standard bpmn-js might render it differently. Given the custom renderer overrides everything based on `data-task-type`, the base type matters less for visuals, but matters for properties. I will use 'bpmn:ServiceTask' to align with the current architecture where everything is a custom ServiceTask variants, or 'bpmn:CallActivity' if supported. Let's stick to 'bpmn:ServiceTask' to avoid complexities with standard behaviors of CallActivity unless forced.
    // WAIT. If I use bpmn:CallActivity, bpmn-js might expect calledElement property.
    // I'll use bpmn:ServiceTask and 'callActivity' as the key.
    icon: 'bpmn-icon-subprocess-expanded',
    wait: true, // Subprocesses usually wait
    outputs: '1',
    event: 'Hayır',
    color: '#3949ab'
  },
  {
    key: 'end',
    label: 'End',
    type: 'bpmn:EndEvent',
    icon: 'bpmn-icon-end-event-none',
    wait: false,
    outputs: '0',
    event: 'Hayır',
    color: '#ef4444'
  }
];
