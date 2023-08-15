import boto3
import json

def lambda_handler(event, context):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='YOUR_SECRET_NAME')
    
    if 'SecretString' in response:
        secret = response['SecretString']
        secret_dict = json.loads(secret)
        api_key = secret_dict['API_KEY']
    # rest of your code
