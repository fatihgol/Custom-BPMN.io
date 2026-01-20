import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class CustomConnectionBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    // Context pad üzerinden başlayan bağlantı tamamlandığında isim ata
    this.postExecuted('connection.create', 999, (event) => {
      const { context } = event;
      const { connection, hints } = context;
      const label = hints?.label || context?.label;

      if (label && connection?.businessObject) {
        modeling.updateProperties(connection, { name: label });
      }
    });
  }
}

CustomConnectionBehavior.$inject = ['eventBus', 'modeling'];
