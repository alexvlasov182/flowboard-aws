#!/bin/bash
set -e

NAMESPACE=flowboard
KIND_CLUSTER=flowboard-aws

echo "=== Step 1: Delete existing backend/frontend pods ==="
kubectl delete pod -l app=flowboard-backend -n $NAMESPACE --ignore-not-found
kubectl delete pod -l app=flowboard-frontend -n $NAMESPACE --ignore-not-found

echo "=== Step 2: Build Docker images ==="
docker build -t flowboard-backend:latest ./backend
docker build -t flowboard-frontend:local ./frontend

echo "=== Step 3: Load images into kind ==="
kind load docker-image flowboard-backend:latest --name $KIND_CLUSTER
kind load docker-image flowboard-frontend:local --name $KIND_CLUSTER

echo "=== Step 4: Upgrade Helm releases ==="
helm upgrade flowboard-backend ./helm/backend -n $NAMESPACE
helm upgrade flowboard-frontend ./helm/frontend -n $NAMESPACE

echo "=== Step 5: Check pod status ==="
kubectl get pods -n $NAMESPACE

echo "✅ Deployment finished. Backend and Frontend should be running."
