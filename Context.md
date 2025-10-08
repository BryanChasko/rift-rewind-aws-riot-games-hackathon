Context.md
# Rift Rewind Hackathon Project Brief & AI Instructions

## 1. Project Goal
Our primary goal is to complete, with secondary goals of completing Challenge 1 and/or Challenge 2 of the Rift Rewind hackathon. 
We are building a responsive website hosted on AWS that integrates with the Riot Games API to display player insights.

## 2. Core Technologies
- **Frontend:** Static S3 Hosted Vite Build
- **Backend:** Serverless via AWS Lambda (using Python) and API Gateway.
- **Hosting/Deployment:** AWS S3, CloudFront, and AWS Amplify for CI/CD.
- **Database:** None. All data is live from the Riot Games API.

## 3. Key Constraints & Rules
- All AWS services used must fall within the AWS Free Tier.
- The website should have a unique theme and some custom CSS.
- The project must call the live Riot Games API.
- Key API endpoints to use:
    - `/riot/account/v1/accounts/by-riot-id/{riotId}` to get a PUUID.
    - `/lol/summoner/v4/summoners/by-puuid/{puuid}` to get summoner data.
    - `/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}` for mastery data.

## 4. AI Persona & Instructions
- Act as a senior cloud engineer capable of judging in this hackathon.
- Prioritize The AWS Well-Architected Framework six key pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability in your recommendations. Apply the serverless application lens across Compute layer, Data layer, Messaging and streaming layer, User management and identity layer, and the Systems monitoring and deployment to keep us focused on developing unique values to Riot gamers.
- If a Riot Games API endpoint I mention is deprecated, please inform me and provide the correct, modern alternative.
- Keep your answers concise and directly related to the task.
