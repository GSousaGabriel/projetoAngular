import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
import bleach

def fixDate(date):
   date = date.split('-')
   return  date[2]+"/"+date[1]+"/"+date[0]
   
def sendEmail(username, to_emails, msg_str):
   try:
      indexEmail= 0 
      while(indexEmail<len(to_emails)):
         to_emails[indexEmail]=to_emails[indexEmail].strip()
         indexEmail+=1
         
      server = smtplib.SMTP(host='smtp.office365.com', port=587)
      server.ehlo()
      server.starttls()
      server.login(username, 'LPMBFO3uL1NX!Mygm6*G')
      # server=smtplib.SMTP(host='[sidi-org-br.mail.protection.outlook.com]',port=25)
      # server.ehlo()
      server.sendmail(username, 'pasteu008@gmail.com', msg_str)
      # server.sendmail(username, 'd.braga@sidi.org.br' ,msg_str)
      server.close()
   except Exception as error:
      print(error)

def setupEmail(data,subject='envio de email',from_email='',to_emails=[], type='', idSupplier=''):
   username='noreply@sidi.org.br'
   msg=MIMEMultipart('alternative')
   msg['From']=from_email
   msg['To']=", ".join(to_emails)
   msg['Subject']=subject
   msg['Cc'] = 'compras@sidi.org.br'
   #msg['Reply-to'] = 'compras@sidi.org.br'
   
   if type == 'resetPass':
         
      html_part = render_to_string('email/emailResetPass.html', {'password': data})
      msg.attach(MIMEText(html_part, 'html'))
      msg_str=msg.as_string()
      sendEmail(username, to_emails, msg_str)
   
   if type == 'supplier':
      if len(data['document']) == 14:
         document = 'CNPJ'
      else:
         document = 'CPF'
         
      html_part = render_to_string('email/emailSupplier.html', {'supplierId': bleach.clean(str(data['id'])), 'documentType': document, 'document': data['document'], 'fantasyName':data['fantasyName'], 'socialName': data['socialName']})
      msg.attach(MIMEText(html_part, 'html'))
      msg_str=msg.as_string()
      sendEmail(username, to_emails, msg_str)
         
   elif type == 'quotation':
      supplierItens = []
      supplierIncluded = []
      issueDate = fixDate(data['issueDate'])
      quotation = data['cotacaoId']
      buyer= data['buyer'][0]['name']
      
      for item in data['itens']:
         if item['supplierId']['id'] not in supplierIncluded:
            supplierItens.append({
               'supplierId': item['supplierId']['id'],
               'socialName': item['supplierId']['socialName'],
               'email': item['supplierId']['email'],
               'itens':[{
                  'product': item['product'],
                  'quantity': item['quantity'],
                  'unit': item['unit'],
                  'necessityDate': fixDate(item['necessityDate']),
                  'observation': item['observation']
               }]
            })
            supplierIncluded.append(item['supplierId']['id'])
         
         else: 
            for supplier in supplierItens and item['approve'] == 4:
               if supplier['supplierId'] == item['supplierId']['id']:
                  supplier['itens'].append({
                     'product': item['product'],
                     'quantity': item['quantity'],
                     'unit': item['unit'],
                     'necessityDate': fixDate(item['necessityDate']),
                     'observation': item['observation']
                  })
                  break
                  
      for supplier in supplierItens:
         itens = ''
         count = 1
         
         for item in supplier['itens']:           
            itens += '<tr><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="068"><b>'+str(count)+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="331"><b>'+item['product']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="120" align="right"><b>'+item['quantity']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="068" align="center"><b>'+item['unit']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['necessityDate']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['observation']+'</b></td></tr>'    
            count += 1
            
         html_part = render_to_string('email/emailQuotation.html', {'type': type, 'cotacaoId': quotation, 'issueDate': issueDate, 'buyer': buyer, 'fornCod':supplier['supplierId'], 'fornNome': supplier['socialName'], 'itens': mark_safe(itens)})
         msg.attach(MIMEText(html_part, 'html'))
         msg_str=msg.as_string()
         sendEmail(username, [supplier['email']], msg_str)
   
   elif type == 'quotationAnswer' or type== 'returnQuotation':
      itens = ''
      count = 1
      
      for item in data['itens']:
         if type== 'returnQuotation':
            idSupplier= item['supplierId']['id']
         
         if int(idSupplier) == item['supplierId']['id']:
            itens += '<tr><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="068"><b>'+str(count)+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="331"><b>'+item['product']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="120" align="right"><b>'+item['quantity']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="120" align="right"><b>'+item['quotationQuantity']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['unitValue']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['valueIPI']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+str(item['valueICMS'])+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['totalQuotation']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="23" width="068" align="center"><b>'+item['unit']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+fixDate(item['necessityDate'])+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+fixDate(item['validDate'])+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['observation']+'</b></td><td class="TableRowWhiteMini2" bgcolor="#ffffff" height="19" width="117" align="center" bordercolor="#ffffff"><b>'+item['observationSupplier']+'</b></td></tr>'    
            count += 1
         
      html_part = render_to_string('email/emailQuotation.html', {'type': type, 'cotacaoId': data['cotacaoId'], 'issueDate': fixDate(data['issueDate']), 'buyer': data['buyer'][0]['name'], 'fornCod':data['itens'][0]['supplierId']['id'], 'fornNome': data['itens'][0]['supplierId']['socialName'], 'itens': mark_safe(itens)})
      msg.attach(MIMEText(html_part, 'html'))
      msg_str=msg.as_string()
      sendEmail(username, to_emails, msg_str)
      
   elif type == 'supplierChange':
      
      html_part = render_to_string('email/supplierChange.html', {'data': data, 'document': data[0]['document'], 'name': data[0]['name']})
      msg.attach(MIMEText(html_part, 'html'))
      msg_str=msg.as_string()
      sendEmail(username, to_emails, msg_str)
      
   elif type == 'invitePortal':
      
      html_part = render_to_string('email/invitePortal.html')
      msg.attach(MIMEText(html_part, 'html'))
      msg_str=msg.as_string()
      sendEmail(username, to_emails, msg_str)