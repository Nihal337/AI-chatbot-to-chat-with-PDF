import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";
import { Pinecone} from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
require('dotenv').config({ path: '.env.local' });

export async function POST(request: NextRequest) {
try {
// Extract FormData from the request
const data = await request.formData();

// Extract the uploaded file from the FormData
const file: File | null = data.get("file") as unknown as File;

// Make sure file exists
if (!file) {
return NextResponse.json({ success: false, error: "No file found" });
}

// Make sure file is a PDF
if (file.type !== "application/pdf") {
return NextResponse.json({ success: false, error: "Invalid file type" });
}

// Use the PDFLoader to load the PDF and split it into smaller documents
const pdfLoader = new PDFLoader(file);
const splitDocuments = await pdfLoader.loadAndSplit();

// Initialize the Pinecone client
const pineconeClient = new Pinecone({
environment: "gcp-starter",      
	apiKey: process.env.PINECONE_API_KEY ?? "",   
});      
   

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME as string);
console.log(process.env.PINECONE_API_KEY) ;

// Use Langchain's integration with Pinecone to store the documents
await PineconeStore.fromDocuments(splitDocuments, new OpenAIEmbeddings(), {
pineconeIndex,
});

return NextResponse.json({ success: true });
} catch (error) {
// Ensure the error is an instance of Error
if (error instanceof Error) {
console.error(error);
return NextResponse.json({ success: false, error: error.message });
} else {
// If the error is not an instance of Error, return a generic error message
console.error("An unexpected error occurred: ", error);
return NextResponse.json({ success: false, error: "An unexpected error occurred." });
}
}
}