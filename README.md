
# Santex Serverless Home Challenge

First of all, thanks a lot for the opportunity and your time to review my code of the Serverless Home Challenge.


## Installation

For the installation we will be using node 18.x and aws-sdk v3. You can switch to a node 18.x version using [nvm](https://github.com/nvm-sh/nvm).

Please follow the below steps for installaton

After clone the project run the following command in the root folder

```bash
  npm install
```

Next we will need configure access key and secret for AWS account, you will need to create an aws_access_key_id and aws_secret_access_key in your AWS console. You can check the following [documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey).

Having your aws_access_key_id and aws_secret_access_key you will need to configure them in a AWS profile. For that run the following in a terminal

```bash
  aws configure
```

You will be asked for the following input:

`AWS Access Key ID: <The Access Key ID you just created at the AWS Console>`

`AWS Secret Access Key: <The Secret Access key you got on acess key creation>`

`Default region name: us-east-1`

`Default output format: json`

## Deployment

For deployment in AWS you need to do changes and test with AWS url run the following again

```bash
  npm run deploy
```

## Serverless offline

After deployment you can test the endpoints locally by running the following

```bash
  npm start
```

## Testing

Documentation in serverless.yaml has been added and it can be exported through AWS API Gateway Service and import it to [online swagger editor](https://editor.swagger.io/)

However I already prepared a swagger documentation with the exported file from AWS API Gateway Service and you can find it [here](https://editor.swagger.io/?url=https://swagger-santex.s3.amazonaws.com/dev-santex-challenge-dev-swagger.json)

Also you can access my public Postman collection for this challenge [here](https://elements.getpostman.com/redirect?entityId=6789712-fe1ab1dc-2c20-4075-ac43-97b3f3430631&entityType=collection)

## Authors

- [@mmoralesrojo](https://github.com/mmoralesrojo)
