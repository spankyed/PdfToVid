// import json;
import { ChromaClient } from 'chromadb';
import { pipeline } from 'transformers.js';  // Assuming this is the correct import for transformers.js

// Constants
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const COLLECTION_NAME = "paper-embeddings";
const PATH_REF_PAPERS = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json';

const client = new ChromaClient();

class SBertEmbeddingFunction {
    private extractor: any;

    constructor(modelName: string) {
        this.extractor = pipeline('feature-extraction', modelName);
    }

    public async generate(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = await Promise.all(texts.map(async text => {
            const output = await this.extractor(text, { pooling: 'mean', normalize: true });
            return Array.from(output.data) as number[];
        }));
        return embeddings;
    }
}

const embedder = new SBertEmbeddingFunction(MODEL_NAME);

async function storePaperEmbeddingsInChroma(papers: any[], collectionName: string = COLLECTION_NAME) {
    const embeddings = await embedder.generate(papers.map(paper => paper.title + ". " + paper.abstract));
    
    if (!client.listCollections().includes(collectionName)) {
        client.createCollection(collectionName);
    }
    const collection = client.getCollection(collectionName);
    collection.add({
        documents: embeddings,
        metadatas: papers,
        ids: papers.map(paper => paper.id)
    });
}

async function getRelevancyScores(papers: any[], nResults = 5): Promise<any[]> {
    if (!client.listCollections().includes(COLLECTION_NAME)) {
        const refPapers = JSON.parse(fs.readFileSync(PATH_REF_PAPERS, 'utf-8'));
        await storePaperEmbeddingsInChroma(refPapers);
    }

    const collection = await client.getCollection(COLLECTION_NAME);
    for (let paper of papers) {
        const queryEmbedding = await embedder.generate([paper.title + ". " + paper.abstract]);
        const results = await collection.query({ queryTexts: queryEmbedding, nResults: nResults });
        
        const relevancyScores = results[0].map(res => res.score);
        const avgRelevancy = relevancyScores.reduce((a, b) => a + b, 0) / (relevancyScores.length || 1);

        paper.metaData = paper.metaData || {};
        paper.metaData.relevancy = avgRelevancy;
    }

    return papers;
}
