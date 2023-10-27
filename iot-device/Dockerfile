# Dockerfile
FROM python:3.9-slim-buster

# Install required system packages
RUN apt-get update && apt-get install -y \
    gcc \
    libraspberrypi-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY . .

# Command to run the application
CMD ["python", "http_client.py"]
