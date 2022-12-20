import AddressChangedEvent from "../../customer/event/address-changed/address-changed.event";
import AddressChangedHandler from "../../customer/event/address-changed/handler/address-changed.handler";
import CustomerCreatedEvent from "../../customer/event/customer-created/customer-created.event";
import CustomerCreatedHandler from "../../customer/event/customer-created/handler/customer-created.handler";
import CustomerCreatedHandler2 from "../../customer/event/customer-created/handler/customer-created2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const emailHandler = new SendEmailWhenProductIsCreatedHandler();
    const customerCreatedHandler = new CustomerCreatedHandler();
    const customerCreatedHandler2 = new CustomerCreatedHandler2();
    const addressChangedHandler = new AddressChangedHandler();

    const spyEmailHandler = jest.spyOn(emailHandler, "handle");
    const spyCustomerCreatedHandler = jest.spyOn(customerCreatedHandler, "handle");
    const spyCustomerCreatedHandler2 = jest.spyOn(customerCreatedHandler2, "handle");
    const spyAddressChangedHandler = jest.spyOn(addressChangedHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", emailHandler);
    eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler2);
    eventDispatcher.register("AddressChangedEvent", addressChangedHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(emailHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerCreatedHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(customerCreatedHandler2);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(addressChangedHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      email: "customer1@email.com",
    });

    const addressChangedEvent = new AddressChangedEvent({
      id: "1",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "12345-678",
        city: "City 1",
      }
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(addressChangedEvent);

    expect(spyEmailHandler).toHaveBeenCalledWith(productCreatedEvent);
    expect(spyCustomerCreatedHandler).toHaveBeenCalledWith(customerCreatedEvent);
    expect(spyCustomerCreatedHandler2).toHaveBeenCalledWith(customerCreatedEvent);
    expect(spyAddressChangedHandler).toHaveBeenCalledWith(addressChangedEvent);
  });
});
