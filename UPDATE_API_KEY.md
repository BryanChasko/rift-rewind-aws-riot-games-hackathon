# Update Riot API Key via CLI

## Command to Update SSM Parameter

```bash
aws ssm put-parameter \
  --name "/rift-rewind/riot-api-key" \
  --value "YOUR_RIOT_API_KEY_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile aerospaceug-admin
```

## Steps

1. **Get your API key** from https://developer.riotgames.com/
2. **Replace `YOUR_RIOT_API_KEY_HERE`** with your actual key
3. **Run the command** above

## Verify Update

```bash
aws ssm get-parameter \
  --name "/rift-rewind/riot-api-key" \
  --with-decryption \
  --profile aerospaceug-admin
```

## Test the API

```bash
# Test the Lambda function
curl "https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/?summoner=Doublelift"
```