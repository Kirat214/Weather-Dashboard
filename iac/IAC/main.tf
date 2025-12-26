# Configure the Vercel provider
terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.11.0"
    }
  }
}

# The Project on Vercel
resource "vercel_project" "weather_dashboard" {
  name      = "weather-dashboard-project"
  framework = "nextjs" # or "other" depending on your setup
}

# A Deployment
resource "vercel_deployment" "production" {
  project_id = vercel_project.weather_dashboard.id
  production = true
}