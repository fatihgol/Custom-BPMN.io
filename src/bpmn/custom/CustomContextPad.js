import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { taskTypes } from '../taskTypes';

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

export default class CustomContextPad extends ContextPadProvider {
  constructor(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate, bpmnFactory) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);

    this.connect = connect;
    this.translate = translate;
    this.bpmnFactory = bpmnFactory;
    this.elementFactory = elementFactory;
    this.create = create;
  }

  getContextPadEntries(element) {
    const actions = super.getContextPadEntries(element);

    // Remove immutable default append actions to replace with ours
    const keysToRemove = [
      'append.end-event',
      'append.gateway',
      'append.append-task',
      'append.intermediate-event',
      'append.text-annotation'
    ];
    keysToRemove.forEach(key => delete actions[key]);

    // Check for custom outputs logic - use SINGLE connect button with queue
    if (this._isTask(element)) {
      const events = this._getOutputs(element.businessObject);

      if (events && events.length > 0) {
        // Remove standard Connect
        delete actions.connect;

        // Get next available event from queue
        const nextEvent = this._getNextAvailableEvent(element, events);

        if (nextEvent) {
          const eventName = typeof nextEvent === 'string' ? nextEvent : nextEvent.name;

          // Add SINGLE connect button that uses next event in queue
          actions['connect.next'] = {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: this.translate(`Connect: ${eventName}`),
            action: {
              click: (clickEvent) => this._startConnect(clickEvent, element, nextEvent),
              dragstart: (dragEvent) => this._startConnect(dragEvent, element, nextEvent)
            }
          };
        }
        // If nextEvent is null, no connect button shown (all events used)

        // We do NOT add append tasks here because user flow is strictly controlled by outputs
        return actions;
      }
    }

    // If NO custom outputs (or not a task), show rich palette items
    taskTypes.forEach((task) => {
      // Don't show start event in context pad
      if (task.key === 'start') return;

      const svgPreview = PALETTE_ICONS[task.key];
      const imageUrl = svgPreview ? toDataUrl(svgPreview) : undefined;

      actions[`append.${task.key}`] = {
        group: 'model',
        className: `custom-context ${task.key}`,
        imageUrl,
        title: this.translate(`${task.label} Ekle`),
        action: {
          click: (event) => this._appendTask(event, element, task),
          dragstart: (event) => this._appendTask(event, element, task)
        }
      };
    });

    return actions;
  }

  _appendTask(event, element, task) {
    const bo = this.bpmnFactory.create(task.type);
    bo.set('data-task-type', task.key);
    bo.name = task.label;

    const shape = this.elementFactory.createShape({
      type: task.type,
      businessObject: bo
    });

    this.create.start(event, shape, element);
  }

  _startConnect(event, element, eventData) {
    // Store event metadata temporarily for use in CustomConnectionBehavior
    // We can't pass custom properties directly to connect.start() as it breaks the preview

    // Only pass the label to avoid breaking connection preview
    const label = typeof eventData === 'string' ? eventData : eventData.name;

    if (typeof eventData === 'object' && eventData.color) {
      // Store metadata on the element temporarily so CustomConnectionBehavior can access it
      element._pendingEventMetadata = {
        label: label, // Critical: pass label here for CustomConnectionBehavior
        eventKey: eventData.key,
        eventIcon: eventData.icon,
        eventColor: eventData.color
      };
    } else if (typeof eventData === 'string') {
      element._pendingEventMetadata = {
        label: eventData
      };
    }

    // Call connect.start without hints to avoid SVG path errors
    this.connect.start(event, element);
  }

  _getUsedEvents(element) {
    // Get all outgoing connections from this element
    const outgoing = element.outgoing || [];
    const usedEventKeys = [];

    outgoing.forEach(connection => {
      const eventKey = connection.businessObject.get?.('data-event-key') ||
        connection.businessObject.$attrs?.['data-event-key'];
      if (eventKey) {
        usedEventKeys.push(eventKey);
      }
    });

    return usedEventKeys;
  }

  _switchConnectionEvent(connection, newEvent) {
    const modeling = this.modeling || this.injector.get('modeling');
    const canvas = this.canvas || this.injector.get('canvas');

    const eventName = typeof newEvent === 'string' ? newEvent : newEvent.name;
    const eventKey = typeof newEvent === 'string' ? newEvent : newEvent.key;
    const eventColor = typeof newEvent === 'object' ? newEvent.color : null;
    const eventIcon = typeof newEvent === 'object' ? newEvent.icon : null;

    const props = {
      name: eventName,
      'data-event-key': eventKey
    };

    if (eventIcon) {
      props['data-event-icon'] = eventIcon;
    }

    if (eventColor) {
      props['data-event-color'] = eventColor;

      // Update DI color
      const di = connection.di;
      if (di) {
        di.set('stroke', eventColor);
      }
    }

    modeling.updateProperties(connection, props);

    // Force visual update
    if (eventColor) {
      const gfx = canvas.getGraphics(connection);
      if (gfx) {
        const path = gfx.querySelector('path');
        if (path) {
          path.setAttribute('stroke', eventColor);
        }
      }
    }
  }

  _getNextAvailableEvent(element, events) {
    // Get already used events
    const usedEvents = this._getUsedEvents(element);

    // Find first unused event (queue mechanism)
    for (const event of events) {
      const eventKey = typeof event === 'string' ? event : event.key;
      if (!usedEvents.includes(eventKey)) {
        return event;
      }
    }

    // All events used, return null
    return null;
  }

  _isTask(element) {
    return isAny(element, ['bpmn:Task', 'bpmn:UserTask', 'bpmn:ServiceTask', 'bpmn:SendTask', 'bpmn:ExclusiveGateway']);
  }

  _getOutputs(bo) {
    const raw = bo?.customOutputEvents || bo?.$attrs?.customOutputEvents;

    // Check if this is a UserTask or UserGroupTask (based on attributes or type)
    const isUserTask = bo && (
      bo.$type === 'bpmn:UserTask' ||
      (bo.$attrs && bo.$attrs['data-task-type'] === 'userTask')
    );
    const isUserGroupTask = bo && (
      (bo.$attrs && bo.$attrs['data-task-type'] === 'userGroupTask')
    );

    if (raw) {
      if (Array.isArray(raw) && raw.length > 0) return raw;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        // Fallthrough to defaults if parse fails
      }
    }

    // Return default events for UserTask and UserGroupTask if no custom events found
    if (isUserTask || isUserGroupTask) {
      return [
        { name: 'Onayla', key: 'approve', icon: 'check', color: '#10b981' },
        { name: 'Reddet', key: 'reject', icon: 'times', color: '#ef4444' }
      ];
    }

    return null;
  }
}

CustomContextPad.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
  'bpmnFactory'
];
