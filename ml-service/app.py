from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class SimilarityReq(BaseModel):
    a: str
    b: str

model = SentenceTransformer("all-MiniLM-L6-v2")  # lightweight, common

@app.post("/similarity")
def similarity(req: SimilarityReq):
    emb = model.encode([req.a or "", req.b or ""], normalize_embeddings=True)
    sim = float(cosine_similarity([emb[0]], [emb[1]])[0][0])
    return {"similarity01": max(0.0, min(1.0, sim))}
