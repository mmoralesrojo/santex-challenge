
# Santex Serverless Home Challenge

First of all, thanks a lot for the opportunity your time to review my code of the Serverless Home Challenge.


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
  aws configure --profile santex
```

You will be asked for the following input:

`AWS Access Key ID: <The Access Key ID you just created at the AWS Console>`

`AWS Secret Access Key: <The Secret Access key you got on acess key creation>`

`Default region name: us-east-1`

`Default output format: json`

After completing the above instructions you will be able to run the Serverless project locally using the serverless-offline plugin by running the following command

```bash
  npm start
```
## Deployment

To deploy this project in a AWS Stack you need to run the follwing

```bash
  npm run deploy
```
## Postman

You can access my public Postman collection to test this [here](https://elements.getpostman.com/redirect?entityId=6789712-fe1ab1dc-2c20-4075-ac43-97b3f3430631&entityType=collection)

## Authors

- [@mmoralesrojo](https://github.com/mmoralesrojo)
