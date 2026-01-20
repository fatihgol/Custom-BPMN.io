import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class CustomConnectionDoubleClick extends CommandInterceptor {
    constructor(eventBus, modeling, canvas, elementRegistry) {
        super(eventBus);

        this.modeling = modeling;
        this.canvas = canvas;
        this.elementRegistry = elementRegistry;

        // Listen for double-click on connections
        eventBus.on('element.dblclick', 1500, (event) => {
            const element = event.element;

            // Only handle connections with event metadata AND correct type
            if (element.type === 'bpmn:SequenceFlow' && element.source) {
                const connectionType = element.businessObject.get?.('data-connection-type') ||
                    element.businessObject.$attrs?.['data-connection-type'];
                const eventKey = element.businessObject.get?.('data-event-key') ||
                    element.businessObject.$attrs?.['data-event-key'];

                // Check both eventKey AND connection type
                if (eventKey && connectionType === 'event') {
                    event.preventDefault();
                    event.stopPropagation();
                    this._showEventSwitchPopup(element);
                    return false;
                }
            }
        });
    }

    _showEventSwitchPopup(connection) {
        const source = connection.source;
        const events = this._getOutputs(source.businessObject);

        if (!events || events.length === 0) return;

        const currentEventKey = connection.businessObject.get?.('data-event-key') ||
            connection.businessObject.$attrs?.['data-event-key'];

        // Create popup HTML
        const popup = document.createElement('div');
        popup.className = 'event-switch-popup';
        popup.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 8px;
      z-index: 1000;
      min-width: 150px;
    `;

        // Add title
        const title = document.createElement('div');
        title.textContent = 'Event Seç';
        title.style.cssText = 'padding: 8px; font-weight: 600; border-bottom: 1px solid #e2e8f0; margin-bottom: 4px;';
        popup.appendChild(title);

        // Add event options
        events.forEach(event => {
            const eventName = typeof event === 'string' ? event : event.name;
            const eventKey = typeof event === 'string' ? event : event.key;
            const eventColor = typeof event === 'object' ? event.color : '#94a3b8';

            const option = document.createElement('div');
            option.className = 'event-option';
            option.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        ${eventKey === currentEventKey ? 'background: #f1f5f9; font-weight: 600;' : ''}
      `;

            // Color indicator
            const colorDot = document.createElement('span');
            colorDot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${eventColor};
        display: inline-block;
      `;
            option.appendChild(colorDot);

            // Event name
            const nameSpan = document.createElement('span');
            nameSpan.textContent = eventName;
            option.appendChild(nameSpan);

            // Hover effect
            option.addEventListener('mouseenter', () => {
                if (eventKey !== currentEventKey) {
                    option.style.background = '#f8fafc';
                }
            });
            option.addEventListener('mouseleave', () => {
                if (eventKey !== currentEventKey) {
                    option.style.background = '';
                }
            });

            // Click handler
            option.addEventListener('click', () => {
                if (eventKey !== currentEventKey) {
                    this._switchEvent(connection, event, source);
                }
                document.body.removeChild(popup);
            });

            popup.appendChild(option);
        });

        // Position popup near mouse
        const rect = this.canvas.getContainer().getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2 - 75}px`;
        popup.style.top = `${rect.top + rect.height / 2 - 50}px`;

        // Add to body
        document.body.appendChild(popup);

        // Close on outside click
        const closeHandler = (e) => {
            if (!popup.contains(e.target)) {
                document.body.removeChild(popup);
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
    }

    _switchEvent(connection, newEvent, source) {
        const eventName = typeof newEvent === 'string' ? newEvent : newEvent.name;
        const eventKey = typeof newEvent === 'string' ? newEvent : newEvent.key;
        const eventColor = typeof newEvent === 'object' ? newEvent.color : null;
        const eventIcon = typeof newEvent === 'object' ? newEvent.icon : null;

        // Check if another connection is using this event - if so, remove it
        const outgoing = source.outgoing || [];
        outgoing.forEach(conn => {
            if (conn.id !== connection.id) {
                const connEventKey = conn.businessObject.get?.('data-event-key') ||
                    conn.businessObject.$attrs?.['data-event-key'];
                if (connEventKey === eventKey) {
                    // Remove the old connection using this event
                    this.modeling.removeConnection(conn);
                }
            }
        });

        // Update current connection with new event
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

        this.modeling.updateProperties(connection, props);

        // Force visual update
        if (eventColor) {
            const gfx = this.canvas.getGraphics(connection);
            if (gfx) {
                const path = gfx.querySelector('path');
                if (path) {
                    path.setAttribute('stroke', eventColor);
                }
            }
        }
    }

    _getOutputs(bo) {
        const raw = bo?.customOutputEvents || bo?.$attrs?.customOutputEvents;
        if (!raw) return null;
        if (Array.isArray(raw)) return raw;
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (err) {
            return null;
        }
    }
}

CustomConnectionDoubleClick.$inject = ['eventBus', 'modeling', 'canvas', 'elementRegistry'];
