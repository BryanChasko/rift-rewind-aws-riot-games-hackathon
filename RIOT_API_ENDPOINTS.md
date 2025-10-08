# Riot Games API Endpoints Available

## 🎮 Current Implementation Status: ✅ WORKING

Your Lambda function is now successfully retrieving live data from Riot Games API!

## 📊 Live Data Sources

### 1. **Data Dragon API** (Currently Working ✅)
- **Endpoint**: `https://ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/champion.json`
- **Data**: Live champion statistics, abilities, and metadata
- **No API Key Required**: Public endpoint
- **Current Output**: Champion names, attack damage, HP, movement speed

### 2. **Featured Games API** (Requires API Key)
- **Endpoint**: `https://na1.api.riotgames.com/lol/spectator/v5/featured-games`
- **Data**: Currently live games being spectated
- **Status**: Implemented but may require special permissions

### 3. **Champion Mastery API** (Requires API Key)
- **Endpoint**: `https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{summonerId}`
- **Data**: Player champion mastery levels and points
- **Status**: Implemented with fallback for multiple regions

### 4. **League Entries API** (Requires API Key)
- **Endpoint**: `https://{region}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`
- **Data**: Challenger/Grandmaster league rankings
- **Status**: Implemented with multiple region support

## 🔧 Available Riot API Endpoints (For Future Enhancement)

### Match Data
- **Match History**: `/lol/match/v5/matches/by-puuid/{puuid}/ids`
- **Match Details**: `/lol/match/v5/matches/{matchId}`
- **Match Timeline**: `/lol/match/v5/matches/{matchId}/timeline`

### Summoner Data
- **By Name**: `/lol/summoner/v4/summoners/by-name/{summonerName}`
- **By Account**: `/lol/summoner/v4/summoners/by-account/{encryptedAccountId}`
- **By PUUID**: `/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`

### Live Game Data
- **Current Game**: `/lol/spectator/v5/active-games/by-summoner/{encryptedSummonerId}`
- **Featured Games**: `/lol/spectator/v5/featured-games`

### League/Ranking Data
- **Challenger**: `/lol/league/v4/challengerleagues/by-queue/{queue}`
- **Grandmaster**: `/lol/league/v4/grandmasterleagues/by-queue/{queue}`
- **Master**: `/lol/league/v4/masterleagues/by-queue/{queue}`
- **League Entries**: `/lol/league/v4/entries/{queue}/{tier}/{division}`

## 🌍 Supported Regions
- **NA1**: North America
- **EUW1**: Europe West
- **EUN1**: Europe Nordic & East
- **KR**: Korea
- **BR1**: Brazil
- **LA1**: Latin America North
- **LA2**: Latin America South
- **OC1**: Oceania
- **RU**: Russia
- **TR1**: Turkey
- **JP1**: Japan

## 🔑 API Key Setup
Your API key is stored securely in AWS SSM Parameter Store:
```bash
aws ssm put-parameter \
  --name "/rift-rewind/riot-api-key" \
  --value "YOUR_RIOT_API_KEY_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile aerospaceug-admin
```

## 📈 Current Data Flow
```
Frontend (React) → AWS Lambda → Riot Games API → Live Data Display
```

## 🎯 Next Steps for More Live Data

1. **Get Personal API Key**: Visit https://developer.riotgames.com/
2. **Request Production Key**: For higher rate limits
3. **Add More Endpoints**: Implement match history, live games, etc.
4. **Real-time Updates**: Add WebSocket support for live match updates

## 🚀 Test Your Live Data
```bash
curl "https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/"
```

Your implementation is working great! The Lambda function successfully retrieves live champion data from Riot's Data Dragon API and displays it in your React frontend.