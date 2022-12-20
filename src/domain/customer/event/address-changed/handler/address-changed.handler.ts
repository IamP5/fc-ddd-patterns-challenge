import EventHandlerInterface from "../../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class AddressChangedHandler 
  implements EventHandlerInterface<AddressChangedEvent> 
{
  handle(event: AddressChangedEvent): void {
    const { id, name, address: { street, number, zip, city } } = event.eventData;

    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${street}, ${number}, ${city} ${zip}`); 
  }
}