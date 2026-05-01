import ETransaction from "../../Domain/Entity/Transaction";

export class TransactionMapper {
  static toDTO(entity: ETransaction) {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      type: entity.type,
      createdAt: entity.createdAt,
    };
  }

  static toDTOList(entities: ETransaction[]) {
    return entities.map((entity) => this.toDTO(entity));
  }
}
