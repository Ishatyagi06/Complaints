const axios = require('axios');

// @desc    Analyze complaint using AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required for AI analysis' });
    }

    const apiKey = process.env.AI_API_KEY;
    
    if (!apiKey) {
       // Mock response if no API key is provided
       return res.json({
         priority: "High",
         department: category === "Water Supply" ? "Water Department" : "General Administration",
         summary: `This is an automated summary of the complaint titled "${title}". The user reported: ${description.substring(0, 50)}...`,
         autoResponse: "Thank you for your complaint. We have logged it and our team will look into it shortly."
       });
    }

    const prompt = `
      Analyze the following complaint:
      Title: ${title}
      Category: ${category}
      Description: ${description}

      Provide a JSON response with the following keys:
      1. priority: Detect the urgency (High, Medium, Low).
      2. department: Suggest the responsible department.
      3. summary: Generate a brief 1-sentence summary.
      4. autoResponse: Generate an automatic, polite response message to the user acknowledging the specific issue.

      Only return valid JSON, no markdown formatting blocks.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
          'X-Title': 'Complaint System' // Required by OpenRouter
        }
      }
    );

    const aiText = response.data.choices[0].message.content;
    
    // Attempt to parse JSON response
    try {
        // Strip markdown backticks if present
        const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        res.json(parsedResponse);
    } catch (parseError) {
        console.error("Failed to parse AI response as JSON", aiText);
        // Fallback response if parsing fails
        res.json({
            priority: "Medium",
            department: category || "General Support",
            summary: "Unable to parse summary. Original issue: " + title,
            autoResponse: "We have received your complaint and will review it soon."
        });
    }

  } catch (error) {
    console.error('AI Analysis Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to analyze complaint with AI' });
  }
};

module.exports = {
  analyzeComplaint
};
