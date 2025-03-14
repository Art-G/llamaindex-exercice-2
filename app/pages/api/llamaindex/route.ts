import { SimpleDirectoryReader } from "@llamaindex/readers/directory";
import { VectorStoreIndex, Settings, BaseOutputParser } from "llamaindex";
import { OpenAI } from "@llamaindex/openai";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";

type ResponseData = {
  message?: string
  error?: string
}

Settings.llm = new OpenAI({ model: "gpt-3.5-turbo", temperature: 0, apiKey: '' });

// This method will load the data to the index.
// Files located in the ./data folder will now be accessible by our model.
const initializeIndex = async () => {

  const reader = new SimpleDirectoryReader();
  const documents = await reader.loadData("./app/data");

  return VectorStoreIndex.fromDocuments(documents);
};

// This is a POST method to send a network query with our questions.
export async function POST(req: NextRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Get the query you pass on the client side.
    const { query } = await req.json();

    if (!query) {
      return res.status(400).json({ error: "Query not provided" });
    }

    // Init the index.
    const index = await initializeIndex();

    // get retriever
    const retriever = index.asRetriever();
    
    // Create a query engine
    const queryEngine = index.asQueryEngine({
      retriever,
    });

    // Query
    const response = await queryEngine.query({
      query,
    });
    console.log('#### POST', { response });
    
    return NextResponse.json({ message: response.message.content.toString() });
  } catch (error) {
    console.error({ error });
    return NextResponse
      .json({ message: "An error occurred while processing the query" });
  }
}
