# Configuration
BACKEND_PORT = 6787
FRONTEND_PORT = 6786

# Colors for "cool" output
CYAN  = \033[0;36m
GREEN = \033[0;32m
BLUE  = \033[0;34m
NC    = \033[0m # No Color

.PHONY: help setup dev backend-start frontend-start test clean

help:
	 @echo "$(CYAN)YumYum Development Commands:$(NC)"
	 @echo "  $(GREEN)make setup$(NC)          Install dependencies for both FE and BE"
	 @echo "  $(GREEN)make dev$(NC)            Start both servers simultaneously"
	 @echo "  $(GREEN)make test$(NC)           Run all tests"
	 @echo "  $(GREEN)make clean$(NC)          Remove pycache and build artifacts"

setup:
	 @echo "$(BLUE)Installing backend dependencies...$(NC)"
	 @pip install -r backend/requirements.txt
	 @echo "$(BLUE)Installing frontend dependencies...$(NC)"
	 @cd frontend && pnpm install
	 @echo "$(GREEN)Setup complete!$(NC)"

dev:
	 @echo "$(CYAN)🚀 Starting YumYum in development mode...$(NC)"
	 @echo "$(BLUE)Backend:  http://localhost:$(BACKEND_PORT)$(NC)"
	 @echo "$(BLUE)Frontend: http://localhost:$(FRONTEND_PORT)$(NC)"
	 @$(MAKE) -j 2 backend-start frontend-start

backend-start:
	 @fastapi dev backend/app/main.py --port $(BACKEND_PORT)

frontend-start:
	 @cd frontend && pnpm dev --port $(FRONTEND_PORT)

test:
	 @echo "$(BLUE)Running backend tests...$(NC)"
	 @pytest backend
	 @echo "$(BLUE)Running frontend tests...$(NC)"
	 @cd frontend && npx playwright test

clean:
	 @echo "$(BLUE)Cleaning up...$(NC)"
	 @find . -type d -name "__pycache__" -exec rm -rf {} +
	 @rm -rf frontend/dist
	 @echo "$(GREEN)Cleanup complete!$(NC)"
