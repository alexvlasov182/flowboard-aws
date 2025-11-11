#!/bin/bash
echo "🚀 FlowBoard full system check"
echo

echo "1️⃣ Backend health:"
kubectl exec -it deploy/flowboard-backend -n flowboard -- curl -s http://localhost:8080/api/health || echo "❌ Backend not healthy"

echo
echo "2️⃣ Frontend check:"
kubectl exec -it deploy/flowboard-frontend -n flowboard -- curl -s http://localhost:80 | head -n 3 || echo "❌ Frontend not serving"

echo
echo "3️⃣ Login test:"
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"danny@example.com","password":"111111"}' | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
fi

echo
echo "4️⃣ Authorized request:"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/pages | jq .
