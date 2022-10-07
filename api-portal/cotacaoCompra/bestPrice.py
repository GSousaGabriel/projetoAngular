def bestPrice(quotation):
    bestProduct=[]
    alreadyProcessed=[]

    for item in quotation['itens']:
        if item['productCode'] not in alreadyProcessed:
            alreadyProcessed.append(item['productCode'])
            bestProduct.append({'product': item['productCode'], 'bestId': item['id'], 'bestValue': float(fixValue(item['totalQuotation']))})
            
        else:
            for bestItem in bestProduct:

                if bestItem['product'] == item['productCode'] and bestItem['bestValue'] > float(fixValue(item['totalQuotation'])):
                    bestItem['bestValue']= item['totalQuotation']
                    bestItem['bestId']= item['id']
                    break
                
    for item in quotation['itens']:
        for bestItem in bestProduct:
            if bestItem['bestId'] == item['id']:
                item['bestValue']= 1
                break
        

    return quotation

def fixValue(value):
    value= value.replace('.','').replace(',','.')
    return value