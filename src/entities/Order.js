class Order {
  constructor(orderObject) {
    this.orderNumber = orderObject.orderNumber;
    this.customer = orderObject.customer;
    this.totalOrderPrice = orderObject.totalOrderPrice;
    this.orderStatus = orderObject.orderStatus;
    this.orderProductsDescription = orderObject.orderProductsDescription;
    this.createdAt = orderObject.createdAt;
    this.updatedAt = orderObject.updatedAt;
  }

  getOrderNumber() {
    return this.orderNumber;
  }

  getCustomer() {
    return this.customer;
  }

  getTotalOrderPrice() {
    return this.totalOrderPrice;
  }

  getOrderStatus() {
    return this.orderStatus;
  }

  getOrderProductsDescription() {
    return this.orderProductsDescription;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getOrder() {
    return {
      orderNumber: this.orderNumber,
      customer: this.customer,
      totalOrderPrice: this.totalOrderPrice,
      orderStatus: this.orderStatus,
      orderProductsDescription: this.orderProductsDescription,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Order;