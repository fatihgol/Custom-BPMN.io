import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class CustomConnectionBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, canvas) {
    super(eventBus);

    // Context pad üzerinden başlayan bağlantı tamamlandığında metadata ata
    this.postExecuted('connection.create', 999, (event) => {
      const { context } = event;
      const { connection, source } = context;

      // Check if source element has pending event metadata
      const eventMetadata = source?._pendingEventMetadata;

      if (eventMetadata && connection?.businessObject) {
        const props = {};

        // Set label/name
        if (eventMetadata.label) {
          props.name = eventMetadata.label;
        }

        // Set connection type as 'event'
        props['data-connection-type'] = 'event';

        // Store metadata as custom attributes
        if (eventMetadata.eventKey) {
          props['data-event-key'] = eventMetadata.eventKey;
        }
        if (eventMetadata.eventIcon) {
          props['data-event-icon'] = eventMetadata.eventIcon;
        }
        if (eventMetadata.eventColor) {
          props['data-event-color'] = eventMetadata.eventColor;

          // Apply color to the DI (diagram interchange) element for visual rendering
          const di = connection.di;
          if (di) {
            di.set('stroke', eventMetadata.eventColor);
          }
        }

        // Clean up temporary metadata
        delete source._pendingEventMetadata;

        modeling.updateProperties(connection, props);

        // Force visual update to apply color immediately
        if (eventMetadata.eventColor) {
          const gfx = canvas.getGraphics(connection);
          if (gfx) {
            const path = gfx.querySelector('path');
            if (path) {
              path.setAttribute('stroke', eventMetadata.eventColor);
            }
          }
        }
      }
    });
  }
}

CustomConnectionBehavior.$inject = ['eventBus', 'modeling', 'canvas'];
