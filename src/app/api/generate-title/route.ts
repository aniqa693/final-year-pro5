//api/generate-title
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../../../../lib/db';
import { titles } from '../../../../lib/db/schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to save title to database
async function saveTitleToDatabase(
  userInput: string,
  content: any,
  contentType: string,
  tone: string,
  userEmail: string,
  userId?: number
) {
  try {
    console.log('💾 Saving title to database for user:', userEmail);
    
    const result = await db.insert(titles).values({
      userInput,
      content,
      contentType,
      tone,
      userEmail,
      createdOn: new Date().toISOString(),
    }).returning();

    console.log('✅ Title saved successfully:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Database save error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      topic, 
      tone, 
      contentType, 
      includeKeywords, 
      creativityLevel, 
      userEmail: clientEmail,
      count = 5
    } = await request.json();

    // Try to get user email from cookies first
    const cookieEmail = request.cookies.get('user-email')?.value;
    const userId = request.cookies.get('user-id')?.value;
    
    // Use cookie email if available, otherwise use client email
    const actualUserEmail = cookieEmail || clientEmail;
    
    console.log('👤 Title generation for:', {
      cookieEmail,
      clientEmail,
      actualUserEmail,
      userId
    });

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('🚀 Generating titles for:', {
      topic,
      tone,
      contentType,
      includeKeywords,
      creativityLevel,
      actualUserEmail,
      count
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Generate creative titles for the topic: "${topic}"
      Content Type: ${contentType || 'blog post'}
      Tone: ${tone || 'engaging'}
      ${includeKeywords ? 'Include SEO-friendly keywords in titles' : ''}
      Creativity level: ${creativityLevel || 7}/10
      Number of titles: ${count}
      
      For each title, provide:
      1. A compelling and catchy title (max 70 characters)
      2. A brief description (1 sentence)
      3. Suggested tags/keywords (3-5 relevant keywords)
      
      Make the titles ${tone} and optimized for ${contentType}.
      
      Return ONLY a JSON array with this exact structure:
      [
        {
          "title": "Creative Title Here",
          "description": "Brief description of what this title implies or covers",
          "tags": ["tag1", "tag2", "tag3"],
          "characterCount": 45,
          "type": "${contentType || 'blog'}"
        }
      ]
      
      Be creative, attention-grabbing, and platform-appropriate!
    `;

    console.log('🤖 Sending prompt to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    const cleanText = text.replace(/```json|```/g, '').trim();
    let generatedTitles;
    
    try {
      generatedTitles = JSON.parse(cleanText);
      console.log('✅ Successfully parsed', generatedTitles.length, 'titles');
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      const jsonMatch = cleanText.match(/\[.*\]/);
      if (jsonMatch) {
        try {
          generatedTitles = JSON.parse(jsonMatch[0]);
          console.log('✅ Extracted JSON from text:', generatedTitles.length, 'titles');
        } catch (e) {
          console.error('❌ Failed to extract JSON');
          generatedTitles = [
            {
              title: `Amazing Insights About ${topic}`,
              description: `Discover fascinating information about ${topic}`,
              tags: [topic.toLowerCase(), 'insights', 'knowledge'],
              characterCount: 35,
              type: contentType || 'blog'
            }
          ];
        }
      } else {
        console.log('⚠️ No JSON found, using fallback');
        generatedTitles = [
          {
            title: `The Ultimate Guide to ${topic}`,
            description: `Comprehensive coverage of everything about ${topic}`,
            tags: [topic, 'guide', 'ultimate'],
            characterCount: 32,
            type: contentType || 'blog'
          }
        ];
      }
    }

    // Prepare data for database
    const contentForDB = {
      titles: generatedTitles,
      settings: {
        topic,
        tone,
        contentType,
        includeKeywords,
        creativityLevel,
        count,
        generatedAt: new Date().toISOString()
      },
      metadata: {
        totalTitles: generatedTitles.length,
        hasKeywords: includeKeywords
      }
    };

    // Save to database if user is logged in (not guest)
    let savedRecord = null;
    const isGuestUser = !actualUserEmail || 
                       actualUserEmail === 'guest@example.com' || 
                       actualUserEmail.includes('guest');
    
    if (!isGuestUser && actualUserEmail) {
      try {
        savedRecord = await saveTitleToDatabase(
          topic,
          contentForDB,
          contentType || 'blog',
          tone || 'engaging',
          actualUserEmail,
          userId ? parseInt(userId) : undefined
        );
        console.log('💾 Titles saved to database with ID:', savedRecord?.id);
      } catch (dbError) {
        console.error('⚠️ Failed to save to database, but continuing with response:', dbError);
      }
    } else {
      console.log('ℹ️ Guest user, skipping database save');
    }

    // Return response
    return NextResponse.json({
      success: true,
      titles: generatedTitles,
      saveInfo: {
        saved: !!savedRecord,
        recordId: savedRecord?.id,
        userEmail: actualUserEmail,
        message: savedRecord ? 'Titles saved to database' : 'Titles not saved (guest user)'
      },
      metadata: {
        count: generatedTitles.length,
        contentType: contentType || 'blog',
        tone: tone || 'engaging',
        generatedAt: new Date().toISOString(),
        user: isGuestUser ? 'guest' : actualUserEmail
      }
    });
    
  } catch (error) {
    console.error('💥 Error generating titles:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate titles. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}