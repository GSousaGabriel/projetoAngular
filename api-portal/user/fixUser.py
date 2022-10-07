def fixUser(user, data, type):
    if type == 'quotation':
        data['buyer'] = user
        
    elif type == 'order':
        data['requester'] = user
        
    return data