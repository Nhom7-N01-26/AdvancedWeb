export abstract class CollectionService<T extends { id?: number }> {
  private readonly records: T[] = [];
  private nextId = 1;

  findAll(): T[] {
    return this.records;
  }

  findOne(id: number): T | undefined {
    return this.records.find((record) => record.id === id);
  }

  create(input: Omit<T, 'id'>): T {
    const record = { ...input, id: this.nextId++ } as T;
    this.records.push(record);
    return record;
  }
}