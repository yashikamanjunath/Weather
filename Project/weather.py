import requests
from datetime import datetime

# OpenWeatherMap API Key
API_KEY = "e6e03379381427ba989fa95caeaca847"  # Make sure this is a valid key

# Get user input for location
location = input("Enter the city name: ").strip()

# Construct API URL
complete_api_link = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=metric"

try:
    # Fetch API data
    api_link = requests.get(complete_api_link)
    api_link.raise_for_status()  # Raise an exception for HTTP errors
    api_data = api_link.json()

    # Debugging: Print raw API response
    print("API Response:", api_data)  # Remove this after debugging

    # Check if the API response contains weather data
    if api_data.get("cod") != 200:
        print(f"Error: {api_data.get('message', 'Unable to fetch data')}")
    else:
        # Extract weather details
        temp_city = api_data['main']['temp']
        weather_desc = api_data['weather'][0]['description']
        hmdt = api_data['main']['humidity']
        wind_spd = api_data['wind']['speed']
        date_time = datetime.now().strftime("%d %b %Y | %I:%M:%S %p")

        # Display weather details
        print("\n-------------------------------------------------------------")
        print(f"Weather Stats for - {location.upper()} || {date_time}")
        print("-------------------------------------------------------------")
        print(f"Current temperature  : {temp_city:.2f}°C")
        print(f"Current weather desc : {weather_desc.capitalize()}")
        print(f"Current Humidity     : {hmdt}%")
        print(f"Current wind speed   : {wind_spd} km/h")

except requests.exceptions.RequestException as e:
    print(f"Error fetching data: {e}")
