
from cloudant.client import Cloudant
from cloudant.error import CloudantException
from cloudant.result import Result, ResultByKey
import json
import os
import base64

ACCOUNT_NAME = "47b4e133-47f2-4e95-b012-c07107ec01da-bluemix"
API_KEY = "2mD3NMnP8QpKWp35HD22tpU7ekkYPynE6LNrNvf7EMMo"
serviceURL = "https://47b4e133-47f2-4e95-b012-c07107ec01da-bluemix.cloudantnosqldb.appdomain.cloud/"
endpointURL = "https://47b4e133-47f2-4e95-b012-c07107ec01da-bluemix.cloudant.com/"
DB_NAME = "ivo"

# CONNECT TO CREATE DATABASE
client = Cloudant.iam(ACCOUNT_NAME, API_KEY, connect=True)
client.connect()
database = client.create_database(DB_NAME)
if database.exists():
    print("'{0}' found\n".format(DB_NAME))

'''
dataPath = 'public/json/cleanData.json' #just one item as test
filePath = '../../Desktop/audio/'
fileList = os.listdir(filePath)

def blobber(f):
    with open((filePath + f), "rb") as file:
        blob = base64.b64encode(file.read()).decode('utf-8')
        blob = str(blob)
        return blob

# open JSON data file
with open(dataPath, 'r') as importData:
    importData = importData.read()
    importData = json.loads(importData)

#OPEN DATA n AUDIO FILES MATCH THEM AND UPLOAD THEM
list = []
for f in fileList:
    for d in importData:
        if d['_id'] in f or d['file1id'] in f or d['file2id'] in f or f in d['name']:
            
            #convert file
            baseFile = blobber(f)
            filename = str(f)
            
            # create doc
            doc = {
                "_id": d['_id'],
                "text": d['text'],
                "size": d['size'],
                "createdAt": d['createdAt'],
                "_attachments": {
                    filename: {
                        "content_type": "audio/x-wav",
                        "data": baseFile
                    }
                }
            }

            newDoc = database.create_document(doc)
            # if newDoc.exists():
            #     list.append(newDoc.id)
            #     print(newDoc.id)

# with open('idList.txt', 'a') as idList:
#     idList.write(str(list))

# print(len(list))
'''

'''
# PUT ITEMS IN
 for doc in cleanData:
    newDoc = database.create_document(doc)
    if newDoc.exists():
        print("Document {'0'} successfully created".format(number))
'''


# GET ITEMS OUT
results = Result(database.all_docs, include_docs=True)
back = []
for i in results: 
    b = json.loads(results[i])
    print(b)
    # back.append(b)
# print(back)

# with open('backup.json', 'a') as backupFile:
    # for each i in len(results)-1):
    # [backupFile.write(str(results[i])) for i in results]
# print("retrieved minimal from: \n{0}\n".format(results[0]))

'''
# GET DATA DIRECTLY FROM ENDPOINT
end_point = '{0}/{1}'.format(endpointURL, DB_NAME + "/_all_docs")
params = {'include_docs': 'true'}
response = client.r_session.get(end_point, params=params)
print("{0}\n".format(response.json()))
'''


'''
# later
for filename in audio:
    find entry in cleanData.json where name == filename:
    create new DB entry with entry from json
    upload filename to it
'''