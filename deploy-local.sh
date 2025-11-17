#!/bin/bash
set -e

echo "🚀 Deploying Flowboard to KIND..."

# Detect OS
OS="$(uname -s)"
echo "📟 Detected OS: $OS"

# Create KIND cluster
if ! kind get clusters | grep -q flowboard-aws; then
    echo "📦 Creating KIND cluster..."
    kind create cluster --name flowboard-aws
fi

# Build images
echo "🔨 Building Docker images..."
docker build -t flowboard-frontend:local -f docker/Dockerfile.frontend ./frontend
docker build -t flowboard-backend:local -f docker/Dockerfile.backend ./backend

# Load images into KIND
echo "📥 Loading images into KIND..."
kind load docker-image flowboard-frontend:local --name flowboard-aws
kind load docker-image flowboard-backend:local --name flowboard-aws

# Add Helm repo
echo "📚 Adding Helm repositories..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
helm upgrade --install flowboard-db bitnami/postgresql \
  --namespace flowboard \
  --create-namespace \
  --set auth.username=postgres \
  --set auth.password=password \
  --set auth.database=flowboard

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgresql -n flowboard --timeout=120s

# Install Backend
echo "🔧 Installing Backend..."
helm upgrade --install flowboard-backend ./helm/backend -n flowboard \
  --set image.tag=local \
  --set image.pullPolicy=Never

# Install Frontend
echo "🎨 Installing Frontend..."
helm upgrade --install flowboard-frontend ./helm/frontend -n flowboard \
  --set image.tag=local \
  --set image.pullPolicy=Never

# Install Ingress Controller
echo "🌐 Installing Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for Ingress
echo "⏳ Waiting for Ingress Controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Apply Ingress
echo "📡 Applying Ingress rules..."
kubectl apply -f helm/flowboard-ingress.yaml

# Add to /etc/hosts (Linux only)
if [[ "$OS" == "Linux" ]]; then
    if ! grep -q "flowboard.local" /etc/hosts; then
        echo "📝 Adding flowboard.local to /etc/hosts..."
        echo "127.0.0.1 flowboard.local" | sudo tee -a /etc/hosts
    fi
fi

# Port forwarding instructions
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo ""

if [[ "$OS" == "Linux" ]]; then
    echo "  1. Start port forwarding (requires sudo for port 80):"
    echo "     sudo kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 80:80"
else
    echo "  1. Start port forwarding:"
    echo "     kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 80:80"
fi

echo ""
echo "  2. Access the application:"
echo "     http://flowboard.local"
echo ""
echo "  Or use port-forward directly:"
echo "     kubectl port-forward -n flowboard svc/flowboard-frontend 3000:3000"
echo "     http://localhost:3000"
echo ""