#!/bin/bash

echo "======================================"
echo "TESTE DO SERVIDOR - SVlentes"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testando $name... "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" = "$expected" ]; then
        echo -e "${GREEN}✓ OK${NC} (Status: $status)"
        return 0
    else
        echo -e "${RED}✗ FALHOU${NC} (Status: $status, Esperado: $expected)"
        return 1
    fi
}

# Verificar se o servidor está rodando
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${RED}Servidor não está rodando na porta 3000${NC}"
    echo "Iniciando servidor..."
    npm run dev > /tmp/nextjs-test.log 2>&1 &
    sleep 8
fi

echo "Servidor rodando em: http://localhost:3000"
echo ""

# Testes
passed=0
failed=0

# Teste 1: Página Principal
if test_endpoint "Página Principal" "http://localhost:3000/" "200"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 2: API Health Check
echo -n "Testando Health Check API... "
response=$(curl -s http://localhost:3000/api/health-check 2>/dev/null)
if echo "$response" | grep -q "status"; then
    echo -e "${GREEN}✓ OK${NC}"
    ((passed++))
else
    echo -e "${RED}✗ FALHOU${NC}"
    echo "Response: $response"
    ((failed++))
fi

# Teste 3: Calculadora
if test_endpoint "Calculadora" "http://localhost:3000/calculadora" "200"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 4: Agendar Consulta
if test_endpoint "Agendar Consulta" "http://localhost:3000/agendar-consulta" "200"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 5: Página de Sucesso
if test_endpoint "Página de Sucesso" "http://localhost:3000/success" "200"; then
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "======================================"
echo "RESULTADO DOS TESTES"
echo "======================================"
echo -e "Passou: ${GREEN}$passed${NC}"
echo -e "Falhou: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Alguns testes falharam. Verifique os logs.${NC}"
    echo "Logs em: /tmp/nextjs-test.log"
    exit 1
fi
