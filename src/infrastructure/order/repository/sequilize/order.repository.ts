import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    OrderItemModel.findAll({ where: { order_id: entity.id } }).then((orderItems) => {
      entity.items.forEach((item) => {
        if (!orderItems.find(orderItem => orderItem.id === item.id)) {
          OrderItemModel.create({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
          })
        }
      });
    });

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: { id: entity.id },
      },
    );
  }
  
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(orderItem => new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        orderItem.product_id,
        orderItem.quantity
      ))
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map(orderModel => new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(orderItem => new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        orderItem.product_id,
        orderItem.quantity
      ))
    ));
  }
}
