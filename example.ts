import fs from "node:fs/promises";
import dotenv from "dotenv";
import {
  Document,
  MetadataMode,
  NodeWithScore, VectorStoreIndex,
} from "llamaindex";

import { HuggingFaceEmbedding } from "llamaindex/embeddings";


dotenv.config();
async function main() {
  // Load essay from abramov.txt in Node
  const path = "node_modules/llamaindex/examples/abramov.txt";

  const essay = await fs.readFile(path, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: path });

  const embedModel = new HuggingFaceEmbedding({ model: "sentence-transformers/all-MiniLM-L6-v2" });
  const serviceContext = serviceContextFromDefaults({ embedModel });


  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document], { serviceContext });


  // Query the index
  const queryEngine = index.asQueryEngine();
  const { response, sourceNodes } = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response with sources
  console.log(response);

  if (sourceNodes) {
    sourceNodes.forEach((source: NodeWithScore, index: number) => {
      console.log(
        `\n${index}: Score: ${source.score} - ${source.node.getContent(MetadataMode.NONE).substring(0, 50)}...\n`,
      );
    });
  }
}

main().catch(console.error);