import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { thumbnailsTable } from '../../../../lib/db/schema';
import { desc } from 'drizzle-orm';

// Initialize ImageKit
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

// Initialize OpenAI
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Initialize Replicate
const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "demo", // Use "demo" for testing
});

// Helper function to upload file to ImageKit
async function uploadToImageKit(file: Buffer, fileName: string): Promise<string> {
  try {
    const uploadResponse = await imagekit.upload({
      file: file,
      fileName: fileName,
      isPublished: true,
      useUniqueFileName: true,
    });
    return uploadResponse.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    // Fallback: Create data URL
    const base64 = file.toString('base64');
    return `data:image/png;base64,${base64}`;
  }
}

// Helper function to generate AI prompt
async function generateAIPrompt(userInput: string, faceImageUrl?: string): Promise<string> {
  try {
    const messages: any[] = [
      {
        type: "text",
        text: `Create a professional YouTube thumbnail prompt for: "${userInput}"\n` +
              `Requirements:\n` +
              `- Aspect ratio: 16:9\n` +
              `- Style: Modern, eye-catching, bold text\n` +
              `- Colors: Vibrant and contrasting\n` +
              `- Mood: Engaging and click-worthy\n` +
              `Only return the prompt text.`
      }
    ];

    if (faceImageUrl && !faceImageUrl.startsWith('data:')) {
      messages.push({
        type: "image_url",
        image_url: { url: faceImageUrl }
      });
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-4b-it:free",
      messages: [{ role: "user", content: messages }],
      max_tokens: 200,
      temperature: 0.8,
    });

    return completion.choices[0].message.content || 
           `Professional YouTube thumbnail for "${userInput}", bold text, vibrant colors, modern design`;
  } catch (error) {
    console.error('OpenAI error:', error);
    return `YouTube thumbnail for "${userInput}", professional design, eye-catching`;
  }
}

// Helper function to generate image
async function generateImage(prompt: string): Promise<string> {
  try {
    // Try Replicate first
    const output = await replicate.run(
      "google/imagen-4-fast:8a76edf3e2bb4a0bdfa7e89c3f2e7c1b1b0b7c1b1b0b7c1b1b0b7c1b1b0b7c1b",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "16:9",
          output_format: "png",
        }
      }
    );

    // @ts-ignore
    return output.url();
  } catch (error) {
    console.error('Replicate error:', error);
    // Fallback: Use placeholder with dynamic colors
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const text = encodeURIComponent(prompt.substring(0, 40));
    return `https://placehold.co/1280x720/${randomColor}/ffffff/png?text=${text}&font=montserrat&font-size=50`;
  }
}

// Helper function to save thumbnail to database
async function saveThumbnailToDatabase(
  userInput: string,
  thumbnailURL: string,
  includeImage: string | null,
  prompt: string
) {
  try {
    const result = await db.insert(thumbnailsTable).values({
      userInput: userInput,
      thumbnailURL: thumbnailURL,
      includeImage: includeImage,
      userEmail: 'guest',
      generatedPrompt: prompt,
      createdAt: new Date(),
      model: 'imagen-4-fast',
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const userInput = formData.get('description') as string;
    const includeFace = formData.get('includeFace') as File | null;

    console.log('📝 Generating thumbnail for:', userInput);

    if (!userInput?.trim() && !includeFace) {
      return NextResponse.json(
        { error: 'Please provide a description or upload a face image' },
        { status: 400 }
      );
    }

    let uploadedFaceURL: string | null = null;

    // Step 1: Handle face image if provided
    if (includeFace) {
      try {
        const arrayBuffer = await includeFace.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const fileName = `face-${Date.now()}-${includeFace.name.replace(/\s+/g, '-')}`;
        
        if (process.env.IMAGEKIT_PUBLIC_KEY) {
          uploadedFaceURL = await uploadToImageKit(buffer, fileName);
        } else {
          // Fallback: Use data URL
          const base64 = buffer.toString('base64');
          uploadedFaceURL = `data:${includeFace.type};base64,${base64}`;
        }
        console.log('✅ Face image processed');
      } catch (error) {
        console.error('❌ Face image processing failed:', error);
      }
    }

    // Step 2: Generate AI prompt
    const prompt = await generateAIPrompt(userInput || "YouTube video", uploadedFaceURL || undefined);
    console.log('🤖 Generated prompt');

    // Step 3: Generate image
    const generatedImageURL = await generateImage(prompt);
    console.log('🖼️ Generated image');

    // Step 4: Upload generated image if ImageKit is configured
    let finalThumbnailURL = generatedImageURL;
    
    if (process.env.IMAGEKIT_PUBLIC_KEY && !generatedImageURL.includes('placehold.co')) {
      try {
        const response = await fetch(generatedImageURL);
        const imageBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);
        
        const fileName = `thumbnail-${Date.now()}.png`;
        finalThumbnailURL = await uploadToImageKit(buffer, fileName);
        console.log('✅ Thumbnail uploaded to ImageKit');
      } catch (error) {
        console.error('❌ Thumbnail upload failed, using direct URL:', error);
      }
    }

    // Step 5: Save to database
    let savedRecord = null;
    try {
      savedRecord = await saveThumbnailToDatabase(
        userInput || "Untitled",
        finalThumbnailURL,
        uploadedFaceURL,
        prompt
      );
      console.log('💾 Saved to database');
    } catch (dbError) {
      console.error('⚠️ Database save failed:', dbError);
    }

    // Step 6: Return response
    return NextResponse.json({
      success: true,
      thumbnailUrl: finalThumbnailURL,
      saveInfo: {
        saved: !!savedRecord,
        recordId: savedRecord?.id || 'not_saved',
      },
      metadata: {
        hasFaceImage: !!uploadedFaceURL,
        prompt: prompt.substring(0, 150) + (prompt.length > 150 ? '...' : ''),
        generatedAt: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error('💥 Error generating thumbnail:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate thumbnail. Please try again.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('📋 Fetching thumbnails...');
    
    const result = await db
      .select()
      .from(thumbnailsTable)
      .orderBy(desc(thumbnailsTable.createdAt))
      .limit(50);
    
    console.log(`✅ Found ${result.length} thumbnails`);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Error fetching thumbnails:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch thumbnails',
        details: error.message,
      },
      { status: 500 }
    );
  }
}