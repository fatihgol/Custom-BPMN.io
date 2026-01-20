import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class CustomConnectionBehavior extends CommandInterceptor {
  constructor(eventBus, modeling, canvas) {
    super(eventBus);

    // Context pad üzerinden başlayan bağlantı tamamlandığında metadata ata
    this.postExecuted('connection.create', 999, (event) => {
      const { context } = event;
      const { connection, hints } = context;
      const label = hints?.label || context?.label;

      if (label && connection?.businessObject) {
        const props = { name: label };

        // If we have event metadata, store it as custom attributes
        if (hints?.eventKey) {
          props['data-event-key'] = hints.eventKey;
        }
        if (hints?.eventIcon) {
          props['data-event-icon'] = hints.eventIcon;
        }
        if (hints?.eventColor) {
          props['data-event-color'] = hints.eventColor;

          // Apply color to the DI (diagram interchange) element for visual rendering
          const di = connection.di;
          if (di) {
            di.set('stroke', hints.eventColor);
          }
        }

        modeling.updateProperties(connection, props);

        // Force visual update to apply color immediately
        if (hints?.eventColor) {
          const gfx = canvas.getGraphics(connection);
          if (gfx) {
            const path = gfx.querySelector('path');
            if (path) {
              path.setAttribute('stroke', hints.eventColor);
            }
          }
        }
      }
    });
  }
}

CustomConnectionBehavior.$inject = ['eventBus', 'modeling', 'canvas'];
