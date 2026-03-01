const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');

class AIService {
  constructor() {
    this.apiKey = config.groq.apiKey;
    this.model = config.groq.model;
    this.baseUrl = config.groq.baseUrl;
  }

  async analyzeContract(contractText) {
    const prompt = `You are a legal contract analyst AI. Analyze the following contract and provide:

1. **Summary**: A concise summary of the contract (2-3 paragraphs) covering:
   - Type of contract
   - Parties involved
   - Key terms and obligations
   - Duration/timeline

2. **Risk Clauses**: Identify and explain any potentially risky or concerning clauses, including:
   - Liability limitations
   - Indemnification clauses
   - Termination conditions
   - Non-compete clauses
   - Automatic renewals
   - Hidden fees or penalties
   - Unfavorable dispute resolution terms

Format your response as JSON with the following structure:
{
  "summary": "Your detailed summary here",
  "riskClauses": [
    {
      "clause": "Name/type of the clause",
      "excerpt": "Brief quote from the contract",
      "risk": "Explanation of the risk",
      "severity": "low|medium|high"
    }
  ],
  "overallRiskLevel": "low|medium|high",
  "recommendations": ["List of recommendations"]
}

CONTRACT TEXT:
${contractText}

Respond ONLY with valid JSON, no additional text.`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional legal contract analyst. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4096
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      logger.info('AI analysis completed successfully');

      // Parse the JSON response
      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch {
        // If JSON parsing fails, extract what we can
        logger.warn('AI response was not valid JSON, returning raw content');
        return {
          summary: content,
          riskClauses: [],
          overallRiskLevel: 'unknown',
          recommendations: []
        };
      }
    } catch (error) {
      logger.error('Groq AI API error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('AI service authentication failed');
      }
      if (error.response?.status === 429) {
        throw new Error('AI service rate limit exceeded. Please try again later.');
      }
      
      throw new Error('Failed to analyze contract. Please try again.');
    }
  }
}

module.exports = new AIService();
