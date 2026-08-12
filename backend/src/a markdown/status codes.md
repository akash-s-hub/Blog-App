# HTTP Status Codes — Common & Important

## 2XX Status Codes
200 — OK: Request succeeded; response contains the requested data. \
201 — Created: 
Request succeeded and a new resource was created. \
202 — Accepted: Request received and will be processed asynchronously. \
204 — No Content: Request succeeded but there is no response body.

## 3XX Status codes
301 — Moved Permanently: Resource has a new permanent URI. \
302 — Found: Resource temporarily located under a different URI. \
304 — Not Modified: Cached resource is still valid; no body returned. 

## 4XX Status Codes
400 — Bad Request: Server cannot process the malformed or invalid request. \
401 — Unauthorized: Authentication required or failed. \
403 — Forbidden: Authentication succeeded but client lacks permission. \
404 — Not Found: The requested resource does not exist. \
409 — Conflict: Request conflicts with current resource state (e.g., duplicate). \
422 — Unprocessable Entity: Semantic validation failed for the request. \
429 — Too Many Requests: Client has sent too many requests in a given time.

## 5XX Status Codes
500 — Internal Server Error: Generic server-side error. \
502 — Bad Gateway: Invalid response received from an upstream server. \
503 — Service Unavailable: Server is overloaded or down for maintenance.