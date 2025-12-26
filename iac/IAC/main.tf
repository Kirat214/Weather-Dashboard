terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.11.0"
    }
  }
}

resource "vercel_project" "weather_dashboard" {
  name      = "weather-dashboard-project"
  framework = "nextjs"
}

# FIXED: Added the 'project_settings' and 'ref' to satisfy the error
resource "vercel_deployment" "production" {
  project_id = vercel_project.weather_dashboard.id
  production = true
  # This tells Vercel to deploy from the main branch
  ref        = "main" 
}