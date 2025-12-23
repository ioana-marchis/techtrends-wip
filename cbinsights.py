import os
import sys
import time
import requests

BASE  = "https://api.cbinsights.com/v2"          
CID   = os.getenv("CBI_CLIENT_ID")
CSEC  = os.getenv("CBI_CLIENT_SECRET")

_CACHE: tuple[str, float] = ("", 0.0)            

def _token() -> str:
    """Return a cached bearer token, refreshing via /v2/authorize when needed."""
    global _CACHE
    tok, exp = _CACHE
    if exp - time.time() > 60:                  
        return tok

    try:
        r = requests.post(
            f"{BASE}/authorize",                
            json={"clientId": CID, "clientSecret": CSEC},
            timeout=10,
        )
        r.raise_for_status()
    except requests.HTTPError:
        sys.stderr.write(
            f"\n[CBI] token request failed {r.status_code}: {r.text}\n"
            "Check CBI_CLIENT_ID / CBI_CLIENT_SECRET and tenant host "
            "(api.cbinsights.com vs eu-api.cbinsights.com).\n"  
        )
        raise

    data = r.json()
    _CACHE = (data["token"], time.time() + 3600) 
    return _CACHE[0]

def chatcbi(question: str) -> dict:
    """Send any user question to ChatCBI and relay its answer + citations."""
    hdr = {"Authorization": f"Bearer {_token()}",
           "Content-Type": "application/json"}
    r = requests.post(f"{BASE}/chatcbi",
                      json={"message": question}, headers=hdr, timeout=60)
    try:
        r.raise_for_status()
        return {"status": "success", **r.json()}
    except Exception as e:
        return {"status": "error", "code": r.status_code, "msg": str(e)}