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
