const { pipeline } = require('@xenova/transformers');
const cosineSimilarity = require('cosine-similarity');
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');
const Advisor = require('../models/Advisor');
const Match = require('../models/Match');

// Initialize the embedding model (lazy loading)
let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

// Generate text embedding
async function generateEmbedding(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Calculate semantic similarity between two texts
async function calculateSemanticSimilarity(text1, text2) {
  try {
    const embedding1 = await generateEmbedding(text1);
    const embedding2 = await generateEmbedding(text2);
    const similarity = cosineSimilarity(embedding1, embedding2);
    return Math.max(0, Math.min(100, similarity * 100)); // Convert to 0-100 scale
  } catch (error) {
    console.error('Error calculating semantic similarity:', error);
    return 0;
  }
}

// Match startup with investors
async function matchStartupWithInvestors(startupId) {
  try {
    const startup = await Startup.findById(startupId);
    if (!startup) {
      throw new Error('Startup not found');
    }

    // Get all active investors
    const investors = await Investor.find({ isActive: true });

    const matches = [];

    for (const investor of investors) {
      const score = await calculateInvestorMatch(startup, investor);
      
      if (score.total >= 30) { // Only include matches with score >= 30%
        const match = {
          startupId: startup._id,
          candidateId: investor._id,
          candidateModel: 'Investor',
          type: 'Investor',
          score: Math.round(score.total),
          matchFactors: {
            sectorMatch: Math.round(score.sector),
            stageMatch: Math.round(score.stage),
            fundingMatch: Math.round(score.funding),
            locationMatch: Math.round(score.location),
            semanticMatch: Math.round(score.semantic)
          },
          reason: generateMatchReason(score, investor, 'investor'),
          highlights: generateHighlights(score, investor, 'investor')
        };

        matches.push(match);
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    // Save top matches to database
    const topMatches = matches.slice(0, 20); // Save top 20 matches
    
    // Delete old matches for this startup
    await Match.deleteMany({ startupId: startup._id, type: 'Investor' });

    // Insert new matches
    if (topMatches.length > 0) {
      await Match.insertMany(topMatches);
    }

    return topMatches;
  } catch (error) {
    console.error('Error matching startup with investors:', error);
    throw error;
  }
}

// Calculate match score between startup and investor
async function calculateInvestorMatch(startup, investor) {
  const scores = {
    sector: 0,
    stage: 0,
    funding: 0,
    location: 0,
    semantic: 0,
    total: 0
  };

  // 1. Sector match (25% weight)
  if (investor.sectors.includes(startup.sector)) {
    scores.sector = 100;
  } else if (investor.sectors.includes('Other')) {
    scores.sector = 50;
  }

  // 2. Stage match (20% weight)
  if (investor.preferredStages.includes(startup.stage)) {
    scores.stage = 100;
  } else {
    // Partial match for adjacent stages
    const stageOrder = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];
    const startupStageIndex = stageOrder.indexOf(startup.stage);
    const investorStages = investor.preferredStages.map(s => stageOrder.indexOf(s));
    const minDistance = Math.min(...investorStages.map(i => Math.abs(i - startupStageIndex)));
    scores.stage = Math.max(0, 100 - (minDistance * 25));
  }

  // 3. Funding match (20% weight)
  const fundingRequired = (startup.fundingRequired.min + startup.fundingRequired.max) / 2;
  const investorRange = (investor.investmentRange.min + investor.investmentRange.max) / 2;
  
  if (fundingRequired >= investor.investmentRange.min && fundingRequired <= investor.investmentRange.max) {
    scores.funding = 100;
  } else {
    const difference = Math.abs(fundingRequired - investorRange);
    const maxRange = investor.investmentRange.max;
    scores.funding = Math.max(0, 100 - ((difference / maxRange) * 100));
  }

  // 4. Location match (10% weight)
  if (investor.geographicFocus && investor.geographicFocus.length > 0) {
    if (investor.geographicFocus.some(loc => 
      startup.location.toLowerCase().includes(loc.toLowerCase()) ||
      loc.toLowerCase().includes(startup.location.toLowerCase())
    )) {
      scores.location = 100;
    } else {
      scores.location = 30; // Some points for being open to other locations
    }
  } else {
    scores.location = 50; // No preference means neutral
  }

  // 5. Semantic similarity (25% weight) - Compare descriptions
  const startupText = `${startup.companyName} ${startup.description} ${startup.tags.join(' ')}`;
  const investorText = `${investor.bio || ''} ${investor.preferences?.lookingFor || ''} ${investor.sectors.join(' ')}`;
  scores.semantic = await calculateSemanticSimilarity(startupText, investorText);

  // Calculate weighted total
  scores.total = (
    scores.sector * 0.25 +
    scores.stage * 0.20 +
    scores.funding * 0.20 +
    scores.location * 0.10 +
    scores.semantic * 0.25
  );

  return scores;
}

// Match startup with advisors
async function matchStartupWithAdvisors(startupId) {
  try {
    const startup = await Startup.findById(startupId);
    if (!startup) {
      throw new Error('Startup not found');
    }

    // Get all active advisors
    const advisors = await Advisor.find({ isActive: true, availability: { $ne: 'Not Available' } });

    const matches = [];

    for (const advisor of advisors) {
      const score = await calculateAdvisorMatch(startup, advisor);
      
      if (score.total >= 30) {
        const match = {
          startupId: startup._id,
          candidateId: advisor._id,
          candidateModel: 'Advisor',
          type: 'Advisor',
          score: Math.round(score.total),
          matchFactors: {
            sectorMatch: Math.round(score.industry),
            experienceMatch: Math.round(score.experience),
            semanticMatch: Math.round(score.semantic)
          },
          reason: generateMatchReason(score, advisor, 'advisor'),
          highlights: generateHighlights(score, advisor, 'advisor')
        };

        matches.push(match);
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    // Save top matches
    const topMatches = matches.slice(0, 20);
    
    await Match.deleteMany({ startupId: startup._id, type: 'Advisor' });

    if (topMatches.length > 0) {
      await Match.insertMany(topMatches);
    }

    return topMatches;
  } catch (error) {
    console.error('Error matching startup with advisors:', error);
    throw error;
  }
}

// Calculate match score between startup and advisor
async function calculateAdvisorMatch(startup, advisor) {
  const scores = {
    industry: 0,
    experience: 0,
    semantic: 0,
    rating: 0,
    total: 0
  };

  // 1. Industry match (30% weight)
  if (advisor.industries.includes(startup.sector)) {
    scores.industry = 100;
  } else if (advisor.industries.includes('Other')) {
    scores.industry = 50;
  }

  // 2. Experience (25% weight)
  scores.experience = Math.min(100, (advisor.yearsOfExperience / 20) * 100);

  // 3. Semantic similarity (30% weight)
  const startupText = `${startup.companyName} ${startup.description} ${startup.stage}`;
  const advisorText = `${advisor.bio} ${advisor.specializations.join(' ')} ${advisor.expertise.map(e => e.area).join(' ')}`;
  scores.semantic = await calculateSemanticSimilarity(startupText, advisorText);

  // 4. Rating bonus (15% weight)
  scores.rating = (advisor.averageRating / 5) * 100;

  // Calculate weighted total
  scores.total = (
    scores.industry * 0.30 +
    scores.experience * 0.25 +
    scores.semantic * 0.30 +
    scores.rating * 0.15
  );

  return scores;
}

// Generate match reason text
function generateMatchReason(scores, candidate, type) {
  const reasons = [];

  if (type === 'investor') {
    if (scores.sector >= 80) reasons.push('Strong sector alignment');
    if (scores.stage >= 80) reasons.push('Perfect stage match');
    if (scores.funding >= 80) reasons.push('Funding range fits well');
    if (scores.semantic >= 70) reasons.push('High interest alignment');
  } else {
    if (scores.industry >= 80) reasons.push('Industry expertise match');
    if (scores.experience >= 70) reasons.push('Extensive experience');
    if (scores.semantic >= 70) reasons.push('Relevant background');
    if (scores.rating >= 80) reasons.push('Highly rated advisor');
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Potential good fit based on profile analysis';
}

// Generate highlights array
function generateHighlights(scores, candidate, type) {
  const highlights = [];

  if (type === 'investor') {
    if (scores.sector >= 80) highlights.push(`Invests in ${candidate.sectors.join(', ')}`);
    if (scores.stage >= 80) highlights.push(`Focuses on ${candidate.preferredStages.join(', ')} stage`);
    if (candidate.previousInvestments && candidate.previousInvestments.length > 0) {
      highlights.push(`${candidate.previousInvestments.length} previous investments`);
    }
  } else {
    if (scores.industry >= 80) highlights.push(`Expert in ${candidate.industries.join(', ')}`);
    highlights.push(`${candidate.yearsOfExperience}+ years of experience`);
    if (candidate.averageRating >= 4) highlights.push(`${candidate.averageRating.toFixed(1)}⭐ rating`);
    if (candidate.specializations.length > 0) {
      highlights.push(`Specializes in ${candidate.specializations.slice(0, 2).join(', ')}`);
    }
  }

  return highlights;
}

module.exports = {
  matchStartupWithInvestors,
  matchStartupWithAdvisors,
  calculateSemanticSimilarity
};

