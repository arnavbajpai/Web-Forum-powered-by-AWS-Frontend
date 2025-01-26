# Web Forum Powered by AWS: Frontend

This repository is the React TS implementation of the web frontend for the [Web Forum Powered by AWS](https://github.com/arnavbajpai/Common-Repository-for-Web-Forum-Project) Project. The project can be deployed locally but requires a Cognito user pool to be set up on AWS as per instructions provided. It also requires a functioning backend API and database (deployed locally or on AWS) for testing.   

## Related Repositories
- [Common Repository](https://github.com/arnavbajpai/Common-Repository-for-Web-Forum-Project): Parent repository containing overview and architecture for the overall project.  
- [Backend Repository](https://github.com/arnavbajpai/Web-Forum-powered-by-AWS-Backend-REST-API): Go based REST API deployed as Lambda function and exposed via AWS API Gateway.  
- [Database Repository](https://github.com/arnavbajpai/Web-Forum-powered-by-AWS-Database): Built on MySQL, hosted on AWS RDS.

## Deployment

### Local
The React app can be deployed locally but relies on Amazon Cognito for user authentication. It can be tested locally, however, there are some limitations to local testing as noted below. 
- Step 1: Download and Install node and npm: https://nodejs.org/en/download
- Step 2. Clone the Repository. 
- Step 3. Open your terminal and navigate to the directory containing your cloned project.
- Step 4. Run `yarn install`. 
- Step 5: Run `yarn start`. The web application will start on localhost:3000. 
Note:- 
1. The application uses AWS Cognito to perform authentication using ID providers such as Google. For this to work for a local deployment the redirectURI in Cognito User Pool needs to be set as: localhost:3000/callback. 
2. The local deployement of frontend can work with local or AWS deployment of backend. However, the testing limitation mentioned [here](https://github.com/arnavbajpai/Web-Forum-powered-by-AWS-Backend-REST-API#Local) for local backend applies.  

### AWS 
- Step 1: Follow the first 4 steps similar to local deployment. Then Run `npm run build`. This will create a dist directory. 
- Step 2: In the search bar at the top of your AWS Console, type “S3” and go to the S3 service. 
- Step 3: Select “Create a bucket”, provide unique name. Select default settings and click “Create bucket” at bottom. 
- Step 4: Go to the newly created bucket and upload the two files and one folder created inside the dist folder in step 1. 
- Step 5: In the search bar at the top of your AWS Console, type “CloudFront” and go to the service. Click “Create Distribution”. Under origin settings, select the S3 bucket you just created. Create the distribution. It will take some time to deploy. 
- Step 6: Go back to S3 service and the bucket you created and update its bucket policy to allow access to CloudFront service. Under Condition, you should include: 
"StringEquals": { 
        "AWS:SourceArn": "arn:aws:cloudfront::<distribution-id>" 
}
- Step 7: Once the CloudFront distribution is deployed navigate to the CloudFront dashboard and copy the distribution domain name. Use this domain name to access the app over HTTPS. 
Note:- For more detailed instructions access the   Frontend Repository .

Congnito Set up: To be added. 


