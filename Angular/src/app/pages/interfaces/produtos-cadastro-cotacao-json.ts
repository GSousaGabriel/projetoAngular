export interface ModeloProduto{
    [x: string]: any;
    id: number,
    productCode: number,
    product: string,
    quotationId: number,
    userId: number,
    supplierId: string,
    quotationQuantity: string,
    unit: string,
    quantity: string,
    observation: string,
    validDate: string,
    necessityDate: string,
    valueIPI: string,
    unitValue: string,
    totalQuotation: number
}