# SmartAgriculturePublic
Project for COMP4447_COMP5047
* Embedded software in plant water dropper using the Arduino framework
* Automatically cares for household plants by providing water and nutrients for the plants
* Measures the plant’s humidity and light level to determine the best water levels

# Setup
* Change UserInterface/Backend/settings.py SECRET_KEY to your_secret_key
* Register OPENAI_API_KEY in env
* Change UserInterface/mqtt.py mqtt_vals to correct logins
* Install requirements.txt
* Run python manage.py runserver
* Run python mqtt.py
