import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
import { validationResult } from "express-validator"
import { UserModal } from "../models/User.model.js"
import FormData from "form-data"
import axios from "axios"
import fs from "fs";


const generateImage = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }

    try {

        const {prompt} = req.body

        const user = await UserModal.findById(req.user?._id)

        if(user.creditBalance === 0 || user.creditBalance < 0){
            return res.status(403).json("No credit Balance")
        }
        
        const formData = new FormData
        formData.append("prompt", prompt)

        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
          'x-api-key': process.env.CLIPDROP_API,
        },
        responseType : "arraybuffer"
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:image/png;base64,${base64Image}`

        await UserModal.findByIdAndUpdate(user, {
            creditBalance : user.creditBalance-1
        })

        res.status(200).json({message : "Image generated", creditBalance : user.creditBalance-1, resultImage})

    } catch (error) {
        console.log(error)
        return res.status(400).json({message : error.message})
    }
}

const geminiResponse = async ( req, res) => {
    console.log('route hit')
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }

    try {

        const {prompt} = req.body

        const user = await UserModal.findById(req.user?._id)

        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        const apiKey = process.env.GEMINI_API_KEY

        const wrappedPrompt = `
You are an AI assistant for a productivity app named TaskGenie.
The user may use voice or text input.
Always respond in the following JSON format:
{
  "reply": "Your main response here",
  "sentiment": "positive | negative | neutral",
  "tone": "friendly | helpful | formal | playful"
}
User: ${prompt}
    `.trim();

        const response = await axios.post(`${apiUrl}?key=${apiKey}`,{
          contents: [{
            parts: [{ text: wrappedPrompt}]
          }]
        })

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        if (!reply) {
          return res.status(400).json({ message: "No valid response from TaskGenie" });
        }

        const jsonMatch = reply.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(400).json({ message: "No valid response from TaskGenie"});
        }

        const result = JSON.parse(jsonMatch[0])

        return res.status(200).json( result.reply );

    } catch (error) {
        return res.status(500).json({ message: "Cannot generate the answer", error: error?.response?.data });
    }
}

const generateReview = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }

    try {
        const {code} = req.body


        const user = await UserModal.findById(req.user._id)

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

const systemInstruction = ` Here’s a solid system instruction for your AI code reviewer:

                AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

                Role & Responsibilities:

                You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers. You focus on:
                	•	Code Quality :- Ensuring clean, maintainable, and well-structured code.
                	•	Best Practices :- Suggesting industry-standard coding practices.
                	•	Efficiency & Performance :- Identifying areas to optimize execution time and resource usage.
                	•	Error Detection :- Spotting potential bugs, security risks, and logical flaws.
                	•	Scalability :- Advising on how to make code adaptable for future growth.
                	•	Readability & Maintainability :- Ensuring that the code is easy to understand and modify.

                Guidelines for Review:
                	1.	Provide Constructive Feedback :- Be detailed yet concise, explaining why changes are needed.
                	2.	Suggest Code Improvements :- Offer refactored versions or alternative approaches when possible.
                	3.	Detect & Fix Performance Bottlenecks :- Identify redundant operations or costly computations.
                	4.	Ensure Security Compliance :- Look for common vulnerabilities (e.g., SQL injection, XSS, CSRF).
                	5.	Promote Consistency :- Ensure uniform formatting, naming conventions, and style guide adherence.
                	6.	Follow DRY (Don’t Repeat Yourself) & SOLID Principles :- Reduce code duplication and maintain modular design.
                	7.	Identify Unnecessary Complexity :- Recommend simplifications when needed.
                	8.	Verify Test Coverage :- Check if proper unit/integration tests exist and suggest improvements.
                	9.	Ensure Proper Documentation :- Advise on adding meaningful comments and docstrings.
                	10.	Encourage Modern Practices :- Suggest the latest frameworks, libraries, or patterns when beneficial.

                Tone & Approach:
                	•	Be precise, to the point, and avoid unnecessary fluff.
                	•	Provide real-world examples when explaining concepts.
                	•	Assume that the developer is competent but always offer room for improvement.
                	•	Balance strictness with encouragement :- highlight strengths while pointing out weaknesses.

                Output Example:

                ❌ Bad Code:
                \`\`\`javascript
                                function fetchData() {
                    let data = fetch('/api/data').then(response => response.json());
                    return data;
                }

                    \`\`\`

                🔍 Issues:
                	•	❌ fetch() is asynchronous, but the function doesn’t handle promises correctly.
                	•	❌ Missing error handling for failed API calls.

                ✅ Recommended Fix:

                        \`\`\`javascript
                async function fetchData() {
                    try {
                        const response = await fetch('/api/data');
                        if (!response.ok) throw new Error("HTTP error! Status: $\{response.status}");
                        return await response.json();
                    } catch (error) {
                        console.error("Failed to fetch data:", error);
                        return null;
                    }
                }
                   \`\`\`

                💡 Improvements:
                	•	✔ Handles async correctly using async/await.
                	•	✔ Error handling added to manage failed requests.
                	•	✔ Returns null instead of breaking execution.

                Final Note:

                Your mission is to ensure every piece of code follows high standards. Your reviews should empower developers to write better, more efficient, and scalable code while keeping performance, security, and maintainability in mind.

                Would you like any adjustments based on your specific needs? 🚀 
    ` ;

        const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemInstruction}\n\n${code}`,
            },
          ],
        },
        ],
        });

        console.log(response)

    const review = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({review}) 

    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

const removeBg = async (req, res) => {

    console.log("route hit")
    try {
        const user = await UserModal.findById(req.user._id)

        if(user.creditBalance === 0 || user.creditBalance < 0){
            return res.status(403).json("No credit Balance")
        }

        const imagePath = req.file.path

        //Reading the image file
        const imageFile = fs.createReadStream(imagePath)

        const formData = new FormData()
        formData.append('image_file', imageFile)

        const {data} = await axios.post("https://clipdrop-api.co/remove-background/v1", formData,{
            headers : {
                'x-api-key' : process.env.CLIPDROP_API
            },
            responseType : 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await UserModal.findByIdAndUpdate(user, {
            creditBalance : user.creditBalance-1
        })

        res.status(200).json({resultImage, creditBalance : user.creditBalance-1})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message})
    }
}

export {generateImage, geminiResponse, generateReview, removeBg}